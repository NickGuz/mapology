import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Italy from '../../assets/italy.gif';
import { Box, Button, CardActions, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {
  duplicateMap,
  hasLike,
  addLike,
  getAllMapLikes,
  deleteLike,
  hasDislike,
  addDislike,
  getAllMapDislikes,
  deleteDislike,
} from '../../store/GlobalStoreHttpRequestApi';
import AuthContext from '../../auth/AuthContextProvider';
import { IconButton } from '@mui/material';

const MapCard = (props) => {
  const [author, setAuthor] = useState(null);
  const [tags, setTags] = useState([]);
  const [likes, setLikes] = useState({});
  const [userLike, setUserLike] = useState(false);
  const [dislikes, setDislikes] = useState({});
  const [userDislike, setUserDislike] = useState(false);
  const [published, setPublished] = useState(false);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.user) {
      setUserLike(props.data.likes.some((l) => l.userId === auth.user.id));
      setUserDislike(
        props.data.dislikes.some((l) => l.userId === auth.user.id)
      );
    }
    setLikes(props.data.likes);
    setDislikes(props.data.dislikes);
    setPublished(props.data.published);
    setAuthor(props.data.user);
    setTags(props.data.tags);
  }, []);

  const handleLike = () => {
    let liked = null;
    const helper = async () => {
      liked = await hasLike(auth.user.id, props.data.id);
      if (!liked.data) {
        if (userDislike) {
          await deleteDislike(auth.user.id, props.data.id);
          let allMapDislikes = await getAllMapLikes(props.data.id);
          setDislikes(allMapDislikes.data);
          setUserDislike(false);
        }
        await addLike(auth.user.id, props.data.id);
        let allMapLikes = await getAllMapLikes(props.data.id);
        setLikes(allMapLikes.data);
        setUserLike(true);
      } else {
        await deleteLike(auth.user.id, props.data.id);
        let allMapLikes = await getAllMapLikes(props.data.id);
        setLikes(allMapLikes.data);
        setUserLike(false);
      }
    };
    helper();
  };

  const handleDislike = () => {
    let disliked = null;
    const helper = async () => {
      disliked = await hasDislike(auth.user.id, props.data.id);
      if (!disliked.data) {
        if (userLike) {
          await deleteLike(auth.user.id, props.data.id);
          let allMapLikes = await getAllMapLikes(props.data.id);
          setLikes(allMapLikes.data);
          setUserLike(false);
        }
        await addDislike(auth.user.id, props.data.id);
        let allMapDislikes = await getAllMapDislikes(props.data.id);
        setDislikes(allMapDislikes.data);
        setUserDislike(true);
      } else {
        await deleteDislike(auth.user.id, props.data.id);
        let allMapDislikes = await getAllMapDislikes(props.data.id);
        setDislikes(allMapDislikes.data);
        setUserDislike(false);
      }
    };
    helper();
  };
  const handleTagClick = () => {};

  const handleOpenEdit = () => {
    navigate(`/map-editor/${props.data.id}`);
  };

  const handleOpenInfo = () => {
    navigate(`/map-info/${props.data.id}`);
  };

  const handleClickUsername = () => {
    navigate(`/profile/${author.id}`);
  };

  const handleDuplicate = () => {
    const helper = async () => {
      let res = await duplicateMap(auth.user.id, props.data.id);
      navigate(`/map-editor/${res.data.data.id}`);
    };
    helper();
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 400,
        backgroundImage: published
          ? 'linear-gradient(to bottom right, white, 80%, #bbdefb)'
          : 'white',
      }}
    >
      <CardMedia
        sx={{ height: 280 }}
        image={
          props.data.thumbnail
            ? props.data.thumbnail.image.slice(
                0,
                props.data.thumbnail.image.size,
                'image/png'
              )
            : Italy /*props.data.imgPath*/
        }
        title="map"
      />
      <CardContent sx={{ paddingBottom: 0 }}>
        <Typography gutterBottom variant="h5" component="div" align="left">
          {props.data.title || 'Map'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="left">
          {props.data.description || 'Description'}
        </Typography>
        {author && (
          <Typography
            variant="body2"
            color="text.secondary"
            align="left"
            onClick={handleClickUsername}
          >
            by{' '}
            <Link
              underline="hover"
              color="inherit"
              style={{ cursor: 'pointer' }}
            >
              {author.username}
            </Link>
          </Typography>
        )}
      </CardContent>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ justifyContent: 'flex-start' }}>
          {tags &&
            tags.map((tag) => (
              <Chip
                key={tag.tagName}
                sx={{ marginTop: '4px', marginRight: '4px', marginLeft: '4px' }}
                label={tag.tagName}
                onClick={handleTagClick}
              />
            ))}
        </Box>
        <Box
          sx={{
            visibility: published ? '' : 'hidden',
            ml: 'auto',
            mr: 1,
            display: 'flex',
          }}
        >
          <IconButton
            sx={{
              ml: 'auto',
              color: !auth.user ? 'grey' : userLike ? '#3d5afe' : 'black',
            }}
            onClick={handleLike}
            disabled={!auth.loggedIn}
          >
            <ThumbUpIcon />
          </IconButton>
          <Typography sx={{ paddingTop: 0.75, fontSize: 25 }}>
            {likes.length}
          </Typography>
          <IconButton
            sx={{
              color: !auth.user ? 'grey' : userDislike ? '#3d5afe' : 'black',
            }}
            onClick={handleDislike}
            disabled={!auth.loggedIn}
          >
            <ThumbDownIcon />
          </IconButton>
          <Typography sx={{ paddingTop: 0.75, fontSize: 25 }}>
            {dislikes.length}
          </Typography>
        </Box>
      </Box>

      <CardActions>
        <Button
          onClick={handleDuplicate}
          disabled={!auth.loggedIn}
          size="small"
        >
          Duplicate
        </Button>
        <Button
          onClick={handleOpenInfo}
          size="small"
          className="card-details-btn"
        >
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
