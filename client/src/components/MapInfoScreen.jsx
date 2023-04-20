import React, { useEffect } from "react";
import Comment from "./Comment";
import data from "../map-data.js";
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
import { getMapById, getTagsByMapId } from "../store/GlobalStoreHttpRequestApi";
import api from "../auth/auth-request-api/AuthRequestApi";

const MapInfoScreen = (props) => {
  const [mapData, setMapData] = useState(null);
  const [author, setAuthor] = useState(null);
  const [tags, setTags] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const routeParams = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const mapRes = await getMapById(routeParams.id);
      setMapData(mapRes.data.data);
      console.log("map data set", mapRes.data.data);
    };

    fetchData();
  }, []);

  const handleLike = () => {};

  const handleDislike = () => {};

  const handleTagClick = () => {};

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDeleteMap = () => {
    setDeleteOpen(false);
    navigate("/");
  };

  const handleDeleteMapDialog = () => {
    setDeleteOpen(true);
  };

  const handleOpenEditor = () => {
    navigate("/map-editor/");
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
            <IconButton sx={{ ml: "auto" }} onClick={handleLike}>
              {" "}
              <ThumbUpIcon /> 0{" "}
            </IconButton>
            <IconButton onClick={handleDislike}>
              {" "}
              <ThumbDownIcon /> 0
            </IconButton>
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
              <DeleteIcon />{" "}
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
          <Button onClick={handleDeleteMap} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MapInfoScreen;
