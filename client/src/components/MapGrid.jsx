import React from 'react';
import Grid from '@mui/material/Grid';
import MapCard from './MapCard';

const MapGrid = (props) => {
    return (
        <div style={{ marginLeft: '20%', marginRight: '20%' }}>
            <Grid container spacing={2} style={{ marginTop: '5px' }}>
                {props.mapData.map((data) => (
                    <Grid item xs={4}>
                        <MapCard title={data.title} description={data.description} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default MapGrid;