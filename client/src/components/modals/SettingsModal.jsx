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
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import GlobalStoreContext from "../../store/store";
import SketchColorPicker from "../util/SketchColorPicker";

import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const SettingsModal = () => {
  const { store } = useContext(GlobalStoreContext);

  const handleClose = () => {
    store.setOpenSettingsModal(false);
  };

  const handleColorPickerChange = () => {};

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
          <Button>Change Username</Button>
        </ListItem>

        <ListItem>
          <Button>Change Password</Button>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default SettingsModal;
