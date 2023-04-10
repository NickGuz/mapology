import React from 'react';
import Grid from '@mui/material/Grid';
import MapCard from './MapCard';

const MapGridType = {
    BROWSE: "BROWSE",
    PROFILE: "PROFILE"
};

const MapGrid = (props) => {
    return (
        <div style={{ 
            marginLeft: '10%',
            marginRight: '10%',
            marginBottom: '3%'
            }}
        >
            <Grid container spacing={2} style={{ marginTop: '5px' }}>
                {props.mapData.map((data) => (
                    <Grid item xs={3} key={data.title}>
                        <MapCard 
                            title={data.title} 
                            description={data.description} 
                            author={props.type === MapGridType.BROWSE ? data.author : null}
                            image={data.imgPath} 
                            tags={data.tags}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default MapGrid;
export { MapGridType };