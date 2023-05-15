import React, { useContext, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import MapCard from './MapCard';
import GlobalStoreContext from '../../store/store';
import { Pagination } from '@mui/material';

const MapGridType = {
  BROWSE: 'BROWSE',
  PROFILE: 'PROFILE',
};

const MapGrid = (props) => {
  const { store } = useContext(GlobalStoreContext);

  const handleChange = (event, value) => {
    store.setPage(value);
  };

  useEffect(() => {}, [store.currentMap]);
  return (
    <div>
      <Grid container spacing={2} style={{ marginTop: '5px' }}>
        {props.mapData.map((data) => (
          <Grid item xs={3} key={data.id}>
            <MapCard data={data} />
          </Grid>
        ))}
      </Grid>
      <Pagination
        sx={{ mt: 2, mb: 2 }}
        count={Math.ceil(props.mapData.length / 8) + store.page}
        page={store.page}
        onChange={handleChange}
      />
    </div>
  );
};

export default MapGrid;
export { MapGridType };
