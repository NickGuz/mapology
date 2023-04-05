import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { Button, CardActions, Typography } from '@mui/material';

const MapCard = (props) => {
    return (
        <Card variant="outlined" sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140 }}
                image=""
                title="map"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.title || 'Map'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.description || "Description"}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Duplicate</Button>
                <Button size="small">Details</Button>
            </CardActions>
        </Card> 
    )
}

export default MapCard;