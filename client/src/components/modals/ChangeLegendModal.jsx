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

const ChangeLegendModal = (props) => {
  const [name, setName] = useState(props.name);

  function handleChangeName(event) {
    if (name !== "") {
      props.rename(props.color, name);
      setName("");
    }

    props.close();
  }
  function changeName(event) {
    setName(event.target.value);
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Rename Legend Label
          </Typography>
          <input id="name-textfield" type="text" defaultValue={name} onChange={changeName} />
          <Box id="confirm-cancel-container">
            <Button id="change-name-button" className="modal-button" onClick={handleChangeName}>
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

export default ChangeLegendModal;
