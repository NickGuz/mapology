import React, { useState, useEffect, useContext } from "react";
import MapGrid, { MapGridType } from "../util/MapGrid";
import Carousel from "react-material-ui-carousel";
import Typography from "@mui/material/Typography";
import { Box, Button, Paper } from "@mui/material";
import { getAllMaps } from "../../store/GlobalStoreHttpRequestApi";
import GlobalStoreContext from "../../store/store";
import AuthContext from "../../auth/AuthContextProvider";

const HomeScreen = (props) => {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  useEffect(() => {
    const getData = async () => {
      const allMaps = await getAllMaps();
      store.setDisplayedMaps(allMaps.data.data);
    };
    console.log(auth.user);

    getData().catch(console.error);
  }, []);

  return (
    <div
      style={{
        paddingTop: "30px",
        justifyContent: "center",
      }}
    >
      <Carousel
        sx={{
          textAlign: "center",
        }}
        navButtonsWrapperProps={{
          style: {
            minWidth: "28%",
          },
        }}
      >
        {store.displayedMaps.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </Carousel>
      <MapGrid mapData={store.displayedMaps} type={MapGridType.BROWSE} />
    </div>
  );
};

const Item = (props) => {
  return (
    <Paper
      elevation={3}
      sx={{
        textAlign: "center",
        maxWidth: "80%",
        marginLeft: "10%",
      }}
    >
      <img
        style={{
          minHeight: "350px",
          maxHeight: "350px",
        }}
        src={props.item.imgPath}
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
