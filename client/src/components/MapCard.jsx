import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { Button, ButtonBase, CardActions, Typography } from '@mui/material';

const MapCard = (props) => {
    const navigate = useNavigate();
    const handleTagClick = (event) => {
    }

    const handleOpenEdit = (event) =>{
        navigate("/map-editor/");

    }
    const handleOpenInfo = (event) => {
        navigate("/map-info/");
    };

    return (
        <Card variant="outlined" sx={{ maxWidth: 400 }}>
            <CardMedia
                    sx={{ height: 140 }}
                    image={props.image} 
                    title="map"
            />
            <CardContent  sx={{ paddingBottom: 0 }}>
                <Typography gutterBottom variant="h5" component="div" align='left'>
                    {props.title || 'Map'}
                </Typography>
                <Typography variant="body2" color="text.secondary" align='left'>
                    {props.description || "Description"}
                </Typography>
                {props.author &&
                <Typography variant="body2" color="text.secondary" align='left'>
                    by {props.author}
                </Typography>}

                    
            </CardContent>
            {props.tags.map((tag) => (
                        <Chip 
                            key={tag}
                            sx={{marginTop: '4px', marginRight: '4px', marginLeft: '4px'}} 
                            label={tag} 
                            onClick={handleTagClick} 
                        />
                    ))}
            <CardActions>
                <Button size="small">Duplicate</Button>
                <Button onClick={handleOpenInfo} size="small">Details</Button>
                <Button onClick={handleOpenEdit} size="small">Open Editor</Button>
            </CardActions>
        </Card> 
    )
}

export default MapCard;