import React, { useContext, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import MapCard from './MapCard';
import api from '../../auth/auth-request-api/AuthRequestApi';
import GlobalStoreContext from '../../store/store';

const MapGridType = {
  BROWSE: 'BROWSE',
  PROFILE: 'PROFILE',
};

const MapGrid = (props) => {
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {}, [store.currentMap]);
  return (
    <div
    // style={{
    //   marginLeft: "10%",
    //   marginRight: "10%",
    //   marginBottom: "3%",
    // }}
    >
      <Grid container spacing={2} style={{ marginTop: '5px' }}>
        {props.mapData.map((data) => (
          <Grid item xs={3} key={data.id}>
            <MapCard
              data={data}
              // title={data.title}
              // description={data.description}
              // // author={props.type === MapGridType.BROWSE ? data.author : null}
              // author={props.type === MapGridType.BROWSE ? api.getUserById(data.authorId) : null}
              // image={data.imgPath}
              // tags={data.tags}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MapGrid;
export { MapGridType };
