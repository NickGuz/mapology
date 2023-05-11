import React, { useEffect, useContext } from "react";
import Comment from "../util/Comment";
import data from "../../map-data.js";
import CardMedia from '@mui/material/CardMedia';
import Chip from "@mui/material/Chip";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  FormControlLabel,
  Switch,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { getMapById, getThumbnail, deleteMap, hasLike, addLike, getAllMapLikes, deleteLike } from "../../store/GlobalStoreHttpRequestApi";
import {hasDislike, addDislike, getAllMapDislikes, deleteDislike, changePublish, getPublished } from "../../store/GlobalStoreHttpRequestApi";
import AuthContext from '../../auth/AuthContextProvider';

const MapInfoScreen = (props) => {
  const [mapData, setMapData] = useState(null);
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [likes, setLikes] = useState({});
  const [userLike, setUserLike] = useState(false);
  const [dislikes, setDislikes] = useState({});
  const [userDislike, setUserDislike] = useState(false);
  const [publish, setPublish] = useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const routeParams = useParams();
  

  useEffect(() => {
    const fetchData = async () => {
      const mapRes = await getMapById(routeParams.id)
      setMapData(mapRes.data.data);
      const allMapLikes = await getAllMapLikes(routeParams.id)
      setLikes(allMapLikes.data)
      const allMapDislikes = await getAllMapDislikes(routeParams.id)
      setDislikes(allMapDislikes.data)
      const img = await getThumbnail(routeParams.id);
      let blob = img.data;
      blob = blob.slice(0, blob.size, 'image/png');
      setImage(blob);
      const publish = await getPublished(routeParams.id);
      setPublish(publish.data.published);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const helper = async () => {
      const userLiked = await hasLike(auth.user.id, routeParams.id);
      if (userLiked.status == "404"){
        setUserLike(false);
      }
      else{
        setUserLike(true);
      } 
    }
    helper();
  }, [likes]);

  useEffect(() => {
    const helper = async () => {
      const userDisliked = await hasDislike(auth.user.id, routeParams.id);
      if (userDisliked.status == "404"){
        setUserDislike(false);
      }
      else{
        setUserDislike(true);
      }
    }
    helper();
  }, [dislikes]);

  const handleLike = () => {
    let liked = null;
    const helper = async () => {
      liked = await hasLike(auth.user.id, routeParams.id);
      if(liked.status == "404"){
        if (userDislike){
          await deleteDislike(auth.user.id, routeParams.id);
          let allMapDislikes = await getAllMapLikes(routeParams.id);
          setDislikes(allMapDislikes.data);
        }
        await addLike(auth.user.id, routeParams.id);
        let allMapLikes = await getAllMapLikes(routeParams.id);
        setLikes(allMapLikes.data);
      }
      else if(liked.status == "200"){
        await deleteLike(auth.user.id, routeParams.id);
        let allMapLikes = await getAllMapLikes(routeParams.id);
        setLikes(allMapLikes.data);
      }
      
    };
    helper();
  };

  const handleDislike = () => {
    let disliked = null;
    const helper = async () => {
      disliked = await hasDislike(auth.user.id, routeParams.id);
      if(disliked.status == "404"){
        if (userLike){
          await deleteLike(auth.user.id, routeParams.id);
          let allMapLikes = await getAllMapLikes(routeParams.id);
          setLikes(allMapLikes.data);
        }
        await addDislike(auth.user.id, routeParams.id);
        let allMapDislikes = await getAllMapDislikes(routeParams.id);
        setDislikes(allMapDislikes.data);
      }
      else if(disliked.status == "200"){
        await deleteDislike(auth.user.id, routeParams.id);
        let allMapDislikes = await getAllMapDislikes(routeParams.id);
        setDislikes(allMapDislikes.data);
      }
      
    };
    helper();
  };

  
  const handleTagClick = () => {};

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  // TODO need to set this to only allow author to delete once we get accounts setup
  const handleDeleteMap = () => {
    if (!mapData) {
      return;
    }
    deleteMap(mapData.mapInfo.id);
    setDeleteOpen(false);
    navigate("/");
  };

  const handleDeleteMapDialog = () => {
    setDeleteOpen(true);
  };

  const handleOpenEditor = () => {
    navigate(`/map-editor/${mapData.mapInfo.id}`);

  };

  const handleChangePublish = () => {
    const helper = async () =>{
      await changePublish(routeParams.id, !publish);
      let change = await getPublished(routeParams.id);
      console.log(change);
      setPublish(change.data.published)
    }
    helper();
  }
  

  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
      <Box sx={{ flex: "3 0 75%", ml: 5 }}>
        <Box sx={{ display: "flex", mt: 2 }}>
          <Typography variant="h5" sx={{ ml: 2 }}>
            {mapData && mapData.mapInfo.title}
          </Typography>
          <FormGroup sx={{ marginLeft: 2 }}>
            <FormControlLabel control={<Switch checked = {publish} onChange={handleChangePublish}/>} label="Public" />
          </FormGroup>
        </Box>

        <Typography variant="subtitle1" sx={{ ml: 2 }}>
          {" "}
          by {mapData && mapData.author.username}
        </Typography>
        
        <CardMedia
          sx={{
            height: "75%",
            width: "80%",
            ml: "5%",
            mt: 3,
            
          }}
        image={image}
        title="map"
      />

        <Box
          border={1}
          borderColor={"gray"}
          borderRadius={"10px"}
          sx={{
            flexDirection: "column",
            display: "flex",
            ml: 5,
            mt: 5,
            height: "14%",
            width: "85%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end"}}>
            <Typography variant="subtitle1" sx={{ ml: 2, mt: 1 , mr: 'auto'}}>
              {" "}
              {mapData && mapData.mapInfo.description}
            </Typography>
            <Box sx={{ visibility: publish? "": "hidden", display: "flex", justifyContent: "flex-end", mr: 2, mt: 1}}>
              <IconButton sx={{ ml: "auto", color: ((!auth.user)?'grey': (userLike?"blue":"black")) }} onClick={handleLike} disabled = {!auth.loggedIn} >
                <ThumbUpIcon />
              </IconButton>
              <Typography sx={{paddingTop:0.75, fontSize:25}}>{likes.length}</Typography>
              <IconButton sx={{  color: ((!auth.user)?'grey': (userDislike?"blue":"black")) }} onClick={handleDislike} disabled = {!auth.loggedIn}>
                <ThumbDownIcon /> 
              </IconButton>
              <Typography sx={{paddingTop:0.75, fontSize:25}}>{dislikes.length}</Typography>
            </Box>
          </Box>

          <Box display={"flex"} >
            {mapData &&
              mapData.tags.map((tag) => (
                <Chip
                  key={tag.tagName}
                  sx={{ marginTop: "4px", marginRight: "4px", marginLeft: "4px" }}
                  label={tag.tagName}
                  onClick={handleTagClick}
                />
              ))}
          </Box>
          <Box display="flex" justifyContent="right" sx = {{mt: 'auto'}}>
            <Button>Duplicate</Button>
            <Button onClick={handleOpenEditor}>Open Editor</Button>
            <Button onClick={handleDeleteMapDialog} sx={{  mr: 1 }}>Delete Map</Button>
          </Box>
        </Box>
      </Box>
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to PERMANENTLY delete this map?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button id="confirm-delete-btn" onClick={handleDeleteMap} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{mt: 6}}>
        <Comment sx={{ flex: "1 0 25%"}} />
      </Box>
    </div>
  );
};

export default MapInfoScreen;
