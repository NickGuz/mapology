import React, { useContext, useState } from 'react';
import { Grid, Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import GlobalStoreContext from '../../store/store';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '30vh', // set max height to 90% of viewport height
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

const MapPropertyModal = (props) => {
  const { store } = useContext(GlobalStoreContext);
  const [newProperty, setNewProperty] = useState({ key: '', value: '' });

  const handleFormSubmit = (event) => {
    console.log(store.currentMap.mapInfo)
    console.log(store.currentMap.mapInfo.title)
    event.preventDefault();
    const { key, value } = newProperty;
    const features = store.currentMap.json.features.map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        [key]: value,
      },
    }));
    console.log(features)
    // props.onAddProperty(features);
    // props.onClose();
  };

  return (
    <div>
      <Modal
        open={props.show}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" mb={2}>
            Add a Property
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              required
              fullWidth
              label="Property Key"
              margin="normal"
              value={newProperty.key}
              onChange={(event) =>
                setNewProperty({
                  ...newProperty,
                  key: event.target.value,
                })
              }
            />
            <TextField
              required
              fullWidth
              label="Property Value"
              margin="normal"
              value={newProperty.value}
              onChange={(event) =>
                setNewProperty({
                  ...newProperty,
                  value: event.target.value,
                })
              }
            />
            <Box mt={2}>
              <Button variant="contained" color="primary" type="submit">
                Add Property
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default MapPropertyModal;
