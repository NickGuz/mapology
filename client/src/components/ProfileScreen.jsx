import React, { useEffect, useState } from "react";
import MapGrid, { MapGridType } from "./MapGrid";
import Banner from "./Banner";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import mapData from "../map-data";
import { styled } from "@mui/material/styles";
import { Avatar, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../auth/auth-request-api/AuthRequestApi";

const InfoBanner = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "left",
  backgroundColor: "#d7d7d7",
  height: 60,
  lineHeight: "60px",
  marginTop: "-5px", // Hide whitespace on top
  paddingLeft: "5%",
  paddingTop: "1%",
  paddingBottom: "1%",
}));

const ProfileScreen = (props) => {
  const [user, setUser] = useState(null);
  const routeParams = useParams();

  useEffect(() => {
    const getUserData = async () => {
      const res = await api.getUserById(routeParams.id);
      setUser(res.data);
    };

    getUserData();
  }, []);

  return (
    <>
      <Banner src={require("../assets/tree.jpg")} />
      <InfoBanner key="user-info" elevation={4}>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <Avatar
              sx={{
                height: 70,
                width: 70,
              }}
              alt="User Profile Image"
              src={require("../assets/sample_avatar.png")}
            />
          </Grid>
          <Grid item>
            <Typography variant="h5">{user && user.username}</Typography>
            <Typography>{user && user.bio}</Typography>
          </Grid>
        </Grid>
      </InfoBanner>
      <MapGrid mapData={mapData} type={MapGridType.PROFILE} />
    </>
  );
};

export default ProfileScreen;
