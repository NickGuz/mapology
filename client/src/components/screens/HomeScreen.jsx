import React, { useState, useEffect, useContext } from 'react';
import MapGrid, { MapGridType } from '../util/MapGrid';
import Carousel from 'react-material-ui-carousel';
import Typography from '@mui/material/Typography';
import { Box, Button, Paper } from '@mui/material';
import {
  getAllMaps,
  getThumbnail,
  getAllMapsByUserId
} from '../../store/GlobalStoreHttpRequestApi';
import GlobalStoreContext from '../../store/store';
import AuthContext from '../../auth/AuthContextProvider';



const HomeScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [carouselMaps, setCarouselMaps] = useState([]);
  useEffect(() => {
    const getData = async () => {
      
      const userMaps = await getAllMapsByUserId(auth.user.id);
      const allMaps = await getAllMaps();
      // console.log('all maps', allMaps);
      store.setDisplayedMaps(userMaps.data.data);
      setCarouselMaps(allMaps.data.data);
    };

    getData();
  }, [auth.user]);

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

  useEffect(() => {
    const fetchThumbnail = async () => {
      let res = await getThumbnail(props.item.id);
      let blob = res.data;
      blob = blob.slice(0, blob.size, 'image/png');
      setImage(blob);
    };

    fetchThumbnail();
  }, []);

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
        <Button className="CheckButton">Duplicate</Button>
        <Button className="CheckButton">Details</Button>
      </Box>
    </Paper>
  );
};

export default HomeScreen;
