import React, { useContext, useState, useEffect } from 'react';
import MapGrid, { MapGridType } from '../util/MapGrid';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import TagsInput from '../util/TagsInput';
import GlobalStoreContext, { SearchByValue } from '../../store/store';
import * as RequestApi from '../../store/GlobalStoreHttpRequestApi';
import UserList from '../util/UserList';
import { searchUsers } from '../../auth/auth-request-api/AuthRequestApi';
import AuthContext from '../../auth/AuthContextProvider';

export const SortByValue = {
  RELEVANCE: 'RELEVANCE',
  // FEATURED: "FEATURED",
  TOP_RATED: 'TOP_RATED',
  RECENTLY_UPDATED: 'RECENTLY_UPDATED',
};

const MapListingScreen = () => {
  const [sortBy, setSortBy] = useState(SortByValue.RELEVANCE);
  // const [searchBy, setSearchBy] = useState(SearchByValue.MAP);
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchMapSearchData = async () => {
      const res = await RequestApi.searchMaps(
        store.searchTerm,
        store.searchTags,
        sortBy
      );
      console.log('displayedMaps', res.data);
      store.setDisplayedMaps(res.data);
    };

    const fetchUserSearchData = async () => {
      if (!store.searchTerm) {
        auth.setDisplayedUsers([]);
        return;
      }
      const res = await searchUsers(store.searchTerm);
      auth.setDisplayedUsers(res.data);
    };

    if (store.searchByValue === SearchByValue.MAP) {
      fetchMapSearchData();
    } else {
      fetchUserSearchData();
    }
  }, [store.searchByValue, store.searchTerm, store.searchTags]);

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchByChange = (event) => {
    store.setSearchByValue(event.target.value);
  };

  return (
    <div style={{ paddingTop: '100px', marginLeft: '10%', marginRight: '10%' }}>
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
              sx={{ maxWidth: '300px' }}
            >
              <MenuItem value={SortByValue.RELEVANCE}>Relevance</MenuItem>
              {/* <MenuItem value={SortByValue.FEATURED}>Featured</MenuItem> */}
              <MenuItem value={SortByValue.TOP_RATED}>Top Rated</MenuItem>
              <MenuItem value={SortByValue.RECENTLY_UPDATED}>
                Recently Updated
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <TagsInput sx={{ maxWidth: '300px' }} />
        </Grid>

        <Grid item xs={6}></Grid>

        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="search-by-label">Search By</InputLabel>
            <Select
              labelId="search-by-label"
              id="search-by-select"
              value={store.searchByValue}
              label="Search By"
              onChange={handleSearchByChange}
              sx={{ maxWidth: '300px' }}
            >
              <MenuItem value={SearchByValue.MAP}>Map</MenuItem>
              <MenuItem value={SearchByValue.USER}>User</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {store.searchByValue === SearchByValue.MAP ? (
        <MapGrid mapData={store.displayedMaps} type={MapGridType.BROWSE} />
      ) : (
        <UserList />
      )}
    </div>
  );
};

export default MapListingScreen;
