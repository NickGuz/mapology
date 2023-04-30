import React, { useContext, useState, useEffect } from "react";
import MapGrid, { MapGridType } from "../util/MapGrid";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import TagsInput from "../util/TagsInput";
import GlobalStoreContext from "../../store/store";
import * as RequestApi from "../../store/GlobalStoreHttpRequestApi";

export const SortByValue = {
  RELEVANCE: "RELEVANCE",
  // FEATURED: "FEATURED",
  TOP_RATED: "TOP_RATED",
  RECENTLY_UPDATED: "RECENTLY_UPDATED",
};

const SearchByValue = {
  MAP: "MAP",
  USER: "USER",
};

const MapListingScreen = (props) => {
  const [sortBy, setSortBy] = useState(SortByValue.RELEVANCE);
  const [searchBy, setSearchBy] = useState(SearchByValue.MAP);
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    const fetchSearchData = async () => {
      const res = await RequestApi.searchMaps(store.searchTerm, store.searchTags, sortBy);
      store.setDisplayedMaps(res.data);
    };

    // const fetchBrowseData = async () => {
    //   const res = await RequestApi.getAllMaps();
    //   store.setDisplayedMaps(res.data.data);
    // };

    console.log("search term in useeffect", store.searchTerm);
    fetchSearchData();
  }, [store.searchTerm, store.searchTags]);

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
  };

  return (
    <div style={{ paddingTop: "100px", marginLeft: "10%", marginRight: "10%" }}>
      <Grid container spacing={2}>
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
              <MenuItem value={SortByValue.RELEVANCE}>Relevance</MenuItem>
              {/* <MenuItem value={SortByValue.FEATURED}>Featured</MenuItem> */}
              <MenuItem value={SortByValue.TOP_RATED}>Top Rated</MenuItem>
              <MenuItem value={SortByValue.RECENTLY_UPDATED}>Recently Updated</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <TagsInput sx={{ maxWidth: "300px" }} />
        </Grid>

        <Grid item xs={6}></Grid>

        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="search-by-label">Search By</InputLabel>
            <Select
              labelId="search-by-label"
              id="search-by-select"
              value={searchBy}
              label="Search By"
              onChange={handleSearchByChange}
              sx={{ maxWidth: "300px" }}
            >
              <MenuItem value={SearchByValue.MAP}>Map</MenuItem>
              <MenuItem value={SearchByValue.USER}>User</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <MapGrid mapData={store.displayedMaps} type={MapGridType.BROWSE} />
    </div>
  );
};

export default MapListingScreen;
