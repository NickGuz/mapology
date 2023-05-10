import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { BlockPicker } from "react-color";
import Slider from "@mui/material/Slider";
import GlobalStoreContext from "../../store/store";
import * as RequestApi from "../../store/GlobalStoreHttpRequestApi";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Button } from "@mui/material";
import reactCSS from "reactcss";
import Popover from "@mui/material/Popover";

const RegionEditor = (props) => {
  const [value, setValue] = useState(50);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [fillColorActive, setFillColorActive] = useState(null);
  const [borderColorActive, setBorderColorActive] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [color, setColor] = useState("#6e6eee");

  const { store } = useContext(GlobalStoreContext);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  // Called when color changed
  const handleChangeComplete = (event) => {
    setColor(event.hex);
    if (store.selectedFeatures.length <= 0) {
      return;
    }
    let oldColor
    // Set fillColor property in each feature.properties and update backend
    store.selectedFeatures.forEach((feature) => {
      oldColor = feature.properties['fillColor']
      if (fillColorActive) {
        feature.properties["fillColor"] = event.hex;
      } else {
        feature.properties["borderColor"] = event.hex;
      }
      RequestApi.updateFeatureProperties(feature.id, feature.properties);
    });
    if(fillColorActive){
      RequestApi.upsertLegend(props.mapId, event.hex, event.hex)

      //update store
      const temp = store.currentLegend;
      delete temp[oldColor];
  
      store.setCurrentLegend({
        temp
      });
    }

    // Empty selectedFeatures after the change
    store.setSelectedFeatures([]);
    handleClose();
    console.log(store.currentLegend)
  };

  const handleFillColorClick = (event) => {
    setAnchorEl(event.currentTarget);
    setFillColorActive(true);
  };

  const handleBorderColorClick = (event) => {
    setAnchorEl(event.currentTarget);
    setBorderColorActive(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setFillColorActive(false);
    setBorderColorActive(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box>
      <p
        id="text-header"
        style={{
          paddingTop: "0px",
          color: "dimgray",
          fontSize: "120%",
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "darkgray",
          backgroundColor: "silver",
        }}
      >
        Color
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={handleFillColorClick}>
          <FormatColorFillIcon />
        </Button>
        <Button onClick={handleBorderColorClick}>
          <BorderColorIcon />
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <BlockPicker color={color} onChangeComplete={handleChangeComplete} />
        </Popover>
      </div>
      <p
        id="text-header"
        style={{
          paddingTop: "0px",
          color: "dimgray",
          fontSize: "120%",
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "darkgray",
          backgroundColor: "silver",
        }}
      >
        Opacity
      </p>
      <Grid item xs sx={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 200, marginRight: 20 }}>
          <Slider value={value} onChange={handleSliderChange} aria-label="opacity slider" />
        </div>
        <div>{value}</div>
      </Grid>
    </Box>
  );
};

export default RegionEditor;
