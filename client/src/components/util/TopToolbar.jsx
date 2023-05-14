import { Icon, IconButton } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as RequestApi from '../../store/GlobalStoreHttpRequestApi';
import { updateAllFeatures } from '../../store/GlobalStoreHttpRequestApi';
import GlobalStoreContext from '../../store/store';
import AuthContext from '../../auth/AuthContextProvider';
import CompressIcon from '@mui/icons-material/Compress';
import CompressModal from '../modals/CompressModal';
import EditIcon from '@mui/icons-material/Edit';

const TopToolbar = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [compressOpen, setCompressOpen] = useState(false);
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (
      auth.loggedIn &&
      store.currentMap &&
      auth.user.id === store.currentMap.mapInfo.authorId
    ) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [store.currentMap]);

  const handleOpenDownload = (event) => {
    setAnchorEl(event.target);
  };

  const handleCloseDownload = (event) => {
    setAnchorEl(null);
  };
  const handleCompress = () => {
    const comp = async () => {
      let compressed = await RequestApi.compress(store.currentMap.json);
      if (compressed) {
        let json = compressed.data.data;
        store.currentMap.json = json;
        store.setSelectedFeatures([]);
        store.setCurrentMap(store.currentMap);
        updateAllFeatures(store.currentMap.mapInfo.id, store.currentMap.json);
      }
    };
    comp();
  };
  const confirmCompress = () => {
    setCompressOpen(true);
  };

  const handleGeoJSONDownload = () => {
    RequestApi.downloadMapAsGeoJSON(
      store.currentMap.mapInfo.id,
      `${store.currentMap.mapInfo.title.replace('/', '_')}.geo.json`
    );
    setAnchorEl(null);
  };

  const handleShapefileDownload = () => {
    RequestApi.downloadMapAsShapefile(
      store.currentMap.mapInfo.id,
      `${store.currentMap.mapInfo.title.replace('/', '_')}_shp.zip`
    );
    setAnchorEl(null);
  };

  const handleEditTitle = async () => {
    const newTitle = await prompt('Enter a new title');

    if (newTitle) {
      try {
        RequestApi.updateMapTitle(store.currentMap.mapInfo.id, newTitle);
        const updatedMapInfo = { ...store.currentMap.mapInfo, title: newTitle };
        const updatedCurrentMap = {
          ...store.currentMap,
          mapInfo: updatedMapInfo,
        };
        // console.log(updatedMapInfo)
        // console.log(updatedCurrentMap)
        store.setCurrentMap(updatedCurrentMap);
      } catch (error) {
        console.log('Error updating map title:', error);
      }
    }
  };

  const handleUndo = () => {
    store.undo();
  };

  const handleRedo = () => {
    store.redo();
  };

  const handleDuplicate = () => {
    if (!auth.user) {
      window.alert('You must be signed in to duplicate a map');
      return;
    }

    RequestApi.duplicateMap(auth.user.id, store.currentMap.mapInfo.id);
  };

  return (
    <Box display="flex" alignItems="center">
      {authorized && (
        <>
          <IconButton onClick={handleUndo}>
            <UndoIcon />
          </IconButton>
          <IconButton onClick={handleRedo}>
            <RedoIcon />
          </IconButton>
        </>
      )}
      <IconButton onClick={handleDuplicate}>
        <ContentCopyIcon />
      </IconButton>
      {authorized && (
        <IconButton>
          <SaveIcon />
        </IconButton>
      )}
      <IconButton id="download-dropdown-btn" onClick={handleOpenDownload}>
        <DownloadIcon />
      </IconButton>
      <Menu
        sx={{ mt: '45px' }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseDownload}
      >
        <MenuItem onClick={handleGeoJSONDownload}>Download as GeoJSON</MenuItem>
        <MenuItem onClick={handleShapefileDownload}>
          Download as Shapefile
        </MenuItem>
        {/* <MenuItem>Download as Image</MenuItem> */}
      </Menu>
      {authorized && (
        <IconButton onClick={confirmCompress}>
          <CompressIcon />
        </IconButton>
      )}
      <CompressModal
        show={compressOpen}
        close={() => setCompressOpen(false)}
        confirm={() => handleCompress()}
      />
      <Box flexGrow={1} textAlign="center">
        <span>
          {store.currentMap &&
            store.currentMap.mapInfo &&
            store.currentMap.mapInfo.title}
        </span>
        <IconButton onClick={handleEditTitle}>
          <EditIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopToolbar;
