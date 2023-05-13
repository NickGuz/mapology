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
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CompressModal = (props) => {

  function handleCompress(event) {
      props.confirm();
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
        <Box sx={style} display={"flex"} flexDirection={"column"}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color={"red"}>
            Warning!
          </Typography>
          <Typography variant = "p2" >
            This will permanently compress the map to size small. We recomend downloading the map file and reuploading with different size option. 
          </Typography>
          <Box id="confirm-cancel-container" sx={{alignSelf: "flex-end"}}>
            <Button id="change-name-button" className="modal-button" onClick={handleCompress}>
              Confirm
            </Button>
            <Button id="cancel-button" className="modal-button" onClick={props.close}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CompressModal;
