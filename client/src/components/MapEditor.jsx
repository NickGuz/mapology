import * as React from "react";
import { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { MapContainer, GeoJSON, ZoomControl, useMap, Pane, CircleMarker } from "react-leaflet";
import * as L from "leaflet";
import { SimpleMapScreenshoter } from "leaflet-simple-map-screenshoter";
import Control from "react-leaflet-custom-control";
import mapData from "../example-data/countries.json";
import { Stack, Button, Tooltip, Menu, MenuItem } from "@mui/material";
import "leaflet/dist/leaflet.css";
import ChangeNameModal from "./ChangeNameModal";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import GlobalStoreContext from "../store/store";
import * as RequestApi from "../store/GlobalStoreHttpRequestApi";
import {
  JsonTree,
  //ADD_DELTA_TYPE,
  //REMOVE_DELTA_TYPE,
  //UPDATE_DELTA_TYPE,
  //DATA_TYPES,
  //INPUT_USAGE_TYPES,
} from "react-editable-json-tree";

import TextEditor from "./TextEditor";
import RegionEditor from "./RegionEditor";
import LegendEditor from "./LegendEditor";
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
  const [anchorEl, setAnchorEl] = useState(null);
  // const [selected, setSelected] = useState([]);
  const [currFeature, setFeature] = useState();

  const routeParams = useParams();

  useEffect(() => {
    store.getMapById(routeParams.id);
    console.log("rendering");
  }, []);

  const handleDrawerOpen = () => {
    //store.setCurrentFeature(regionProps)
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const mapStyle = {
    fillColor: "blue",
    fillOpacity: 0.5,
    color: "black",
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
        selectRegion(event);

        if (store.selectedFeatures.length === 0) {
          setRegionProps({});
          handleDrawerClose();
        } else {
          setRegionProps(store.selectedFeatures[store.selectedFeatures.length - 1].properties);
        }
      },
    });

    if (store.selectedFeatures.includes(feature)) {
      layer.setStyle({ fillColor: "green" });
    }
  };

  const handleRenameRegion = (feature, layer) => {
    setFeature(feature);
    setLayer(layer);
    setEditOpen(true);
  };

  const editAttribute = (event) => {
    setEdit(true);
    setCustomAttr(false);
    if (regionProps != null) {
      handleDrawerOpen();
    }
  };

  const rename = (feature, name, layer) => {
    const oldName = getFeatureName(feature);
    // setFeatureName(feature, name);
    renameAll(feature, oldName, name);

    console.log("feature id: " + feature.id);
    RequestApi.updateFeatureProperties(feature.id, feature.properties);

    layer
      .bindTooltip(name, {
        className: "countryLabel",
        permanent: true,
        opacity: 0.7,
        direction: "center",
      })
      .openTooltip();
    // setSelected(selected.filter((x) => x !== feature));
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

  const handleOpenDownload = (event) => {
    setAnchorEl(event.target);
  };

  const handleCloseDownload = (event) => {
    setAnchorEl(null);
  };

  const handleGeoJSONDownload = () => {
    RequestApi.downloadMapAsGeoJSON(
      store.currentMap.mapInfo.id,
      `${store.currentMap.mapInfo.title.replace("/", "_")}.geo.json`
    );
    setAnchorEl(null);
  };

  const handleShapefileDownload = () => {
    RequestApi.downloadMapAsShapefile(
      store.currentMap.mapInfo.id,
      `${store.currentMap.mapInfo.title.replace("/", "_")}_shp.zip`
    );
    setAnchorEl(null);
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <Box>
            <IconButton>
              <UndoIcon />
            </IconButton>
            <IconButton>
              <RedoIcon />
            </IconButton>
            <IconButton>
              <ContentCopyIcon />
            </IconButton>
            <IconButton>
              <SaveIcon />
            </IconButton>
            <IconButton onClick={handleOpenDownload}>
              <DownloadIcon />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseDownload}
            >
              <MenuItem onClick={handleGeoJSONDownload}>Download as GeoJSON</MenuItem>
              <MenuItem onClick={handleShapefileDownload}>Download as Shapefile</MenuItem>
              <MenuItem>Download as Image</MenuItem>
            </Menu>
          </Box>
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
                {/* TODO Currently broken on multipolygons */}
                {store.selectedFeatures.length === 1 &&
                  store.selectedFeatures[0].geometry.coordinates[0].map((point, i) => (
                    <Vertex
                      key={i}
                      featureId={store.selectedFeatures[0].id}
                      center={[point[1], point[0]]}
                    ></Vertex>
                  ))}
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
              <ZoomControl position="topright" />
              <Control position="topright">
                <Stack direction="column">
                  <Tooltip title="Delete">
                    <Button sx={{ color: "black", backgroundColor: "white" }}>
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Merge">
                    <Button sx={{ color: "black", backgroundColor: "white" }}>
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
                      onClick={() => setEditOpen(true)}
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
            <TextEditor />
            <RegionEditor />
            <LegendEditor />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

const Vertex = (props) => {
  const [point, setPoint] = useState(null);

  const map = useMap();
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    setPoint(props.center);
  }, []);

  const removeVertex = (vertex) => {
    if (!window.confirm("Are you sure you want to delete this vertex?")) {
      return;
    }

    const lat = vertex.lat;
    const lng = vertex.lng;

    // Get the vertices to remove
    let toRemove = [];
    store.currentMap.json.features.forEach((f) => {
      f.geometry.coordinates[0].forEach((xy) => {
        if (xy[0] === lng && xy[1] === lat) {
          toRemove.push(xy);
        }
      });
    });

    if (toRemove.length >= 3) {
      window.alert("Cannot delete a vertex shared by more than 2 regions");
      return;
    }

    // Remove the vertices
    store.currentMap.json.features.forEach((f) => {
      f.geometry.coordinates[0] = f.geometry.coordinates[0].filter(
        (xy) => !(xy[0] === lng && xy[1] === lat)
      );
    });

    store.setCurrentMap(store.currentMap);
  };

  const trackCursor = (event) => {
    setPoint(event.latlng);
  };

  const updateFeature = () => {
    if (!point.lat || !point.lng) {
      return;
    }
    let feature = store.currentMap.json.features.find((f) => f.id === props.featureId);
    let pnt = feature.geometry.coordinates[0].find(
      (p) => p[0] === props.center[1] && p[1] === props.center[0]
    );
    pnt[0] = point.lng;
    pnt[1] = point.lat;

    store.setCurrentMap(store.currentMap);
  };

  return (
    <>
      {point && (
        <CircleMarker
          center={point}
          pathOptions={{
            color: "blue",
            fillColor: "blue",
            bubblingMouseEvents: false,
            fillOpacity: 1.0,
          }}
          radius={5}
          draggable={true}
          eventHandlers={{
            dblclick: (e) => {
              removeVertex(e.latlng);
            },
            mousedown: (e) => {
              map.on("mousemove", trackCursor);
              map.dragging.disable();
            },
            mouseup: (e) => {
              map.off("mousemove");
              map.dragging.enable();
              updateFeature();
            },
          }}
        ></CircleMarker>
      )}
    </>
  );
};
