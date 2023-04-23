import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Italy from "../assets/italy.gif";
import { Button, CardActions, Typography } from "@mui/material";
import api from "../auth/auth-request-api/AuthRequestApi";
import { getMapById, getTagsByMapId } from "../store/GlobalStoreHttpRequestApi";
import GlobalStoreContext from "../store/store";

const MapCard = (props) => {
  const [author, setAuthor] = useState(null);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    const getAuthorData = async () => {
      let res = await api.getUserById(props.data.authorId);
      setAuthor(res.data);
    };

    const getTagsData = async () => {
      let res = await getTagsByMapId(props.data.id);
      setTags(res.data.data);
    };

    getAuthorData();
    getTagsData();
  }, [store.currentMap]);

  const handleTagClick = (event) => {};

  const handleOpenEdit = (event) => {
    navigate(`/map-editor/${props.data.id}`);
  };

  const handleOpenInfo = (event) => {
    navigate(`/map-info/${props.data.id}`);
  };

  const handleClickUsername = () => {
    navigate(`/profile/${author.id}`);
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 400 }}>
      <CardMedia sx={{ height: 280 }} image={Italy /*props.data.imgPath*/} title="map" />
      <CardContent sx={{ paddingBottom: 0 }}>
        <Typography gutterBottom variant="h5" component="div" align="left">
          {props.data.title || "Map"}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="left">
          {props.data.description || "Description"}
        </Typography>
        {author && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="left"
            onClick={handleClickUsername}
          >
            by{" "}
            <Link underline="hover" color="inherit" style={{ cursor: "pointer" }}>
              {author.username}
            </Link>
          </Typography>
        )}
      </CardContent>
      {tags &&
        tags.map((tag) => (
          <Chip
            key={tag.tagName}
            sx={{ marginTop: "4px", marginRight: "4px", marginLeft: "4px" }}
            label={tag.tagName}
            onClick={handleTagClick}
          />
        ))}
      <CardActions>
        <Button size="small">Duplicate</Button>
        <Button onClick={handleOpenInfo} size="small">
          Details
        </Button>
        <Button onClick={handleOpenEdit} size="small">
          Open Editor
        </Button>
      </CardActions>
    </Card>
  );
};

export default MapCard;