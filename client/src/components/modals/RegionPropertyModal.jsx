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
  maxHeight: '60vh', // set max height to 90% of viewport height
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

  const [editedProperties, setEditedProperties] = useState([]);
  const [newKeyValuePair, setNewKeyValuePair] = useState({
    key: '',
    value: '',
  });

  useEffect(() => {
    const propertiesArray = Object.entries(properties).map(([key, value]) => ({
      key,
      value,
    }));

    // Only update the state if the properties have changed
    if (!arraysEqual(editedProperties, propertiesArray)) {
      setEditedProperties(propertiesArray);
    }
  }, [selectedFeature, properties]);

  function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].key !== arr2[i].key || arr1[i].value !== arr2[i].value) {
        return false;
      }
    }
    return true;
  }

  const handleConfirm = () => {
    if (store.selectedFeatures.length !== 1) {
      window.alert('Cannot edit properties of more than 1 region at a time');
      return;
    }
    const updatedProperties = editedProperties.reduce((obj, { key, value }) => {
      obj[key] = value;
      return obj;
    }, {});
    props.updateProperties(selectedFeature, updatedProperties);
    setNewKeyValuePair({ key: '', value: '' });
    props.close();
  };

  const handleKeyChange = (event, index) => {
    const newKey = event.target.value;
    setEditedProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties[index] = { ...updatedProperties[index], key: newKey };
      return updatedProperties;
    });
  };

  const handleValueChange = (event, index) => {
    const newValue = event.target.value;
    setEditedProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties[index] = {
        ...updatedProperties[index],
        value: newValue,
      };
      return updatedProperties;
    });
  };

  const handleAddKeyValuePair = () => {
    if (newKeyValuePair.key !== '' && newKeyValuePair.value !== '') {
      setEditedProperties((prevProperties) => [
        ...prevProperties,
        { ...newKeyValuePair },
      ]);
      setNewKeyValuePair({ key: '', value: '' });
    }
  };

  const handleDeleteKeyValuePair = (index) => {
    setEditedProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties.splice(index, 1);
      return updatedProperties;
    });
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
                  {editedProperties.map((property, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={5}>
                        <TextField
                          key={`key-${index}`}
                          variant="outlined"
                          size="small"
                          fullWidth
                          label="Key"
                          value={property.key}
                          onChange={(event) => handleKeyChange(event, index)}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          key={`value-${index}`}
                          variant="outlined"
                          size="small"
                          fullWidth
                          label="Value"
                          value={property.value}
                          onChange={(event) => handleValueChange(event, index)}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <DeleteIcon
                          onClick={() => handleDeleteKeyValuePair(index)}
                          sx={{ cursor: 'pointer' }}
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                  <Grid item xs={5}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="New Key"
                      value={newKeyValuePair.key || ''}
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
                      value={newKeyValuePair.value || ''}
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
              color="error"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default PropertiesModal;

