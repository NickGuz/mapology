import React from 'react';
import Comment from './Comment';
import data from '../map-data.js'
import Chip from '@mui/material/Chip';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
} from "@mui/material";

const MapInfoScreen = (props) => {
  let italy = data[0];
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const handleLike = () => {
   
  }
  const handleDislike = () => {

  }
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  }
  const handleDeleteMap = () => {
    setDeleteOpen(false);
    navigate('/');
  }
  const handleDeleteMapDialog = () =>{
    setDeleteOpen(true);
  }

  return (
    
    <div style={{ display: "flex", width: "100%" }}>
        <Box sx={{ flex: "3 0 75%"}}>
          <Box sx= {{display: 'flex', mt: 2}}>
            <Typography variant='h5' sx={{ml: 2}}> {italy.title}</Typography>
          </Box>
          
          <Typography variant='subtitle1' sx={{ml: 2}}> by {italy.author}</Typography>

          <img src={italy.imgPath}  style={{maxHeight: "100%"}}  />
          
          <Box border={1} borderColor={'gray'} borderRadius={'10px'} sx={{flexDirection:'column' ,display:'flex' , ml: 2, mt: 10, height: "100px", width: "90%"}}>
            <Box sx={{ display:'flex', justifyContent:"flex-end"}}>
              <Typography variant='subtitle1' sx={{ml: 2}}> {italy.description}</Typography>
              <IconButton sx={{ml:'auto'}} onClick={handleLike}> <ThumbUpIcon/> 0 </IconButton>
              <IconButton onClick={handleDislike}> <ThumbDownIcon/> 0</IconButton>
            </Box>
            
            <Box display={'flex'}>
              {italy.tags.map((tag) => (
                <Chip 
                    key={tag}
                    sx={{marginTop: '4px', marginRight: '4px', marginLeft: '4px'}} 
                    label={tag} 
                
                />
              ))}
              <IconButton onClick={handleDeleteMapDialog} sx={{ml:'auto', mr: 2}}><DeleteIcon/> </IconButton>
            </Box>
          </Box>
        </Box>
        <Comment sx={{ flex: "1 0 25%" }} />
        <Dialog open={deleteOpen} onClose={handleDeleteClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Are you sure you want to PERMANENTLY delete this map?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDeleteClose}>Cancel</Button>
            <Button onClick={handleDeleteMap} autoFocus>
                Delete
            </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}

export default MapInfoScreen