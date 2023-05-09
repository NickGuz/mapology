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
// import GlobalStoreContext from '../../store/store';
import AuthContext from '../../auth/AuthContextProvider';
import { IconButton } from '@mui/material';

const MapCard = (props) => {
  const [likes, setLikes] = useState({});
  const [userLike, setUserLike] = useState(false);
  const [dislikes, setDislikes] = useState({});
  const [userDislike, setUserDislike] = useState(false);
  const navigate = useNavigate();
  // const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    console.log('data', props.data);
    setUserLike(props.data.likes.some((l) => l.userId === auth.user.id));
    setUserDislike(props.data.dislikes.some((l) => l.userId === auth.user.id));
    setLikes(props.data.likes);
    setDislikes(props.data.dislikes);
  }, []);

  useEffect(() => {
    const helper = async () => {
      const userLiked = await hasLike(auth.user.id, props.data.id);
      if (userLiked.status == '404') {
        setUserLike(false);
      } else {
        setUserLike(true);
      }
    };
    helper();
  }, [likes]);

  useEffect(() => {
    const helper = async () => {
      const userDisliked = await hasDislike(auth.user.id, props.data.id);
      if (userDisliked.status == '404') {
        setUserDislike(false);
      } else {
        setUserDislike(true);
      }
    };
    helper();
  }, [dislikes]);

  const handleLike = () => {
    let liked = null;
    const helper = async () => {
      liked = await hasLike(auth.user.id, props.data.id);
      if (liked.status == '404') {
        if (userDislike) {
          await deleteDislike(auth.user.id, props.data.id);
          let allMapDislikes = await getAllMapLikes(props.data.id);
          setDislikes(allMapDislikes.data);
        }
        await addLike(auth.user.id, props.data.id);
        let allMapLikes = await getAllMapLikes(props.data.id);
        setLikes(allMapLikes.data);
      } else if (liked.status == '200') {
        await deleteLike(auth.user.id, props.data.id);
        let allMapLikes = await getAllMapLikes(props.data.id);
        setLikes(allMapLikes.data);
      }
    };
    helper();
  };

  const handleDislike = () => {
    const helper = async () => {
      if (!userDislike) {
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
    navigate(`/profile/${props.data.user.id}`);
  };

  const handleDuplicate = () => {
    const helper = async () => {
      let res = await duplicateMap(auth.user.id, props.data.id);
      navigate(`/map-editor/${res.data.data.id}`);
    };
    helper();
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 400 }}>
      <CardMedia
        sx={{ height: 280 }}
        image={
          props.data.thumbnail.image.slice(
            0,
            props.data.thumbnail.image.size,
            'image/png'
          ) || Italy /*props.data.imgPath*/
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
        {props.data.user && (
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
              {props.data.user.username}
            </Link>
          </Typography>
        )}
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {props.data.tags &&
          props.data.tags.map((tag) => (
            <Chip
              key={tag.tagName}
              sx={{ marginTop: '4px', marginRight: '4px', marginLeft: '4px' }}
              label={tag.tagName}
              onClick={handleTagClick}
            />
          ))}

        <IconButton
          sx={{
            ml: 'auto',
            color: !auth.user ? 'grey' : userLike ? 'blue' : 'black',
          }}
          onClick={handleLike}
          disabled={!auth.loggedIn}
        >
          <ThumbUpIcon />
        </IconButton>
        <Typography sx={{ paddingTop: 0.75, fontSize: 25 }}>
          {likes.length - dislikes.length}
        </Typography>
        <IconButton
          sx={{ color: !auth.user ? 'grey' : userDislike ? 'blue' : 'black' }}
          onClick={handleDislike}
          disabled={!auth.loggedIn}
        >
          <ThumbDownIcon />
        </IconButton>
        {/* <Typography sx={{ paddingTop: 0.75, fontSize: 25 }}>
          {dislikes.length}
        </Typography> */}
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
