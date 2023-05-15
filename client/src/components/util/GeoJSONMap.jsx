import { useState, useContext, useEffect, useCallback } from 'react';
import { useMap, GeoJSON } from 'react-leaflet';
import GlobalStoreContext from '../../store/store';
import * as RequestApi from '../../store/GlobalStoreHttpRequestApi';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import AuthContext from '../../auth/AuthContextProvider';
import ChangeNameModal from '../modals/ChangeNameModal';
import PropertiesModal from '../modals/RegionPropertyModal';
import MapPropsModal from '../modals/MapPropsModal';
import MapLegend from './MapLegend';
import { splitRegion } from '../../util/editing/split';
import { removeVertex, deleteFeature } from '../../util/editing/delete';
import { moveVertex } from '../../util/editing/move';
import { merge } from '../../util/editing/merge';
import GeomanControl from './GeomanControl';

const GeoJSONMap = (props) => {
  const [currLayer, setCurrLayer] = useState();
  const [currFeature, setCurrFeature] = useState();
  const [editOpen, setEditOpen] = useState(false);
  const [propOpen, setPropOpen] = useState(false);
  const [boundsSet, setBoundsSet] = useState(false);
  const [mapPropOpen, setMapPropOpen] = useState(false);
  const [canSelectFeatures, setCanSelectFeatures] = useState(true);

  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const map = useMap();

  const handleGlobalModeToggled = useCallback(
    (event) => {
      const enabled = event.enabled;
      setCanSelectFeatures(!enabled);
    },
    [canSelectFeatures]
  );

  useEffect(() => {
    store.setCurrentMap(store.currentMap);

    if (store.currentMap && !boundsSet) {
      const latlngs = [];
      store.currentMap.json.features.forEach((f) => {
        f.geometry.coordinates.forEach((polygon) => {
          if (f.geometry.type === 'MultiPolygon') {
            polygon[0].forEach((p) => latlngs.push([p[1], p[0]]));
          } else if (f.geometry.type === 'Polygon') {
            polygon.forEach((p) => latlngs.push([p[1], p[0]]));
          } else if (f.geometry.type === 'LineString') {
            latlngs.push([polygon[1], polygon[0]]);
          }
        });
      });

      let bounds = new L.LatLngBounds(latlngs);
      map.fitBounds(bounds);
      setBoundsSet(true);
    }

    if (store.currentMap) {
      if (!map.hasEventListeners('pm:create')) {
        map.on('pm:create', (event) => {
          handleCreatePolygon(event);
        });
      }

      if (!map.hasEventListeners('pm:globaldragmodetoggled')) {
        map.on('pm:globaldragmodetoggled', (event) => {
          handleGlobalModeToggled(event);
        });
      }

      if (!map.hasEventListeners('pm:globaldrawmodetoggled')) {
        map.on('pm:globaldrawmodetoggled', (event) => {
          handleGlobalModeToggled(event);
        });
      }
    }
    // console.log('useEffect', store.currentMap);
  }, [store.currentMap, store.currentLegend, handleGlobalModeToggled]);

  useEffect(() => {
    console.log('selected', store.selectedFeatures);
  }, [store.selectedFeatures]);

  const mapStyle = {
    fillOpacity: 0.5,
    weight: 1.5,
  };

  const handleVertexDragEnd = (evt) => {
    moveVertex(evt, store);
  };

  const handleVertexRawClick = (evt) => {
    // removeVertex(evt.vertex.latlng);
    removeVertex(evt, store);
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

  const handleDeleteFeature = (feature) => {
    deleteFeature(feature, store);
  };

  const handleMerge = () => {
    merge(store);
  };

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
    console.log('canSelectFeatures', canSelectFeatures);
    if (!canSelectFeatures) {
      return;
    }

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

  const handleLayerClick = (event) => {
    if (!auth.loggedIn) {
      return;
    }
    selectRegion(event);
  };

  const onFeature = (feature, layer) => {
    let country = getFeatureName(feature);
    if (!country) country = '';

    layer
      .bindTooltip(country, {
        className: 'countryLabel',
        permanent: true,
        opacity: 0.7,
        direction: 'center',
      })
      .openTooltip();

    // layer.pm.setOptions({
    //   limitMarkersToCount: 10,
    // });

    layer.on({
      click: (event) => handleLayerClick(event),
      'pm:markerdragend': (event) => {
        handleVertexDragEnd(event);
      },
      'pm:vertexclick': (event) => {
        handleVertexRawClick(event);
      },
      'pm:remove': (event) => {
        handleDeleteFeature(event.target.feature);
      },
      'pm:dragend': (event) => {
        handleDragEnd(event);
      },
    });

    // Points fail when trying to setStyle, so just return early if it's a point
    if (feature.geometry.type === 'Point') {
      return;
    }

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
      layer.setStyle({ fillColor: 'blue' });
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

  const handleDragEnd = (event) => {
    const mapClone = JSON.parse(JSON.stringify(store.currentMap));

    const updatedFeature = event.target.toGeoJSON();
    RequestApi.updateFeatureGeometry(
      updatedFeature.id,
      updatedFeature.geometry
    );

    const currFeature = store.currentMap.json.features.find(
      (f) => f.id === updatedFeature.id
    );

    currFeature.geometry = updatedFeature.geometry;
    // store.setSelectedFeatures([]);
    store.setMapUpdates(store.mapUpdates + 1);
    // store.setCurrentMap(store.currentMap);
    store.addEditMapTransaction(mapClone, store.currentMap);
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

  const updateMapProperties = (map, properties) => {
    map.properties = properties;

    RequestApi.updateMapProperty(map.id, map.properties);
  };

  const addMapProperties = async (map, newProperties) => {
    // const map = await RequestApi.getMap(mapId)
    const updatedProperties = {
      ...map.properties,
      ...newProperties,
    };
    updateMapProperties(map, updatedProperties);
  };

  const handleCreatePolygon = (event) => {
    const feature = event.layer.toGeoJSON();
    const layer = event.layer;
    console.log(feature);

    // TODO Handle create text box here
    if (feature.geometry.type === 'Point') {
      if (!layer.hasEventListeners('pm:textblur')) {
        console.log('created');
        layer.on('pm:textblur', (event) => {
          const text = event.layer.options.text;
          const textBox = event.layer.toGeoJSON();
          textBox.properties['textValue'] = text;
          RequestApi.insertFeature(store.currentMap.mapInfo.id, textBox);
        });
      }
      return;
    }

    if (
      feature.geometry.type === 'LineString' ||
      feature.geometry.type === 'MultiLineString'
    ) {
      console.log('event', event);
      map.removeLayer(event.layer);
      handleSplitRegion(feature);
      return;
    }

    const mapClone = JSON.parse(JSON.stringify(store.currentMap));

    const name = window.prompt('Enter a name for this feature:');
    feature.properties['name'] = name;

    store.currentMap.json.features.push(feature);
    // store.setCurrentMap(store.currentMap);
    store.setMapUpdates(store.mapUpdates + 1);
    RequestApi.insertFeature(store.currentMap.mapInfo.id, feature);
    store.addEditMapTransaction(mapClone, store.currentMap);

    // Remove the layer created by geoman
    map.removeLayer(event.layer);
  };

  const handleSplitRegion = async (line) => {
    splitRegion(line, store);
  };

  return (
    <div>
      {store.currentMap && (
        <GeoJSON
          key={store.selectedFeatures.length + store.mapUpdates}
          style={mapStyle}
          data={store.currentMap.json.features}
          onEachFeature={onFeature}
        />
      )}
      {props.authorized && (
        <div>
          <ChangeNameModal
            layer={currLayer}
            show={editOpen}
            feature={currFeature}
            rename={(currFeature, name, layer) =>
              rename(currFeature, name, layer)
            }
            close={() => setEditOpen(false)}
          />
          <PropertiesModal
            layer={currLayer}
            updateProperties={updateProperties}
            addProperties={addProperties}
            show={propOpen}
            close={() => setPropOpen(false)}
          />
          <MapPropsModal
            show={mapPropOpen}
            layer={currLayer}
            feature={currFeature}
            updateMapProperties={updateMapProperties}
            addMapProperties={addMapProperties}
            close={() => setMapPropOpen(false)}
          />
          <GeomanControl
            setPropOpen={setPropOpen}
            setMapPropOpen={setMapPropOpen}
            setEditOpen={setEditOpen}
          />
        </div>
      )}
      <MapLegend currentLegend={store.currentLegend} />
    </div>
  );
};

export default GeoJSONMap;
