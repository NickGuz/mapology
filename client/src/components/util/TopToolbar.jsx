import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as RequestApi from "../../store/GlobalStoreHttpRequestApi";
import GlobalStoreContext from "../../store/store";
import AuthContext from "../../auth/AuthContextProvider";

const TopToolbar = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  const handleOpenDownload = (event) => {
    setAnchorEl(event.target);
  };

  const handleCloseDownload = (event) => {
    setAnchorEl(null);
  };

  const handleGeoJSONDownload = () => {
    RequestApi.downloadMapAsGeoJSON(
      store.currentMap.mapInfo.id,
      `${store.currentMap.mapInfo.title.replace("/", "_")}.geo.json`
    );
    setAnchorEl(null);
  };

  const handleShapefileDownload = () => {
    RequestApi.downloadMapAsShapefile(
      store.currentMap.mapInfo.id,
      `${store.currentMap.mapInfo.title.replace("/", "_")}_shp.zip`
    );
    setAnchorEl(null);
  };

  return (
    <Box>
      {auth.loggedIn && (
        <>
          <IconButton>
            <UndoIcon />
          </IconButton>
          <IconButton>
            <RedoIcon />
          </IconButton>
        </>
      )}
      <IconButton>
        <ContentCopyIcon />
      </IconButton>
      {auth.loggedIn && (
        <IconButton>
          <SaveIcon />
        </IconButton>
      )}
      <IconButton onClick={handleOpenDownload}>
        <DownloadIcon />
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseDownload}
      >
        <MenuItem onClick={handleGeoJSONDownload}>Download as GeoJSON</MenuItem>
        <MenuItem onClick={handleShapefileDownload}>Download as Shapefile</MenuItem>
        <MenuItem>Download as Image</MenuItem>
      </Menu>
    </Box>
  );
};

export default TopToolbar;
