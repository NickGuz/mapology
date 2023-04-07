import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const TagsInput = (props) => {
    return (
        <Autocomplete
            sx={props.sx}
            multiple
            id="tags-outlined"
            options={data}
            getOptionLabel={(option) => option.text}
            defaultValue={[]}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Tags"
                    placeholder=""
                />
            )}
        />
    );
}

const data = [
    { id: 1, text: 'fantasy' },
    { id: 2, text: 'historic' },
    { id: 3, text: 'modern'}
];

export default TagsInput;
