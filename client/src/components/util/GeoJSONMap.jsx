import { useState, useContext, useEffect } from "react";
import { useMap, GeoJSON } from "react-leaflet";
import GlobalStoreContext from "../../store/store";
import * as RequestApi from "../../store/GlobalStoreHttpRequestApi";

const GeoJSONMap = (props) => {
  // const [oldPoint, setOldPoint] = useState();
  const { store } = useContext(GlobalStoreContext);
  const map = useMap();

  useEffect(() => {
    // Setup leaflet-editable event handlers
    map.on("editable:vertex:drag", handleVertexDrag);
    // map.on("editable:vertex:dragstart", handleVertexDragStart);
    map.on("editable:vertex:dragend", handleVertexDragEnd);
    map.on("editable:vertex:rawclick", handleVertexRawClick);
  }, []);

  const mapStyle = {
    fillColor: "blue",
    fillOpacity: 0.5,
    color: "black",
    weight: 1,
  };

  const handleVertexDrag = (evt) => {
    // console.log(evt);
  };

  // const handleVertexDragStart = (evt) => {
  //   console.log("setting old point");
  //   setOldPoint(evt.vertex.latlng);
  // };

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
    removeVertex(evt.vertex.latlng);
  };

  const removeVertex = (vertex) => {
    if (!window.confirm("Are you sure you want to delete this vertex?")) {
      return;
    }

    // console.log("event", evt);
    // evt.vertex.delete();
    // map.editTools.commitDrawing();

    const lat = vertex.lat;
    const lng = vertex.lng;
    console.log("to delete", vertex);

    // Get the vertices to remove
    let toRemove = [];
    store.currentMap.json.features.forEach((f) => {
      f.geometry.coordinates[0].forEach((xy) => {
        if (xy[0] === lng && xy[1] === lat) {
          // toRemove.push({ feature: f, coords: xy });
          toRemove.push(f);
        }
      });
    });

    if (toRemove.length >= 3) {
      window.alert("Cannot delete a vertex shared by more than 2 regions");
      return;
    }

    // Remove the vertices
    toRemove.forEach((f) => {
      f.geometry.coordinates[0] = f.geometry.coordinates[0].filter(
        (coords) => !(coords[0] === lng && coords[1] === lat)
      );
    });

    store.setCurrentMap(store.currentMap);
    toRemove.forEach((f) => {
      console.log("in here");
      RequestApi.updateFeatureGeometry(f.id, f.geometry);
    });
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
        if (!store.selectedFeatures.includes(event.target.feature)) {
          event.target.setStyle({
            fillColor: "purple",
          });
        }
      },
      mouseout: (event) => {
        if (!store.selectedFeatures.includes(event.target.feature)) {
          event.target.setStyle({
            fillColor: "blue",
          });
        }
      },
      click: (event) => {
        // if (!auth.loggedIn) {
        //   return;
        // }
        layer.toggleEdit();
        // const selected = selectRegion(event);
        // console.log("selected", selected);
        // if (selected) {
        //   layer.enableEdit();
        // } else {
        //   // if deselected
        //   layer.disableEdit();
        // }
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
    //   layer.setStyle({ fillColor: "green" });
    // }

    // if (store.selectedFeatures.includes(feature)) {
    //   layer.setStyle({ fillColor: "green" });
    // }
  };

  return (
    <>
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
    </>
  );
};

export default GeoJSONMap;
