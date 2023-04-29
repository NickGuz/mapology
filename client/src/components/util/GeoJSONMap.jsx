import { useState, useContext, useEffect } from "react";
import { useMap, GeoJSON } from "react-leaflet";
import GlobalStoreContext from "../../store/store";
import * as RequestApi from "../../store/GlobalStoreHttpRequestApi";
import * as L from "leaflet";
import AuthContext from "../../auth/AuthContextProvider";
import Control from "react-leaflet-custom-control";
import { Stack } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import MergeIcon from "@mui/icons-material/Merge";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import AbcIcon from "@mui/icons-material/Abc";
import EditLocationAlt from "@mui/icons-material/EditLocationAlt";
import { GeomanControls } from "react-leaflet-geoman-v2";

const GeoJSONMap = (props) => {
  const [feature, setFeature] = useState();
  const [layer, setLayer] = useState();
  const [editOpen, setEditOpen] = useState(false);

  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const map = useMap();

  useEffect(() => {
    // Setup leaflet-editable event handlers
    // map.options = { editable: true };
    console.log("otps", map.options);
    map.on("editable:vertex:dragend", handleVertexDragEnd);
    map.on("editable:vertex:rawclick", handleVertexRawClick);
    map.on("pm:globaleditmodetoggled", () => console.log("dragend"));
  }, []);

  const mapStyle = {
    fillColor: "blue",
    fillOpacity: 0.5,
    color: "black",
    weight: 1,
  };

  const handleVertexDragEnd = (evt) => {
    map.editTools.commitDrawing();

    const newFeature = evt.layer.toGeoJSON();
    store.currentMap.json.features = store.currentMap.json.features.filter(
      (f) => f.id !== newFeature.id
    );
    store.setCurrentMap(store.currentMap);
    RequestApi.updateFeatureGeometry(newFeature.id, newFeature.geometry);
  };

  const handleVertexRawClick = (evt) => {
    // removeVertex(evt.vertex.latlng);
    removeVertex(evt);
  };

  const handleRenameRegion = (feature, layer) => {
    setFeature(feature);
    setLayer(layer);
    setEditOpen(true);
  };

  const removeVertex = (evt) => {
    if (!window.confirm("Are you sure you want to delete this vertex?")) {
      return;
    }

    // TODO currently only deletes one vertex on a shared border
    evt.vertex.delete();
    map.editTools.commitDrawing();
    const newFeature = evt.layer.toGeoJSON();
    // store.setCurrentMap(store.currentMap);
    RequestApi.updateFeatureGeometry(newFeature.id, newFeature.geometry);

    // const lat = vertex.lat;
    // const lng = vertex.lng;
    // console.log("to delete", vertex);

    // // Get the vertices to remove
    // let toRemove = [];
    // store.currentMap.json.features.forEach((f) => {
    //   f.geometry.coordinates[0].forEach((xy) => {
    //     if (xy[0] === lng && xy[1] === lat) {
    //       // toRemove.push({ feature: f, coords: xy });
    //       toRemove.push(f);
    //     }
    //   });
    // });

    // if (toRemove.length >= 3) {
    //   window.alert("Cannot delete a vertex shared by more than 2 regions");
    //   return;
    // }

    // // Remove the vertices
    // toRemove.forEach((f) => {
    //   f.geometry.coordinates[0] = f.geometry.coordinates[0].filter(
    //     (coords) => !(coords[0] === lng && coords[1] === lat)
    //   );
    // });

    // store.setCurrentMap(store.currentMap);
    // toRemove.forEach((f) => {
    //   console.log("in here");
    //   RequestApi.updateFeatureGeometry(f.id, f.geometry);
    // });
  };

  const handleDelete = () => {
    if (store.selectedFeatures.length < 1) {
      return;
    }

    let featureIds = [];
    store.selectedFeatures.forEach((f) => featureIds.push(f.id));

    for (let fid of featureIds) {
      RequestApi.deleteFeature(fid);
    }

    store.currentMap.json.features = store.currentMap.json.features.filter(
      (f) => !featureIds.includes(f.id)
    );
    store.setCurrentMap(store.currentMap);
    store.setSelectedFeatures([]);
  };

  const merge = () => {
    // try to do features instead of the properties inside of feature

    map.eachLayer((layer) => {
      try {
        if (layer.editEnabled()) {
          console.log(layer);
        }
      } catch (e) {
        //ignore
      }
    });
    return;

    const firstGeom = store.selectedFeatures[0];
    console.log(firstGeom);
    // const firstProps = store.selectedFeatures[0].properties;
    // console.log(firstProps)

    let name = window.prompt("Input a name for the merged region");
    if (!name) return;

    const mergedFeature = store.selectedFeatures.reduce((merged, region) => {
      return turf.union(merged, region);
    }, firstGeom);

    mergedFeature.properties.NAME_0 = name;

    console.log(store.currentMap.json.features);
    store.currentMap.json.features = store.currentMap.json.features.filter(
      (region) => !store.selectedFeatures.includes(region)
    );
    store.currentMap.json.features.push(mergedFeature);
    console.log(store.currentMap.json.features);

    store.setCurrentMap(store.currentMap);
  };

  // const handleToggleEditVertices = (event) => {
  //   store.selectedfeatures.foreach((layer) => {
  //     try {
  //       console.log("EDITABLE", map.editable);
  //       layer.toggleEdit();
  //     } catch (e) {
  //       // ignore
  //     }
  //   });
  // };

  const editAttribute = (event) => {
    setEdit(true);
    setCustomAttr(false);
    if (regionProps != null) {
      handleDrawerOpen();
    }
  };

  const getFeatureName = (feature) => {
    let featureName;

    if (feature.properties.NAME_2) featureName = feature.properties.NAME_2;
    else if (feature.properties.NAME_1) featureName = feature.properties.NAME_1;
    else if (feature.properties.NAME_0) featureName = feature.properties.NAME_0;
    else if (feature.properties.name) featureName = feature.properties.name;

    return featureName;
  };

  const setFeatureName = (feature, name) => {
    if (feature.properties.NAME_2) feature.properties.NAME_2 = name;
    else if (feature.properties.NAME_1) feature.properties.NAME_1 = name;
    else if (feature.properties.NAME_0) feature.properties.NAME_0 = name;
    else if (feature.properties.name) feature.properties.name = name;
  };

  const selectRegion = (event) => {
    if (store.selectedFeatures.includes(event.target.feature)) {
      store.setSelectedFeatures(store.selectedFeatures.filter((x) => x !== event.target.feature));
      return false;
    } else {
      store.setSelectedFeatures([...store.selectedFeatures, event.target.feature]);
      return true;
    }
  };

  const selectLayer = (layer) => {
    if (store.selectedFeatures.find((l) => l.feature.id === layer.feature.id)) {
      store.setSelectedFeatures(
        store.selectedFeatures.filter((x) => x.feature.id !== layer.feature.id)
      );
    } else {
      store.setSelectedFeatures([...store.selectedFeatures, layer]);
    }
  };

  const onFeature = (feature, layer) => {
    let country = getFeatureName(feature);
    if (!country) throw new Error("Could not find region name");

    layer
      .bindTooltip(country, {
        className: "countryLabel",
        permanent: true,
        opacity: 0.7,
        direction: "center",
      })
      .openTooltip();

    layer.on({
      dblclick: (event) => {
        if (!auth.loggedIn) {
          return;
        }
        handleRenameRegion(feature, layer);
      },
      mouseover: (event) => {
        // if (!store.selectedFeatures.includes(event.target.feature)) {
        //   event.target.setStyle({
        //     fillColor: "purple",
        //   });
        // }
      },
      mouseout: (event) => {
        // if (!store.selectedFeatures.includes(event.target.feature)) {
        //   event.target.setStyle({
        //     fillColor: "blue",
        //   });
        // }
      },
      click: (event) => {
        // if (!auth.loggedIn) {
        //   return;
        // }
        // const selected = selectRegion(event);
        // console.log("selecting", event.sourceTarget);
        // selectLayer(layer);
        layer.toggleEdit();
        if (layer.editEnabled()) {
          console.log("setting style", layer);
          layer.setStyle({ fillColor: "green" });
          // selectLayer(layer);
          store.setSelectedFeatures([...store.selectedFeatures, feature]);
        } else {
          store.setSelectedFeatures(store.selectedFeatures.filter((f) => f.id !== feature.id));
          layer.setStyle({ fillColor: "blue" });
        }
        // selectLayer(event);
        // if (store.selectedFeatures.length === 0) {
        //   setRegionProps({});
        //   handleDrawerClose();
        // } else {
        //   setRegionProps(store.selectedFeatures[store.selectedFeatures.length - 1].properties);
        // }
      },
    });

    // set selected features
    // if (layer.editEnabled()) {
    //   console.log("edit enabled");
    //   layer.setStyle({ fillColor: "green" });
    // }

    const selected = store.selectedFeatures.find((f) => f.id === feature.id);
    if (selected) {
      console.log("region is selected");
      // layer.setStyle({ fillColor: "green" });
    }
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
            <Button sx={{ color: "black", backgroundColor: "white" }} onClick={handleDelete}>
              <DeleteIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Merge">
            <Button sx={{ color: "black", backgroundColor: "white" }} onClick={() => merge()}>
              <MergeIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Edit Attributes">
            <Button onClick={editAttribute} sx={{ color: "black", backgroundColor: "white" }}>
              <EditAttributesIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Rename Region">
            <Button
              sx={{ color: "black", backgroundColor: "white" }}
              onClick={() => {
                if (store.selectedFeatures.length !== 1) {
                  window.alert("Cannot rename more than 1 region at a time");
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
              sx={{ color: "black", backgroundColor: "white" }}
              // onClick={handleToggleEditVertices}
            >
              <EditLocationAlt />
            </Button>
          </Tooltip>
        </Stack>
      </Control>
      <GeomanControls
        options={{
          position: "topleft",
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
        }}
        onCreate={(e) => console.log("created", e)}
        onChange={(e) => console.log("changed", e)}
        onEdit={(e) => console.log("edited", e)}
      />
    </div>
  );
};

export default GeoJSONMap;
