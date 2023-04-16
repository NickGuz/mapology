import { useContext } from "react";
import { Dialog, DialogTitle, List, ListItem } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import GlobalStoreContext from "../store/store";

const SettingsModal = () => {
  const { store } = useContext(GlobalStoreContext);

  const handleClose = () => {
    store.setOpenSettingsModal(false);
  };

  return (
    <Dialog onClose={handleClose} open={store.settingsModalOpen}>
      <DialogTitle>Settings</DialogTitle>
      <List sx={{ pr: 0 }}>
        <ListItem disableGutters>
          <ListItemText>Profile</ListItemText>
        </ListItem>
      </List>
    </Dialog>
  );
};

export default SettingsModal;
