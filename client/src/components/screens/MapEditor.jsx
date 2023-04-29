import * as React from "react";
import { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { MapContainer, GeoJSON, ZoomControl, useMap, Pane, CircleMarker } from "react-leaflet";
import * as L from "leaflet";
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import Control from "react-leaflet-custom-control";
import mapData from "../../example-data/countries.json";
import { Stack, Button, Tooltip, Menu, MenuItem } from "@mui/material";
import "leaflet/dist/leaflet.css";
import ChangeNameModal from "../modals/ChangeNameModal";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GlobalStoreContext from "../../store/store";
import * as RequestApi from "../../store/GlobalStoreHttpRequestApi";
import ScreenShooter from "../util/ScreenShooter";
import TopToolbar from "../util/TopToolbar";
import AuthContext from "../../auth/AuthContextProvider";
import Vertex from "../util/Vertex";
import {
  JsonTree,
  //ADD_DELTA_TYPE,
  //REMOVE_DELTA_TYPE,
  //UPDATE_DELTA_TYPE,
  //DATA_TYPES,
  //INPUT_USAGE_TYPES,
} from "react-editable-json-tree";

import TextEditor from "../util/TextEditor";
import RegionEditor from "../util/RegionEditor";
import LegendEditor from "../util/LegendEditor";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteIcon from "@mui/icons-material/Delete";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import EditLocationAlt from "@mui/icons-material/EditLocationAlt";
import AbcIcon from "@mui/icons-material/Abc";
import ListItemText from "@mui/material/ListItemText";
import { useParams } from "react-router-dom";
const turf = require("@turf/turf");

const drawerWidth = 350;
// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
//     ({ theme, open }) => ({
//       flexGrow: 1,
//       padding: theme.spacing(3),
//       transition: theme.transitions.create('margin', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//       }),
//       marginLeft: `-${drawerWidth}px`,
//       ...(open && {
//         transition: theme.transitions.create('margin', {
//           easing: theme.transitions.easing.easeOut,
//           duration: theme.transitions.duration.enteringScreen,
//         }),
//         marginLeft: 0,
//       }),
//     }),
//   );
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#03a9f4",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function MapEditor() {
  const [editOpen, setEditOpen] = useState(false);
  const [currLayer, setLayer] = useState();
  const [regionProps, setRegionProps] = useState(null);
  const [editingAttr, setEdit] = useState(false);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [customAttr, setCustomAttr] = useState(false);
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [currFeature, setFeature] = useState();

  const routeParams = useParams();

  useEffect(() => {
    store.getMapById(routeParams.id);
  }, []);

  useEffect(() => {
    store.setCurrentMap(store.currentMap);
  }, [store.currentMap]);

  const handleDrawerOpen = () => {
    //store.setCurrentFeature(regionProps)
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const mapStyle = {
    fillOpacity: 0.5,
    weight: 1,
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
    } else {
      store.setSelectedFeatures([...store.selectedFeatures, event.target.feature]);
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
        if (!auth.loggedIn) {
          return;
        }
        selectRegion(event);

        if (store.selectedFeatures.length === 0) {
          setRegionProps({});
          handleDrawerClose();
        } else {
          setRegionProps(store.selectedFeatures[store.selectedFeatures.length - 1].properties);
        }
      },
    });

    // Set fill color
    if (store.selectedFeatures.includes(feature)) {
      layer.setStyle({ fillColor: "green" });
    } else if (feature.properties.fillColor) {
      layer.setStyle({ fillColor: feature.properties.fillColor });
    } else {
      layer.setStyle({ fillColor: "blue" });
    }

    // Set border color
    if (feature.properties.borderColor) {
      layer.setStyle({ color: feature.properties.borderColor });
    } else {
      layer.setStyle({ color: "black" });
    }
  };

  const handleRenameRegion = (feature, layer) => {
    setFeature(feature);
    setLayer(layer);
    setEditOpen(true);
  };

  const merge = async () => {
    // try to do features instead of the properties inside of feature

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

    // Delete features from DB
    store.selectedFeatures.forEach((f) => {
      RequestApi.deleteFeature(f.id);
    });

    // Add new feature to DB first to get back auto-generated ID
    const res = await RequestApi.insertFeature(store.currentMap.mapInfo.id, mergedFeature);
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
  };

  const editAttribute = (event) => {
    setEdit(true);
    setCustomAttr(false);
    if (regionProps != null) {
      handleDrawerOpen();
    }
  };

  const rename = (feature, name /*, layer*/) => {
    const oldName = getFeatureName(feature);
    // setfeatureureName(feature, name);
    renameAll(feature, oldName, name);

    console.log("feature id: " + feature.id);
    RequestApi.updateFeatureProperties(feature.id, feature.properties);

    store.setSelectedFeatures(store.selectedFeatures.filter((x) => x !== feature));
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

  let customdata =
    store.selectedFeatures.length > 0
      ? { Region: store.selectedFeatures[store.selectedFeatures.length - 1].properties.name }
      : {};

  let DrawerContent = editingAttr ? (
    <JsonTree data={regionProps} />
  ) : customAttr ? (
    <JsonTree data={customdata} />
  ) : (
    <Box>other</Box>
  );

  const renderVertices = () => {
    if (store.selectedFeatures[0].geometry.coordinates.length === 1) {
      return store.selectedFeatures[0].geometry.coordinates[0].map((point, i) => (
        <Vertex
          key={i}
          featureId={store.selectedFeatures[0].id}
          center={[point[1], point[0]]}
        ></Vertex>
      ));
    } else {
      //console.log(store.selectedFeatures[0].geometry.coordinates);
      // if it's a multipolygon
      let coords = [];
      for (let polygon of store.selectedFeatures[0].geometry.coordinates) {
        polygon[0].forEach((coord) => coords.push(coord));
      }

      return coords.map((point, i) => (
        <Vertex
          key={i}
          featureId={store.selectedFeatures[0].id}
          center={[point[1], point[0]]}
        ></Vertex>
      ));
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <TopToolbar />
          <Box>
            <MapContainer
              id="leaflet-canvas"
              style={{ height: "90vh" }}
              zoomControl={false}
              zoom={2}
              doubleClickZoom={false}
              center={[20, 100]}
            >
              <Drawer
                sx={{
                  width: drawerWidth,
                  boxSizing: "border-box",
                }}
                variant="persistent"
                anchor="left"
                open={open}
              >
                <DrawerHeader>
                  <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>
                </DrawerHeader>
                {DrawerContent}
              </Drawer>
              <Pane
                key={store.selectedFeatures.length + store.mapUpdates}
                name="markers"
                style={{ zIndex: 500 }}
              >
                {store.selectedFeatures.length === 1 && renderVertices()}
              </Pane>
              <Pane name="mapdata" style={{ zIndex: 499 }}>
                {store.currentMap && (
                  <GeoJSON
                    // key={store.mapUpdates}
                    key={store.selectedFeatures.length + store.mapUpdates}
                    style={mapStyle}
                    data={store.currentMap.json.features}
                    onEachFeature={onFeature}
                  />
                )}
              </Pane>
              <ScreenShooter />
              <ZoomControl position="topright" />
              {/* {auth.loggedIn && auth.user.id === store.currentMap.mapInfo.authorId && ( */}
              {/* <div> */}
              <Control position="topright">
                <Stack direction="column">
                  <Tooltip title="Delete">
                    <Button
                      sx={{ color: "black", backgroundColor: "white" }}
                      onClick={handleDelete}
                    >
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Merge">
                    <Button sx={{ color: "black", backgroundColor: "white" }} onClick={merge}>
                      <MergeIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Edit Attributes">
                    <Button
                      onClick={editAttribute}
                      sx={{ color: "black", backgroundColor: "white" }}
                    >
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
                    <Button sx={{ color: "black", backgroundColor: "white" }}>
                      <EditLocationAlt />
                    </Button>
                  </Tooltip>
                </Stack>
              </Control>
              {/* </div> */}
              {/* )} */}
              <ChangeNameModal
                layer={currLayer}
                show={editOpen}
                feature={currFeature}
                rename={(currFeature, name, layer) => rename(currFeature, name, layer)}
                close={() => setEditOpen(false)}
              />
            </MapContainer>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              borderLeft: "1px solid",
              borderRight: "1px solid",
              borderColor: "darkgray",
            }}
          >
            {auth.loggedIn && (
              <div>
                <TextEditor />
                <RegionEditor />
                <LegendEditor />
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
