import React, { useContext, useState, useEffect, Fragment } from "react";
import { Grid, Box, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import GlobalStoreContext from "../../store/store";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    maxHeight: "30vh", // set max height to 90% of viewport height
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
};

const PropertiesModal = (props) => {
    const { store } = useContext(GlobalStoreContext);
    const [properties, setProperties] = useState(
        store.selectedFeatures[0]?.properties || {}
    );


    useEffect(() => {
        // Update properties every time store.selectedFeatures changes
        setProperties(store.selectedFeatures[0]?.properties || {});

        // Reset newProperty to an empty string when modal is opened
        setProperties((prevProperties) => ({
            ...prevProperties,
            newProperty: "",
        }));
    }, [store.selectedFeatures]);


   function handlePropertyChange(key, value) {
       // Check if "key" is "newProperty" and the "Enter" key was pressed
       if (key === "newProperty" && event.keyCode === 13) {
           // If so, add a new property with an empty value
           const { newProperty, ...rest } = properties; // Remove the newProperty key
           if (!Object.keys(rest).includes(value)) {
               setProperties({
                   ...rest,
                   [value]: "",
               });
           }
       } else {
           // Otherwise, update the existing property value
           setProperties((prevProperties) => ({
               ...prevProperties,
               [key]: value,
           }));
       }
    }

    function handleConfirm() {
        if (store.selectedFeatures.length !== 1) {
            window.alert(
                "Cannot edit properties of more than 1 region at a time"
            );
            return;
        }
        if (Object.keys(properties).length > 0) {
            props.addProperties(
                store.selectedFeatures[0],
                properties,
                props.layer
            );
        } else {
            props.updateProperties(
                store.selectedFeatures[0],
                properties,
                props.layer
            );
        }
        props.close();
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
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            Edit Properties
                        </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        {store.selectedFeatures.length > 0 ? (
                            <div>
                                <Grid container spacing={2}>
                                    {Object.keys(properties)
                                        .filter((key) => key !== "newProperty")
                                        .map((key) => (
                                            <Fragment key={key}>
                                                <Grid item xs={4}>
                                                    <Typography>
                                                        {key}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={
                                                            key ===
                                                            "newProperty"
                                                                ? ""
                                                                : properties[
                                                                      key
                                                                  ]
                                                        }
                                                        onChange={(e) =>
                                                            handlePropertyChange(
                                                                key,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </Grid>
                                            </Fragment>
                                        ))}
                                    <Grid item xs={4}>
                                        <Typography>New Property</Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={
                                                properties.newProperty ===
                                                    undefined ||
                                                properties.newProperty === null
                                                    ? ""
                                                    : properties.newProperty
                                            }
                                            onChange={(e) =>
                                                handlePropertyChange(
                                                    "newProperty",
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                    handlePropertyChange(
                                                        "newProperty",
                                                        e.target.value
                                                    );
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        ) : (
                            <div>No selected feature</div>
                        )}
                    </Box>

                    <Box id="confirm-cancel-container">
                        <Button
                            id="change-name-button"
                            className="modal-button"
                            onClick={handleConfirm}
                        >
                            Confirm
                        </Button>
                        <Button
                            id="cancel-button"
                            className="modal-button"
                            onClick={props.close}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default PropertiesModal;
