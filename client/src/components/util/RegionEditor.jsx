import React from 'react'
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { BlockPicker } from "react-color";
import Slider from "@mui/material/Slider";

const RegionEditor = () => {

    const [value, setValue] = React.useState(50);

    const handleSliderChange = (event, newValue) => {
      setValue(newValue);
    };

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
        <BlockPicker />
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
          <Slider
            value={value}
            onChange={handleSliderChange}
            aria-label="opacity slider"
          />
        </div>
        <div>{value}</div>
      </Grid>
    </Box>
  );
}

export default RegionEditor


