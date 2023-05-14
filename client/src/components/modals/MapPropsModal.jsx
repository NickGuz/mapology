import React, { useContext, useState, useEffect } from 'react';
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

const MapPropertiesModal = (props) => {
  const { store } = useContext(GlobalStoreContext);
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [properties, setProperties] = useState({});

  function handleConfirm() {
    // Update the map properties
    props.updateMapProperties(store.currentMap.mapInfo.id, properties);
    console.log(store.currentMap.mapInfo.properties);
    // Close the modal
    props.close();
  }

  useEffect(() => {
    if (store.currentMap.mapInfo.properties !== properties) {
      store.currentMap.mapInfo.properties = properties;
    }
  }, [properties, store.currentMap.mapInfo.properties]);

  function handleAddKeyValuePair() {
    // Check if both key and value are non-empty
    if (keyInput && valueInput) {
      setProperties((prevProperties) => ({
        ...prevProperties,
        [keyInput]: valueInput,
      }));

      // Clear the input fields
      setKeyInput('');
      setValueInput('');
    }
  }


  return (
    <div>
      <Modal
        open={props.show}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="h6" component="h2">
              Edit Properties
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {Object.entries(properties || {}).map(([key, value]) => (
                <React.Fragment key={key}>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="Key"
                      value={key}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="Value"
                      value={value}
                      disabled
                    />
                  </Grid>
                </React.Fragment>
              ))}
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  label="New Key"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  label="New Value"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={handleAddKeyValuePair}>
                  Add Key-Value Pair
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box id="confirm-cancel-container">
            <Button
              id="change-name-button"
              className="modal-button"
              onClick={handleConfirm}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default MapPropertiesModal;
