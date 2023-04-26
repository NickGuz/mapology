import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { BlockPicker } from "react-color";
import Slider from "@mui/material/Slider";
import GlobalStoreContext from "../../store/store";
import * as RequestApi from "../../store/GlobalStoreHttpRequestApi";

const RegionEditor = () => {
  const [value, setValue] = React.useState(50);

  const { store } = useContext(GlobalStoreContext);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  // Called when color changed
  const handleChangeComplete = (event) => {
    if (store.selectedFeatures.length <= 0) {
      return;
    }

    // Set fillColor property in each feature.properties and update backend
    store.selectedFeatures.forEach((feature) => {
      feature.properties["fillColor"] = event.hex;
      RequestApi.updateFeatureProperties(feature.id, feature.properties);
    });

    // Empty selectedFeatures after the change
    store.setSelectedFeatures([]);
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
        <BlockPicker onChangeComplete={handleChangeComplete} />
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
