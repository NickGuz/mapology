import React, { useState } from 'react';
import MapGrid from './MapGrid';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import TagsInput from './TagsInput';

const SortByValue = {
    FEATURED: "FEATURED",
    TOP_RATED: "TOP_RATED",
    RECENTLY_UPDATED: "RECENTLY_UPDATED"
}

const MapListingScreen = (props) => {
    const [sortBy, setSortBy] = useState('')

    const handleSortByChange = (event) => {
        setSortBy(event.target.value);
    }

    return (
        <div style={{ paddingTop: '100px' }}>
            <Grid container spacing={2} style={{ paddingLeft: '20%' }}>
                <Grid item xs={2}>

                    <FormControl fullWidth>
                        <InputLabel id="sort-by-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-by-label"
                            id="sort-by-select"
                            value={sortBy}
                            label="Sort By"
                            onChange={handleSortByChange}
                        >
                            <MenuItem value={SortByValue.FEATURED}>Featured</MenuItem>
                            <MenuItem value={SortByValue.TOP_RATED}>Top Rated</MenuItem>
                            <MenuItem value={SortByValue.RECENTLY_UPDATED}>Recently Updated</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={2}>
                    <TagsInput />
                </Grid>
            </Grid>
            
            <MapGrid mapData={mapData} />
        </div>
    )
}

const mapData = [
    {
        title: "Italy",
        description: "A map of Italy",
        imgPath: ""
    },
    {
        title: "Germany",
        description: "A map of Germany",
        imgPath: ""
    },
    {
        title: "USA",
        description: "A map of the USA",
        imgPath: ""
    },
    {
        title: "China",
        description: "A map of China",
        imgPath: ""
    },
    {
        title: "Japan",
        description: "A map of Japan",
        imgPath: ""
    },
    {
        title: "Russia",
        description: "A map of Russia",
        imgPath: ""
    },
]

export default MapListingScreen;