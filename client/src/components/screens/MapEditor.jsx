import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { MapContainer, ZoomControl, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ChangeNameModal from '../modals/ChangeNameModal';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GlobalStoreContext from '../../store/store';
import * as RequestApi from '../../store/GlobalStoreHttpRequestApi';
import ScreenShooter from '../util/ScreenShooter';
import TopToolbar from '../util/TopToolbar';
import AuthContext from '../../auth/AuthContextProvider';
import 'leaflet-editable';
import {
  JsonTree,
  //ADD_DELTA_TYPE,
  //REMOVE_DELTA_TYPE,
  //UPDATE_DELTA_TYPE,
  //DATA_TYPES,
  //INPUT_USAGE_TYPES,
} from 'react-editable-json-tree';

import GeoJSONMap from '../util/GeoJSONMap';
import TextEditor from '../util/TextEditor';
import RegionEditor from '../util/RegionEditor';
import LegendEditor from '../util/LegendEditor';
import { useParams } from 'react-router-dom';
// const turf = require("@turf/turf");

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
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#03a9f4',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function MapEditor() {
  const editRef = React.useRef();
  const [map, setMap] = useState();
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
  const [authorized, setAuthorized] = useState(false);

  const routeParams = useParams();

  useEffect(() => {
    const fetchData = async () => {
      // await store.getMapById(routeParams.id);
      const res = await RequestApi.getMapById(routeParams.id);
      const map = res.data.data;
      store.setCurrentMap(map);

      if (auth.loggedIn && auth.user.id === map.mapInfo.authorId) {
        setAuthorized(true);
        console.log('authorized');
      }
    };

    console.log('fetching data');
    fetchData();
  }, [auth.loggedIn]);

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

  const editAttribute = (event) => {
    if (!authorized) {
      return;
    }

    setEdit(true);
    setCustomAttr(false);
    if (regionProps != null) {
      handleDrawerOpen();
    }
  };

  // let customdata =
  //   store.selectedFeatures.length > 0
  //     ? { Region: store.selectedFeatures[store.selectedFeatures.length - 1].properties.name }
  //     : {};

  // let DrawerContent = editingAttr ? (
  //   <JsonTree data={regionProps} />
  // ) : customAttr ? (
  //   <JsonTree data={customdata} />
  // ) : (
  //   <Box>other</Box>
  // );

  // const renderVertices = () => {
  //   if (store.selectedFeatures[0].geometry.coordinates.length === 1) {
  //     return store.selectedFeatures[0].geometry.coordinates[0].map((point, i) => (
  //       <Vertex
  //         key={i}
  //         featureId={store.selectedFeatures[0].id}
  //         center={[point[1], point[0]]}
  //       ></Vertex>
  //     ));
  //   } else {
  //     // if it's a multipolygon
  //     let coords = [];
  //     for (let polygon of store.selectedFeatures[0].geometry.coordinates) {
  //       polygon[0].forEach((coord) => coords.push(coord));
  //     }

  //     return coords.map((point, i) => (
  //       <Vertex
  //         key={i}
  //         featureId={store.selectedFeatures[0].id}
  //         center={[point[1], point[0]]}
  //       ></Vertex>
  //     ));
  //   }
  // };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <TopToolbar />
          <Box>
            <MapContainer
              id="leaflet-canvas"
              style={{ height: '90vh' }}
              editable={true}
              zoomControl={false}
              zoom={2}
              doubleClickZoom={false}
              center={[20, 100]}
              whenCreated={setMap}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* <Drawer
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
                </Drawer> */}
              {/* <Pane
                  key={store.selectedFeatures.length + store.mapUpdates}
                  name="markers"
                  style={{ zIndex: 500 }}
                >
                  {store.selectedFeatures.length === 1 && renderVertices()}
                </Pane> */}
              {/* <Pane name="mapdata" style={{ zIndex: 499 }}> */}
              <GeoJSONMap />
              <ScreenShooter />
              <ZoomControl position="topright" />
            </MapContainer>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            sx={{
              borderLeft: '1px solid',
              borderRight: '1px solid',
              borderColor: 'darkgray',
            }}
          >
            {authorized && (
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
