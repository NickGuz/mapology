import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { Button, CardActions, Typography } from '@mui/material';

const MapCard = (props) => {

    const handleTagClick = (event) => {

    }

    return (
        <Card variant="outlined" sx={{ maxWidth: 400 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={props.image} 
                title="map"
            />
            <CardContent sx={{ paddingBottom: 0 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {props.title || 'Map'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.description || "Description"}
                </Typography>
                {props.author &&
                <Typography variant="body2" color="text.secondary">
                    by {props.author}
                </Typography>}

                {props.tags.map((tag) => (
                    <Chip sx={{marginTop: '8px', marginRight: '4px'}} label={tag} onClick={handleTagClick} />
                ))}
            </CardContent>
            <CardActions>
                <Button size="small">Duplicate</Button>
                <Button size="small">Details</Button>
            </CardActions>
        </Card> 
    )
}

export default MapCard;