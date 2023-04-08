import React from 'react';
import MapGrid, { MapGridType } from './MapGrid';
import Carousel from 'react-material-ui-carousel';
import Typography from '@mui/material/Typography';
import mapData from '../map-data';
import { Box, Button, Paper } from '@mui/material';

const HomeScreen = (props) => {
    return (
        <div style={{ 
                paddingTop: '30px',
                justifyContent: 'center',
            }}
        >
            <Carousel
                sx={{
                    textAlign: 'center',
                }}
                navButtonsWrapperProps={{
                    style: {
                        minWidth: '28%'
                    }
                }}
            >
                {
                    mapData.map((item, i) => (
                        <Item key={i} item={item} />
                    ))
                }
            </Carousel>
            <MapGrid mapData={mapData} type={MapGridType.BROWSE} />
        </div>
    )
}

const Item = (props) => {
    return (
        <Paper 
            elevation={3}
            sx={{ 
                textAlign: 'center',
                maxWidth: '80%',
                marginLeft: '10%'
            }}
        >
            <img 
                style={{
                    minHeight: '350px',
                    maxHeight: '350px',
                }}
                src={props.item.imgPath}
                alt='map'
            >
            </img>
            <Typography variant="h5">
                {props.item.title}
            </Typography>
            <Typography variant="body2">
                {props.item.description}
            </Typography>
            <Box>
                <Button className="CheckButton">
                    Duplicate
                </Button>
                <Button className="CheckButton">
                    Details
                </Button>
            </Box>
        </Paper>
    );
}

export default HomeScreen;