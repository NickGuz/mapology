import * as React from 'react';
import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { MapContainer, GeoJSON, ZoomControl } from "react-leaflet";
import Control from 'react-leaflet-custom-control'
import mapData from '../example-data/countries.json';
import { Stack, Button, Typography } from '@mui/material';
import "leaflet/dist/leaflet.css";
import ChangeNameModal from "./ChangeNameModal";
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GlobalStoreContext from '../store/store';
import {
    JsonTree,
    ADD_DELTA_TYPE,
    REMOVE_DELTA_TYPE,
    UPDATE_DELTA_TYPE,
    DATA_TYPES,
    INPUT_USAGE_TYPES,
} from 'react-editable-json-tree'

import TextEditor from './TextEditor';
import RegionEditor from './RegionEditor';
import LegendEditor from './LegendEditor';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';

let selected = [];
const drawerWidth = 350;
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
  );
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
    const { store } = useContext(GlobalStoreContext);
    const [editOpen, setEditOpen] = useState(false);
    const [regionName, setName] = useState("");
    const [currLayer, setLayer] = useState();
    const [regionProps, setRegionProps] = useState(null);
    const [editingAttr, setEdit] = useState(false);
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [customAttr, setCustomAttr] = useState(false);

    const handleDrawerOpen = () => {
        //store.setCurrentFeature(regionProps)
        setOpen(true) 
    };

    const handleDrawerClose = () => {
        setOpen(false);

    };
    const mapStyle = {
        fillColor: "blue",
        fillOpacity: .5,
        color: "black",
        weight: 1
    }
    const onFeature = (feature, layer) => {
      let country = feature.properties.name;
      layer.on({
          dblclick: (event) => {rename(event, country, feature, layer)},
          mouseover: (event) => {
            event.target.setStyle({
                fillColor: "purple"
            });
          },
          mouseout: (event) => {
            if (!selected.includes(event.target)){
              event.target.setStyle({
                fillColor: "blue"
                
              });
            }
          },
          click: (event) => {
            if (!selected.includes(event.target)){
              selected.push(event.target);
              event.target.setStyle({
                fillColor: "purple"
              });
            }
            else if (selected.includes(event.target)){
              selected.splice(selected.indexOf(event.target),1);
              event.target.setStyle({
                fillColor: "purple"
              });
            }
            
            if (selected.length == 0){
              setRegionProps({});
              handleDrawerClose();
            }
            else{setRegionProps(selected[selected.length -1].feature.properties);}
            
            console.log(selected)
          }
      });
    }
    const rename = (event, country, feature, layer)=>{
        setName(country);
        setEditOpen(true);
        setLayer(layer);         
    }

    const editAttribute = (event) =>{
        setEdit(true);
        setCustomAttr(false);
        if(regionProps != null){
          handleDrawerOpen();
        }
    }
    const customAttribute = (event) =>{
      setCustomAttr(true);
      setEdit(false);
      if(regionProps != null){
        handleDrawerOpen();
      }
      
  }  
  let customdata = 
  (selected.length >0)? {Region : selected[selected.length -1].feature.properties.name} : {}

  let DrawerContent = 
  (editingAttr)?<JsonTree data = {regionProps}/>: 
  (customAttr)?<JsonTree data = {customdata}/>:
   <Box>other</Box>
   
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
            <IconButton>
              <DownloadIcon />
            </IconButton>
            </Box>
            <Box>
              <MapContainer
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
                  }
                }
                variant="persistent"
                anchor="left"
                open={open}
              >
                <DrawerHeader>
                  <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "ltr" ? (
                      <ChevronLeftIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                </DrawerHeader>
                {DrawerContent}

              </Drawer>
              <GeoJSON
                style={mapStyle}
                data={mapData.features}
                onEachFeature={onFeature}
              />
              <ZoomControl position="topright" />
              <Control position="topright">
                <Stack direction="column">
                  <Button sx={{ color: "black", backgroundColor: "white" }}>
                    Merge region
                  </Button>
                  <Button onClick={editAttribute} sx={{ color: "black", backgroundColor: "white" }}>
                    Edit attribute
                  </Button>
                  <Button  onClick={customAttribute} sx={{ color: "black", backgroundColor: "white" }}>
                    Custom attribute
                  </Button>
                </Stack>
              </Control>
              <ChangeNameModal
                layer={currLayer}
                name={regionName}
                show={editOpen}
                rename={(name) => setName(name)}
                close={() => setEditOpen(false)}
              />
            </MapContainer>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box sx={{ borderLeft: "1px solid", borderRight: "1px solid", borderColor: "darkgray" }}>
            <TextEditor />
            <RegionEditor />
            <LegendEditor />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}