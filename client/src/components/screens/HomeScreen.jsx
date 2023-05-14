import React, { useState, useEffect, useContext } from 'react';
import MapGrid, { MapGridType } from '../util/MapGrid';
import Carousel from 'react-material-ui-carousel';
import Typography from '@mui/material/Typography';
import { Box, Button, Paper } from '@mui/material';
import {
  getAllMaps,
  getAllMapsByUserId,
} from '../../store/GlobalStoreHttpRequestApi';
import GlobalStoreContext from '../../store/store';
import { duplicateMap } from '../../store/GlobalStoreHttpRequestApi';
import AuthContext from '../../auth/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [carouselMaps, setCarouselMaps] = useState([]);
  useEffect(() => {
    const getData = async () => {
      if (auth.user) {
        const userMaps = await getAllMapsByUserId(auth.user.id);
        store.setDisplayedMaps(userMaps.data.data);
      }
    };
    getData();
  }, [auth.user]);

  useEffect(() => {
    const getData = async () => {
      const allMaps = await getAllMaps();
      setCarouselMaps(allMaps.data.data);
    };

    getData();
  }, []);

  return (
    <div
      style={{
        paddingTop: '30px',
        justifyContent: 'center',
        marginLeft: '10%',
        marginRight: '10%',
      }}
    >
      <div style={{ justifyContent: 'center' }}>
        <Carousel
          sx={{
            textAlign: 'center',
          }}
          navButtonsWrapperProps={{
            style: {
              minWidth: '28%',
            },
          }}
        >
          {carouselMaps.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </Carousel>
      </div>
      <MapGrid mapData={store.displayedMaps} type={MapGridType.BROWSE} />
    </div>
  );
};

const Item = (props) => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (!props.item.thumbnail) return;
      let blob = props.item.thumbnail.image;
      blob = blob.slice(0, blob.size, 'image/png');
      setImage(blob);
    };

    fetchThumbnail();
  }, []);

  const handleDuplicate = () => {
    if (!auth.user) {
      window.alert('You must sign in to duplicate a map');
      return;
    }
    duplicateMap(auth.user.id, props.item.id);
  };

  const handleDetails = () => {
    navigate(`/map-info/${props.item.id}`);
  };

  return (
    <Paper
      sx={{
        textAlign: 'center',
      }}
      variant="outlined"
    >
      <img
        style={{
          minHeight: '350px',
          maxHeight: '350px',
        }}
        src={image}
        alt="map"
      ></img>
      <Typography variant="h5">{props.item.title}</Typography>
      <Typography variant="body2">{props.item.description}</Typography>
      <Box>
        <Button className="CheckButton" onClick={handleDuplicate}>
          Duplicate
        </Button>
        <Button className="CheckButton" onClick={handleDetails}>
          Details
        </Button>
      </Box>
    </Paper>
  );
};

export default HomeScreen;
