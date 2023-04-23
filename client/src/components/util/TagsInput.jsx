import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import Chip from "@mui/material/Chip";

const TagsInput = (props) => {
    return (
        <Autocomplete
            multiple
            id="tags-filled"
            options={data.map((option) => option.text)}
            onChange={props.onChange}
            defaultValue={[]}
            freeSolo={props.freeSolo}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
            }
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
