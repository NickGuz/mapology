import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { MapContainer, ZoomControl, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import GlobalStoreContext from '../../store/store';
import * as RequestApi from '../../store/GlobalStoreHttpRequestApi';
import ScreenShooter from '../util/ScreenShooter';
import TopToolbar from '../util/TopToolbar';
import AuthContext from '../../auth/AuthContextProvider';
import 'leaflet-editable';

import GeoJSONMap from '../util/GeoJSONMap';
import TextEditor from '../util/TextEditor';
import RegionEditor from '../util/RegionEditor';
import LegendEditor from '../util/LegendEditor';
import { useParams } from 'react-router-dom';

export default function MapEditor() {
  const [map, setMap] = useState();
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [authorized, setAuthorized] = useState(false);

  const routeParams = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const res = await RequestApi.getMapById(routeParams.id);
      const map = res.data.data;
      // store.setCurrentMapId(map.mapInfo.id);
      store.setCurrentMap(map);

      if (auth.loggedIn && auth.user.id === map.mapInfo.authorId) {
        setAuthorized(true);
      }
    };

    fetchData();
  }, [auth.loggedIn]);

  const handleRenameLegend = (color, name) => {
    if (!authorized) {
      return;
    }
    RequestApi.upsertLegend(routeParams.id, color, name);

    delete store.currentLegend[color];

    store.setCurrentLegend({
      ...store.currentLegend,
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={authorized ? 10.5 : 12}>
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
              <GeoJSONMap authorized={authorized} />
              <ScreenShooter />
              <ZoomControl position="topright" />
            </MapContainer>
          </Box>
        </Grid>
        {authorized && (
          <Grid item xs={1.5}>
            <Box
              sx={{
                borderLeft: '1px solid',
                borderRight: '1px solid',
                borderColor: 'darkgray',
              }}
            >
              {/* <TextEditor /> */}
              <RegionEditor mapId={routeParams.id} />
              <LegendEditor
                rename={(color, name) => handleRenameLegend(color, name)}
                currentFill={Object.keys(store.currentLegend)}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
