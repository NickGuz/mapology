import React, { useState } from "react";
import MapGrid, { MapGridType } from "../util/MapGrid";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import TagsInput from "../util/TagsInput";
import mapData from "../../map-data";

const SortByValue = {
  FEATURED: "FEATURED",
  TOP_RATED: "TOP_RATED",
  RECENTLY_UPDATED: "RECENTLY_UPDATED",
};

const MapListingScreen = (props) => {
  const [sortBy, setSortBy] = useState("");

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div style={{ paddingTop: "100px" }}>
      <Grid container spacing={2} style={{ paddingLeft: "10%" }}>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by-select"
              value={sortBy}
              label="Sort By"
              onChange={handleSortByChange}
              sx={{ maxWidth: "300px" }}
            >
              <MenuItem value={SortByValue.FEATURED}>Featured</MenuItem>
              <MenuItem value={SortByValue.TOP_RATED}>Top Rated</MenuItem>
              <MenuItem value={SortByValue.RECENTLY_UPDATED}>Recently Updated</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <TagsInput sx={{ maxWidth: "300px" }} />
        </Grid>
      </Grid>

      <MapGrid mapData={mapData} type={MapGridType.BROWSE} />
    </div>
  );
};

export default MapListingScreen;
