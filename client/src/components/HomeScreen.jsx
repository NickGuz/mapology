import React from 'react';
import MapGrid, { MapGridType } from './MapGrid';
import mapData from '../map-data';

const HomeScreen = (props) => {
    return (
        <div style={{ paddingTop: '100px' }}>
            <MapGrid mapData={mapData} type={MapGridType.BROWSE} />
        </div>
    )
}

export default HomeScreen;