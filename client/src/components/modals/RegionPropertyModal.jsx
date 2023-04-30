import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
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

    // console.log("store.selectedFeatures", store.selectedFeatures);
    console.log("properties", properties);

    function handlePropertyChange(key, value) {
        setProperties((prevProperties) => ({
            ...prevProperties,
            [key]: value,
        }));
    }

    // console.log("Object.entries(properties)", Object.entries(properties));

    // need to create updateProperties function in MapEditor

    function handleConfirm() {
        if (store.selectedFeatures.length !== 1) {
            window.alert(
                "Cannot edit properties of more than 1 region at a time"
            );
            return;
        }
        props.updateProperties(
            store.selectedFeatures[0],
            properties,
            props.layer
        );
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
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Edit Properties
                    </Typography>
                    {store.selectedFeatures.length > 0 ? (
                        <div>
                            {Object.entries(properties).map(([key, value]) => (
                                <div key={key}>
                                    <label htmlFor={key}>{key}</label>
                                    <input
                                        type="text"
                                        id={key}
                                        value={value}
                                        onChange={(e) =>
                                            handlePropertyChange(
                                                key,
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>No selected feature</div>
                    )}

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
