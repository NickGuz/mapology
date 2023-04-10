import { Box, Typography } from '@mui/material';
import React from 'react';
import Comment from './Comment';
import data from '../map-data.js'
import Chip from '@mui/material/Chip';

const MapInfoScreen = (props) => {
  let italy = data[0];
  return (
    
    <div style={{ display: "flex", width: "100%" }}>
        <Box sx={{ flex: "3 0 75%"}}>
          <Typography variant='h5' sx={{ml: 2}}> {italy.title}</Typography>
          <Typography variant='subtitle1' sx={{ml: 2}}> by {italy.author}</Typography>
          <img src={italy.imgPath}  style={{maxHeight: "100%"}}  />
          <Box border={1} sx={{ml: 2, height: "100px", width: "90%"}}>
            <Typography variant='subtitle1' sx={{ml: 2}}> {italy.description}</Typography>
            {italy.tags.map((tag) => (
                        <Chip 
                            key={tag}
                            sx={{marginTop: '4px', marginRight: '4px', marginLeft: '4px'}} 
                            label={tag} 
                        
                        />
                    ))}
          </Box>
        </Box>
        <Comment sx={{ flex: "1 0 25%" }} />
    </div>
  );
}

export default MapInfoScreen