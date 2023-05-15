import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {
  FormatColorText,
  FormatBold,
  FormatUnderlined,
  FormatItalic,
  FormatStrikethrough,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  VerticalAlignTop,
  VerticalAlignBottom,
  VerticalAlignCenter,
  AddBox,
} from '@mui/icons-material/';
import { IconButton } from '@mui/material';

const TextEditor = () => {
  const [font, setFont] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [size, setSize] = React.useState('');

  const handleChangeFont = (event) => {
    setFont(event.target.value);
  };
  const handleChangeWeight = (event) => {
    setWeight(event.target.value);
  };
  const handleChangeSize = (event) => {
    setSize(event.target.value);
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        alignItems: 'center',
      }}
    >
      <p
        id="text-header"
        style={{
          paddingTop: '0px',
          color: 'dimgray',
          fontSize: '120%',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'darkgray',
          backgroundColor: 'silver',
        }}
      >
        Text
      </p>
      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <FormControl sx={{ m: 1, minWidth: 120, display: 'flex' }} size="small">
          <InputLabel id="font">Font</InputLabel>
          <Select
            labelId="font"
            id="font-select"
            value={font}
            label="Font"
            onChange={handleChangeFont}
          >
            <MenuItem value={'Arial'}>Arial</MenuItem>
            <MenuItem value={'Times New Roman'}>Times New Roman</MenuItem>
            <MenuItem value={'Roboto'}>Roboto</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120, display: 'flex' }} size="small">
          <InputLabel id="weight">Weight</InputLabel>
          <Select
            labelId="weight"
            id="weight-select"
            value={weight}
            label="Weight"
            onChange={handleChangeWeight}
          >
            <MenuItem value={'Regular'}>Regular</MenuItem>
            <MenuItem value={'Bold'}>Bold</MenuItem>
            <MenuItem value={'Italic'}>Italic</MenuItem>
          </Select>
        </FormControl>
      </div> */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton>
          <FormatColorText />
        </IconButton>
        <FormControl sx={{ m: 1, minWidth: 120, display: 'flex' }} size="small">
          <InputLabel id="size">Font Size</InputLabel>
          <Select
            labelId="size"
            id="size-select"
            value={size}
            label="Size"
            onChange={handleChangeSize}
          >
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={14}>14</MenuItem>
            <MenuItem value={16}>16</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton>
            <FormatBold />
          </IconButton>
          <IconButton>
            <FormatUnderlined />
          </IconButton>
          <IconButton>
            <FormatItalic />
          </IconButton>
          <IconButton>
            <FormatStrikethrough />
          </IconButton>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton>
            <FormatAlignLeft />
          </IconButton>
          <IconButton>
            <FormatAlignCenter />
          </IconButton>
          <IconButton>
            <FormatAlignRight />
          </IconButton>
          <IconButton>
            <FormatAlignJustify />
          </IconButton>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton>
            <AddBox />
          </IconButton>
          <IconButton>
            <VerticalAlignTop />
          </IconButton>
          <IconButton>
            <VerticalAlignCenter />
          </IconButton>
          <IconButton>
            <VerticalAlignBottom />
          </IconButton>
        </div>
      </div>
    </Box>
  );
};

export default TextEditor;
