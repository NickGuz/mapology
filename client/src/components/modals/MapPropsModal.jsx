import React, { useContext, useState, useEffect } from 'react';
import { Grid, Box, TextField, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [propertyList, setPropertyList] = useState(
    Object.entries(store.currentMap.mapInfo.properties || {}).map(
      ([key, value]) => ({
        key,
        value,
      })
    )
  );

  function handleConfirm() {
    const updatedProperties = propertyList.reduce((result, property) => {
      result[property.key] = property.value;
      return result;
    }, {});
    props.updateMapProperties(store.currentMap.mapInfo, updatedProperties);
    // Close the modal
    props.close();
  }

  useEffect(() => {
    setPropertyList(
      Object.entries(store.currentMap.mapInfo.properties || {}).map(
        ([key, value]) => ({
          key,
          value,
        })
      )
    );
  }, [store.currentMap.mapInfo.properties]);

  function handleAddKeyValuePair() {
    // Check if both key and value are non-empty
    if (keyInput && valueInput) {
      setPropertyList((prevPropertyList) => [
        ...prevPropertyList,
        {
          key: keyInput,
          value: valueInput,
        },
      ]);

      // Clear the input fields
      setKeyInput('');
      setValueInput('');
    }
  }

  function handleKeyChange(index, newKey) {
    setPropertyList((prevPropertyList) => {
      const updatedPropertyList = [...prevPropertyList];
      updatedPropertyList[index].key = newKey;
      return updatedPropertyList;
    });
  }

  function handleValueChange(index, newValue) {
    setPropertyList((prevPropertyList) => {
      const updatedPropertyList = [...prevPropertyList];
      updatedPropertyList[index].value = newValue;
      return updatedPropertyList;
    });
  }

  function handleDeleteProperty(index) {
    setPropertyList((prevPropertyList) => {
      const updatedPropertyList = [...prevPropertyList];
      updatedPropertyList.splice(index, 1);
      return updatedPropertyList;
    });
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
              {propertyList.map((property, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={5}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="Key"
                      value={property.key}
                      onChange={(e) => handleKeyChange(index, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="Value"
                      value={property.value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => handleDeleteProperty(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
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
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default MapPropertiesModal;

