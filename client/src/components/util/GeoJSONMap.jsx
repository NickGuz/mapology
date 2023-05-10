import { useState, useContext, useEffect } from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import GlobalStoreContext from '../../store/store';
import * as RequestApi from '../../store/GlobalStoreHttpRequestApi';
import * as L from 'leaflet';
import AuthContext from '../../auth/AuthContextProvider';
import Control from 'react-leaflet-custom-control';
import { Stack } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import MergeIcon from '@mui/icons-material/Merge';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import AbcIcon from '@mui/icons-material/Abc';
import EditLocationAlt from '@mui/icons-material/EditLocationAlt';
import { GeomanControls } from 'react-leaflet-geoman-v2';
import ChangeNameModal from '../modals/ChangeNameModal';
import PropertiesModal from '../modals/RegionPropertyModal';
import MapLegend from './MapLegend';
import * as turf from '@turf/turf';

const GeoJSONMap = () => {
  const [currLayer, setCurrLayer] = useState();
  const [currFeature, setCurrFeature] = useState();
  const [editOpen, setEditOpen] = useState(false);
  const [propOpen, setPropOpen] = useState(false);
  const [boundsSet, setBoundsSet] = useState(false);

  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const map = useMap();

  useEffect(() => {
    store.setCurrentMap(store.currentMap);

    if (store.currentMap && !boundsSet) {
      const latlngs = [];
      store.currentMap.json.features.forEach((f) => {
        f.geometry.coordinates.forEach((polygon) => {
          if (f.geometry.type === 'MultiPolygon') {
            polygon[0].forEach((p) => latlngs.push([p[1], p[0]]));
          } else {
            polygon.forEach((p) => latlngs.push([p[1], p[0]]));
          }
        });
      });

      let bounds = new L.LatLngBounds(latlngs);
      map.fitBounds(bounds);
      setBoundsSet(true);
    }

    if (store.currentMap && !map.hasEventListeners('pm:create')) {
      map.on('pm:create', (event) => {
        handleCreatePolygon(event);
      });
    }
    // console.log('useEffect', store.currentMap);
  }, [store.currentMap, store.currentLegend]);

  const mapStyle = {
    fillOpacity: 0.5,
    weight: 1.5,
  };

  const handleVertexDragEnd = (evt) => {
    // map.editTools.commitDrawing();
    let mapClone = JSON.parse(JSON.stringify(store.currentMap));

    const newFeature = evt.layer.toGeoJSON();

    store.currentMap.json.features = store.currentMap.json.features.filter(
      (f) => f.id !== newFeature.id
    );
    store.currentMap.json.features.push(newFeature);
    store.setCurrentMap(store.currentMap);
    RequestApi.updateFeatureGeometry(newFeature.id, newFeature.geometry);
    store.addEditMapTransaction(mapClone, store.currentMap);
  };

  const handleVertexRawClick = (evt) => {
    // removeVertex(evt.vertex.latlng);
    removeVertex(evt);
  };

  const handleRenameRegion = (feature, layer) => {
    setCurrFeature(feature);
    setCurrLayer(layer);
    setEditOpen(true);
  };

  const rename = (feature, name /*, layer*/) => {
    let mapClone = JSON.parse(JSON.stringify(store.currentMap));

    const oldName = getFeatureName(feature);
    // setfeatureName(feature, name);
    renameAll(feature, oldName, name);

    RequestApi.updateFeatureProperties(feature.id, feature.properties);

    store.setCurrentMap(store.currentMap);
    store.addEditMapTransaction(mapClone, store.currentMap);
    store.setSelectedFeatures(
      store.selectedFeatures.filter((x) => x !== feature)
    );
  };

  const renameAll = (feature, oldName, newName) => {
    // find all keys with the old name
    let keys = Object.keys(feature.properties);
    for (let key of keys) {
      if (feature.properties[key] === oldName) {
        feature.properties[key] = newName;
      }
    }
  };

  const removeVertex = (evt) => {
    if (!window.confirm('Are you sure you want to delete this vertex?')) {
      return;
    }

    let mapClone = JSON.parse(JSON.stringify(store.currentMap));

    const vertex = evt.markerEvent.latlng;
    const lat = vertex.lat;
    const lng = vertex.lng;
    // console.log("to delete", vertex);

    // // Get the vertices to remove
    let toRemove = [];
    store.currentMap.json.features.forEach((f) => {
      f.geometry.coordinates.forEach((polygon) => {
        if (f.geometry.type === 'MultiPolygon') {
          polygon[0].forEach((coord) => {
            if (
              Math.abs(coord[0] - lng) < 0.0001 &&
              Math.abs(coord[1] - lat) < 0.0001
            ) {
              toRemove.push(f);
            }
          });
        } else {
          polygon.forEach((coord) => {
            if (
              Math.abs(coord[0] - lng) < 0.0001 &&
              Math.abs(coord[1] - lat) < 0.0001
            ) {
              toRemove.push(f);
            }
          });
        }
      });
    });

    if (toRemove.length >= 3) {
      window.alert('Cannot delete a vertex shared by more than 2 regions');
      return;
    }

    // Remove the vertices
    toRemove.forEach((f) => {
      if (f.geometry.type === 'MultiPolygon') {
        for (let polygon of f.geometry.coordinates) {
          polygon[0] = polygon[0].filter(
            (coords) =>
              !(
                Math.abs(coords[0] - lng) < 0.0001 &&
                Math.abs(coords[1] - lat) < 0.0001
              )
          );
        }
      } else {
        f.geometry.coordinates[0] = f.geometry.coordinates[0].filter(
          (coords) =>
            !(
              Math.abs(coords[0] - lng) < 0.0001 &&
              Math.abs(coords[1] - lat) < 0.0001
            )
        );
      }
    });

    store.setCurrentMap(store.currentMap);
    toRemove.forEach((f) => {
      RequestApi.updateFeatureGeometry(f.id, f.geometry);
    });

    store.addEditMapTransaction(mapClone, store.currentMap);
  };

  const handleDeleteFeature = (feature) => {
    let mapClone = JSON.parse(JSON.stringify(store.currentMap));
    RequestApi.deleteFeature(feature.id);
    store.currentMap.json.features = store.currentMap.json.features.filter(
      (f) => f.id !== feature.id
    );
    store.setCurrentMap(store.currentMap);
    store.addEditMapTransaction(mapClone, store.currentMap);
  };

  const merge = async () => {
    const firstGeom = store.selectedFeatures[0];

    let name = window.prompt('Input a name for the merged region');
    if (!name) return;

    let mapClone = JSON.parse(JSON.stringify(store.currentMap));

    const mergedFeature = store.selectedFeatures.reduce((merged, region) => {
      return turf.union(merged, region);
    }, firstGeom);

    mergedFeature.properties.NAME_0 = name;

    // Delete features from DB
    store.selectedFeatures.forEach((f) => {
      RequestApi.deleteFeature(f.id);
    });

    // Add new feature to DB first to get back auto-generated ID
    const res = await RequestApi.insertFeature(
      store.currentMap.mapInfo.id,
      mergedFeature
    );
    const newFeature = res.data.data;

    // Add new feature to current json data
    store.currentMap.json.features.push(newFeature);

    // Delete merged regions
    store.currentMap.json.features = store.currentMap.json.features.filter(
      (region) => !store.selectedFeatures.includes(region)
    );

    // Update the store to rerender
    store.setCurrentMap(store.currentMap);
    store.setSelectedFeatures([]);
    store.addEditMapTransaction(mapClone, store.currentMap);
  };

  // const editAttribute = () => {
  //   // setEdit(true);
  //   // setCustomAttr(false);
  //   // if (regionProps != null) {
  //   //   handleDrawerOpen();
  //   // }
  // };

  const getFeatureName = (feature) => {
    let featureName;

    if (feature.properties.NAME_2) featureName = feature.properties.NAME_2;
    else if (feature.properties.NAME_1) featureName = feature.properties.NAME_1;
    else if (feature.properties.NAME_0) featureName = feature.properties.NAME_0;
    else if (feature.properties.name) featureName = feature.properties.name;

    return featureName;
  };

  // const setFeatureName = (feature, name) => {
  //   if (feature.properties.NAME_2) feature.properties.NAME_2 = name;
  //   else if (feature.properties.NAME_1) feature.properties.NAME_1 = name;
  //   else if (feature.properties.NAME_0) feature.properties.NAME_0 = name;
  //   else if (feature.properties.name) feature.properties.name = name;
  // };

  const selectRegion = (event) => {
    if (store.selectedFeatures.includes(event.target.feature)) {
      store.setSelectedFeatures(
        store.selectedFeatures.filter((x) => x !== event.target.feature)
      );
      return false;
    } else {
      store.setSelectedFeatures([
        ...store.selectedFeatures,
        event.target.feature,
      ]);
      return true;
    }
  };

  const onFeature = (feature, layer) => {
    let country = getFeatureName(feature);
    // if (!country) throw new Error('Could not find region name');
    if (!country) country = '';

    layer
      .bindTooltip(country, {
        className: 'countryLabel',
        permanent: true,
        opacity: 0.7,
        direction: 'center',
      })
      .openTooltip();

    layer.on({
      dblclick: () => {
        if (!auth.loggedIn) {
          return;
        }
        handleRenameRegion(feature, layer);
      },
      mouseover: () => {
        // if (!store.selectedFeatures.includes(event.target.feature)) {
        //   event.target.setStyle({
        //     fillColor: "purple",
        //   });
        // }
      },
      mouseout: () => {
        // if (!store.selectedFeatures.includes(event.target.feature)) {
        //   event.target.setStyle({
        //     fillColor: "blue",
        //   });
        // }
      },
      click: (event) => {
        if (!auth.loggedIn) {
          return;
        }
        selectRegion(event);
      },
      'pm:markerdragend': (event) => {
        handleVertexDragEnd(event);
      },
      'pm:vertexclick': (event) => {
        handleVertexRawClick(event);
      },
      'pm:remove': (event) => {
        handleDeleteFeature(event.target.feature);
      },
    });

    // set selected features
    // if (layer.editEnabled()) {
    //   console.log("edit enabled");
    //   layer.setStyle({ fillColor: "green" });
    // }

    // console.log("calling on each feature");

    // Set fill color
    if (feature.properties.fillColor) {
      layer.setStyle({ fillColor: feature.properties.fillColor });
      if (!(feature.properties.fillColor in store.currentLegend)) {
        store.setCurrentLegend({
          ...store.currentLegend,
          [feature.properties.fillColor]: feature.properties.fillColor,
        });
      }
    } else {
      layer.setStyle({ fillColor: '#0000ff' });
      if (!('#0000ff' in store.currentLegend)) {
        store.setCurrentLegend({
          ...store.currentLegend,
          '#0000ff': '#0000ff',
        });
      }
    }

    // // Set border color
    if (feature.properties.borderColor) {
      layer.setStyle({ color: feature.properties.borderColor });
    } else {
      layer.setStyle({ color: 'black' });
    }

    const selected = store.selectedFeatures.find((f) => f.id === feature.id);
    if (selected) {
      layer.setStyle({ fillColor: 'green' });
    }
  };

  const updateProperties = (feature, properties) => {
    feature.properties = properties;

    RequestApi.updateFeatureProperties(feature.id, feature.properties);

    store.setSelectedFeatures(
      store.selectedFeatures.filter((x) => x !== feature)
    );
  };

  const addProperties = (feature, newProperties) => {
    const updatedProperties = {
      ...feature.properties,
      ...newProperties,
    };
    updateProperties(feature, updatedProperties);
  };

  const handleCreatePolygon = (event) => {
    const feature = event.layer.toGeoJSON();
    const name = window.prompt('Enter a name for this feature:');
    feature.properties['name'] = name;

    store.currentMap.json.features.push(feature);
    store.setCurrentMap(store.currentMap);
    RequestApi.insertFeature(store.currentMap.mapInfo.id, feature);

    // Remove the layer created by geoman
    map.removeLayer(event.layer);
  };

  return (
    <div>
      {store.currentMap && (
        <GeoJSON
          // key={store.mapUpdates}
          key={store.selectedFeatures.length + store.mapUpdates}
          style={mapStyle}
          // map={map}
          data={store.currentMap.json.features}
          onEachFeature={onFeature}
        />
      )}
      <Control position="topright">
        <Stack direction="column">
          <Tooltip title="Delete">
            <Button
              sx={{ color: 'black', backgroundColor: 'white' }}
              onClick={() => {}}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Merge">
            <Button
              sx={{ color: 'black', backgroundColor: 'white' }}
              onClick={() => merge()}
            >
              <MergeIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Edit Attributes">
            <Button
              onClick={() => {
                setPropOpen(true);
              }}
              sx={{ color: 'black', backgroundColor: 'white' }}
            >
              <EditAttributesIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Rename Region">
            <Button
              sx={{ color: 'black', backgroundColor: 'white' }}
              onClick={() => {
                if (store.selectedFeatures.length !== 1) {
                  window.alert('Cannot rename more than 1 region at a time');
                  return;
                }
                setEditOpen(true);
              }}
            >
              <AbcIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Edit Vertices">
            <Button
              sx={{ color: 'black', backgroundColor: 'white' }}
              // onClick={handleToggleEditVertices}
            >
              <EditLocationAlt />
            </Button>
          </Tooltip>
        </Stack>
      </Control>
      <ChangeNameModal
        layer={currLayer}
        show={editOpen}
        feature={currFeature}
        rename={(currFeature, name, layer) => rename(currFeature, name, layer)}
        close={() => setEditOpen(false)}
      />
      <PropertiesModal
        layer={currLayer}
        updateProperties={updateProperties}
        addProperties={addProperties}
        show={propOpen}
        close={() => setPropOpen(false)}
      />
      <GeomanControls
        options={{
          position: 'topleft',
          drawText: true,
          rotateMode: false,
          drawMarker: false,
          drawPolyline: false,
          drawCircle: false,
          drawCircleMarker: false,
          drawRectangle: false,
          cutPolygon: false,
        }}
        globalOptions={{
          continueDrawing: true,
          editable: false,
          limitMarkersToCount: 10,
          hideMiddleMarkers: true,
          // limitMarkersToClick: true,
          // limitMarkersToViewport: true,
        }}
        pathOptions={mapStyle}
        // onVertexClick={(e) => console.log('vertex clicked', e)}
        // onDragEnd={(e) => console.log('drag end', e)}
        // onCreate={handleCreatePolygon}
        // onCreate={() => console.log('asdfasdf', store.currentMap)}
        // onChange={(e) => console.log('changed', e)}
        // onEdit={(e) => console.log('edited', e)}
        // onMarkerDragEnd={(e) => console.log('marker drag end')}
      />
      <MapLegend currentLegend={store.currentLegend} />
    </div>
  );
};

export default GeoJSONMap;
