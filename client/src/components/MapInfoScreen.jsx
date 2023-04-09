import { Box } from '@mui/material';
import React from 'react';
import Comment from './Comment';

const MapInfoScreen = () => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
        <Box sx={{ flex: "3 0 75%" }}>hi</Box>
        <Comment sx={{ flex: "1 0 25%" }} />
    </div>
  );
}

export default MapInfoScreen