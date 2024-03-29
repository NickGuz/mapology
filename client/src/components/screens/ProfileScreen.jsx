import React, { useEffect, useState, useContext } from 'react';
import MapGrid, { MapGridType } from '../util/MapGrid';
import Banner from '../util/Banner';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import mapData from '../../map-data';
import { styled } from '@mui/material/styles';
import { Avatar, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../auth/auth-request-api/AuthRequestApi';
import { getPublicMapById } from '../../store/GlobalStoreHttpRequestApi';
import GlobalStoreContext from '../../store/store';

const InfoBanner = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  backgroundColor: '#bbdefb',
  height: 50,
  lineHeight: '60px',
  marginTop: '-5px', // Hide whitespace on top
  paddingLeft: '5%',
  paddingTop: '1%',
  paddingBottom: '1%',
}));

const ProfileScreen = (props) => {
  const [user, setUser] = useState(null);
  const routeParams = useParams();
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    const getUserData = async () => {
      const res = await api.getUserById(routeParams.id);
      setUser(res.data);
      if (res.data) {
        const allMaps = await getPublicMapById(res.data.id);

        store.setDisplayedMaps(allMaps.data.data);
      }
    };
    getUserData().catch(console.error);
  }, []);

  return (
    <>
      <Banner src={require('../../assets/banner.jpg')} />
      <InfoBanner key="user-info" elevation={4}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Avatar
              sx={{
                height: 70,
                width: 70,
              }}
              alt="User Profile Image"
              // src={require("../../assets/sample_avatar.png")}
            >
              {user && user.username[0].toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h5">{user && user.username}</Typography>
            <Typography>{user && user.bio}</Typography>
          </Grid>
        </Grid>
      </InfoBanner>
      <MapGrid mapData={store.displayedMaps} type={MapGridType.PROFILE} />
    </>
  );
};

export default ProfileScreen;
