import { useContext } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import GlobalStoreContext from "../../store/store";
import SketchColorPicker from "../util/SketchColorPicker";
import { useState } from 'react';
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AuthContext from '../../auth/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

const SettingsModal = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [changeOpen, setchangeOpen] = useState(false);
  const [username, setUsername] = useState('');

  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClose = () => {
    store.setOpenSettingsModal(false);
  };

  const handleColorPickerChange = () => {};

  const handleDeleteAccount = () => {
    auth.deleteUser(auth.user.email);
    auth.logoutUser();
    navigate('/');
    handleClose()
    setDeleteOpen(false)
  };

  const handleChangeUsername = (username) => {
    auth.changeUsername(username, auth.user.email);
    setUsername('')
    setchangeOpen(false)
  };

  return (
    <Dialog onClose={handleClose} open={store.settingsModalOpen} fullWidth maxWidth="sm">
      <DialogTitle>Settings</DialogTitle>
      <List
        sx={{
          pr: 0,
        }}
      >
        <ListItem divider>
          <SentimentSatisfiedAltIcon />
          <ListItemText>Profile</ListItemText>
        </ListItem>

        <ListItem>
          <ListItemText>Banner Here</ListItemText>
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <Button sx={{ ml: "30%" }}>Edit Bio</Button>
        </ListItem>

        <ListItem>
          <ListItemText>Color Theme</ListItemText>
          <SketchColorPicker />
        </ListItem>

        <ListItem divider>
          <AccountBoxIcon />
          <ListItemText>Account Information</ListItemText>
        </ListItem>

        <ListItem>
          <Button onClick={()=> {setchangeOpen(true)}}>Change Username</Button>
        </ListItem>

        <ListItem>
          <Button variant="outlined" color="error" onClick={()=> {setDeleteOpen(true)}}>Delete Account</Button>
        </ListItem>

        <Dialog open={changeOpen} onClose={()=> {setchangeOpen(false)}}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your new username for your account.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="New Username"
            type="username"
            fullWidth
            variant="standard"
            onChange={(e) => setUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> {setchangeOpen(false)}}>Cancel</Button>
          <Button onClick={() => handleChangeUsername(username)}>Change Username</Button>
        </DialogActions>
      </Dialog>



      <Dialog open={deleteOpen} onClose={()=> {setDeleteOpen(false)}}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to PERMANENTLY your account?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=> {setDeleteOpen(false)}}>Cancel</Button>
        <Button id="confirm-delete-btn" onClick={()=> {handleDeleteAccount()}} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>

    </List>
  </Dialog>
  );
};

export default SettingsModal;
