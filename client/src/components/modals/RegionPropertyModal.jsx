import React, { useContext, useState, useEffect } from 'react';
import { Grid, Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import GlobalStoreContext from '../../store/store';
import DeleteIcon from '@mui/icons-material/Delete';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '30vh', // set max height to 90% of viewport height
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

const PropertiesModal = (props) => {
  const { store } = useContext(GlobalStoreContext);
  const selectedFeature = store.selectedFeatures[0];
  const properties = selectedFeature?.properties || {};

  const [editedProperties, setEditedProperties] = useState(properties);
  const [newKeyValuePair, setNewKeyValuePair] = useState({
    key: '',
    value: '',
  });

  useEffect(() => {
    setEditedProperties(properties);
  }, [properties]);

  const handleConfirm = () => {
    if (store.selectedFeatures.length !== 1) {
      window.alert('Cannot edit properties of more than 1 region at a time');
      return;
    }
    props.updateProperties(selectedFeature, editedProperties);
    props.close();
  };

   const handleKeyChange = (event, key) => {
     const newKey = event.target.value;
     const updatedProperties = { ...editedProperties };
     if (newKey !== key) {
       updatedProperties[newKey] = updatedProperties[key];
       delete updatedProperties[key];
     }
     setEditedProperties(updatedProperties);
   };

  const handleValueChange = (event, key) => {
    const newValue = event.target.value;
    const updatedProperties = { ...editedProperties, [key]: newValue };
    setEditedProperties(updatedProperties);
  };

  const handleAddKeyValuePair = () => {
    if (newKeyValuePair.key !== '' && newKeyValuePair.value !== '') {
      const updatedProperties = {
        ...editedProperties,
        [newKeyValuePair.key]: newKeyValuePair.value,
      };
      setEditedProperties(updatedProperties);
      setNewKeyValuePair({ key: '', value: '' });
    }
  };

  const handleDeleteKeyValuePair = (key) => {
    const updatedProperties = { ...editedProperties };
    delete updatedProperties[key];
    setEditedProperties(updatedProperties);
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
            {selectedFeature ? (
              <div>
                <Grid container spacing={2}>
                  {Object.entries(editedProperties).map(
                    ([key, value], index) => (
                      <React.Fragment key={`${key}-${index}`}>
                        <Grid item xs={5}>
                          <TextField
                            key={`key-${key}-${index}`}
                            variant="outlined"
                            size="small"
                            fullWidth
                            label="Key"
                            name={key}
                            value={key}
                            onChange={(event) => handleKeyChange(event, key)}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            key={`value-${key}-${index}`}
                            variant="outlined"
                            size="small"
                            fullWidth
                            label="Value"
                            name={key}
                            value={value}
                            onChange={(event) => handleValueChange(event, key)}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={1}
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          <DeleteIcon
                            onClick={() => handleDeleteKeyValuePair(key)}
                            sx={{ cursor: 'pointer' }}
                          />
                        </Grid>
                      </React.Fragment>
                    )
                  )}
                  <Grid item xs={5}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="New Key"
                      value={newKeyValuePair.key}
                      onChange={(event) =>
                        setNewKeyValuePair({
                          ...newKeyValuePair,
                          key: event.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="New Value"
                      value={newKeyValuePair.value}
                      onChange={(event) =>
                        setNewKeyValuePair({
                          ...newKeyValuePair,
                          value: event.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" onClick={handleAddKeyValuePair}>
                      Add Key-Value Pair
                    </Button>
                  </Grid>
                </Grid>
              </div>
            ) : null}
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

export default PropertiesModal;

