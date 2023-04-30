import React, { useContext, useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import Chip from "@mui/material/Chip";
import GlobalStoreContext from "../../store/store";
import { getAllTags } from "../../store/GlobalStoreHttpRequestApi";

const TagsInput = (props) => {
  const [data, setData] = useState([]);
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    const fetchTags = async () => {
      const res = await getAllTags();
      console.log(res);
      if (res.data) {
        setData(res.data);
      }
    };

    fetchTags();
  }, []);

  const handleChange = (event, value) => {
    console.log(value);
    store.setSearchTags(value);
  };

  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={data.map((option) => option.tagName)}
      onChange={props.onChange || handleChange}
      defaultValue={[]}
      // freeSolo={props.freeSolo}
      freeSolo
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => <TextField {...params} label="Tags" placeholder="" />}
    />
  );
};

// const data = [
//   { id: 1, text: "fantasy" },
//   { id: 2, text: "historic" },
//   { id: 3, text: "modern" },
// ];

export default TagsInput;
