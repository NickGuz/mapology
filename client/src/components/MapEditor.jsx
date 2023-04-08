import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { MapContainer, GeoJSON, ZoomControl } from "react-leaflet";
import Control from 'react-leaflet-custom-control'
import mapData from '../example-data/countries.json';
import { Stack, Button } from '@mui/material';

import "leaflet/dist/leaflet.css";
import ChangeNameModal from "./ChangeNameModal";
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


const drawerWidth = 240;
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
padding: theme.spacing(0, 1),
// necessary for content to be below app bar
...theme.mixins.toolbar,
justifyContent: 'flex-end',
}));

export default function MapEditor() {
    const [editOpen, setEditOpen] = useState(false);
    const [regionName, setName] = useState("");
    const [currLayer, setLayer] = useState();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
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
                event.target.setStyle({
                    fillColor: "blue"
                });
            },
        });
    }
    const rename = (event, country, feature, layer)=>{
        setName(country);
        setEditOpen(true);
        setLayer(layer);         
    }
    
    return (
        <Box sx = {{flexGrow:1}}>
            <Grid container spacing={1}>
                <Grid item xs={10} >
                    <Box>
                        map editing options
                    </Box>
                    <Box>
                        <MapContainer style={{ height:"90vh" }} zoomControl ={false} zoom={2} doubleClickZoom = {false} center={[20,100]}>
                            <Drawer
                                sx={{
                                width: drawerWidth,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: drawerWidth,
                                    boxSizing: 'border-box',
                                },
                                }}
                                variant="persistent"
                                anchor="left"
                                open={open}
                            >
                                <DrawerHeader>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                                </DrawerHeader>
                                
                            </Drawer>
                            <GeoJSON style = {mapStyle} data={mapData.features}  onEachFeature = {onFeature} />
                            <ZoomControl position = "topright"/>
                            <Control position='topright' >
                                <Stack direction='column'>
                                    
                                    <Button  sx = {{color: "black", backgroundColor: "white"}}>
                                        Merge region
                                    </Button>
                                    <Button  sx = {{color: "black", backgroundColor: "white"}}>
                                        Edit attribute
                                    </Button>
                                    <Button  sx = {{color: "black", backgroundColor: "white"}}>
                                        Custom attribute
                                    </Button>
                                    
                                </Stack>
                            </Control>
                            <ChangeNameModal layer = {currLayer} name = {regionName} show = {editOpen} rename = {(name) => setName(name)} close = {() => setEditOpen(false)} />

                        </MapContainer>
                    </Box>
                    
                    
                </Grid>
                <Grid item xs={2} >
                    edit tools 
                </Grid>
            </Grid>
        </Box>
            
    );
}