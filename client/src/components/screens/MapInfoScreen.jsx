import React, { useEffect, useContext } from "react";
import Comment from "../util/Comment";
import data from "../../map-data.js";
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
import { getMapById, deleteMap, hasLike, addLike, getAllMapLikes, deleteLike } from "../../store/GlobalStoreHttpRequestApi";
import {hasDislike, addDislike, getAllMapDislikes, deleteDislike } from "../../store/GlobalStoreHttpRequestApi";
import AuthContext from '../../auth/AuthContextProvider';

const MapInfoScreen = (props) => {
  const [mapData, setMapData] = useState(null);
  const [tags, setTags] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [likes, setLikes] = useState({});
  const [userLike, setUserLike] = useState(false);
  const [dislikes, setDislikes] = useState({});
  const [userDislike, setUserDislike] = useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const routeParams = useParams();
  

  useEffect(() => {
    const fetchData = async () => {
      const mapRes = await getMapById(routeParams.id)
      setMapData(mapRes.data.data)
      const allMapLikes = await getAllMapLikes(routeParams.id)
      setLikes(allMapLikes.data)
      const allMapDislikes = await getAllMapDislikes(routeParams.id)
      setDislikes(allMapDislikes.data)
    
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

  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
      <Box sx={{ flex: "3 0 75%", ml: 5 }}>
        <Box sx={{ display: "flex", mt: 2 }}>
          <Typography variant="h5" sx={{ ml: 2 }}>
            {" "}
            {mapData && mapData.mapInfo.title}
          </Typography>
          <FormGroup sx={{ marginLeft: 2 }}>
            <FormControlLabel control={<Switch defaultChecked />} label="Public" />
          </FormGroup>
        </Box>

        <Typography variant="subtitle1" sx={{ ml: 2 }}>
          {" "}
          by {mapData && mapData.author.username}
        </Typography>

        <img alt="italy" src={""} style={{ maxHeight: "100%" }} />

        <Box
          border={1}
          borderColor={"gray"}
          borderRadius={"10px"}
          sx={{
            flexDirection: "column",
            display: "flex",
            ml: 2,
            mt: 10,
            height: "14%",
            width: "90%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              {" "}
              {mapData && mapData.mapInfo.description}
            </Typography>
            <IconButton sx={{ ml: "auto", color: ((!auth.user)?'grey': (userLike?"blue":"black")) }} onClick={handleLike}>
              <ThumbUpIcon />
            </IconButton>
            <Typography sx={{paddingTop:0.75, fontSize:25}}>{likes.length}</Typography>
            <IconButton sx={{  color: ((!auth.user)?'grey': (userDislike?"blue":"black")) }} onClick={handleDislike}>
              <ThumbDownIcon /> 
            </IconButton>
            <Typography sx={{paddingTop:0.75, fontSize:25}}>{dislikes.length}</Typography>
          </Box>

          <Box display={"flex"}>
            {mapData &&
              mapData.tags.map((tag) => (
                <Chip
                  key={tag.tagName}
                  sx={{ marginTop: "4px", marginRight: "4px", marginLeft: "4px" }}
                  label={tag.tagName}
                  onClick={handleTagClick}
                />
              ))}
            <IconButton onClick={handleDeleteMapDialog} sx={{ ml: "auto", mr: 2 }}>
              <DeleteIcon id="delete-map-btn" />{" "}
            </IconButton>
          </Box>
          <Box display="flex" justifyContent="left" marginTop="20px">
            <Button>Duplicate</Button>
            <Button onClick={handleOpenEditor}>Open Editor</Button>
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
          <Button id="confirm-delete-btn" onClick={handleDeleteMap} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MapInfoScreen;
