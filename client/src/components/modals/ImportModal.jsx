import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import GlobalStoreContext from "../../store/store";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from '@mui/material/Box';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TagsInput from "../util/TagsInput";
import FileUpload from "react-mui-fileuploader";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Alert } from "@mui/material";
import { createMap, getAllMapsByUserId } from "../../store/GlobalStoreHttpRequestApi";
import shp from "shpjs";
import AuthContext from "../../auth/AuthContextProvider";

const ImportModal = (props) => {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [compress, setCompress] = useState();
  const [tags, setTags] = useState([]);

  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = () => {
    store.setOpenImportDialog(false);

    if (filesToUpload.length === 2) {
      let shpFile, dbfFile;
      filesToUpload.forEach((file) => {
        if (file.name.endsWith(".shp")) {
          shpFile = file;
        } else if (file.name.endsWith(".dbf")) {
          dbfFile = file;
        }
      });

      if (!shpFile || !dbfFile) {
        window.alert("Failed to import files");
        return;
      }

      importShapefile(shpFile, dbfFile);
    } else if (filesToUpload.length === 1) {
      importGeoJSON(filesToUpload[0]);
    }
  };

  const importGeoJSON = (file) => {
    let fileReader = new FileReader();

    fileReader.onload = async (event) => {
      let data = JSON.parse(event.target.result);
      let userId = 4;
      if (auth.user) {
        userId = auth.user.id;
      }
      await createMap(null, userId, name, description, tags, data, compress);
      getAllMapsByUserId(auth.user.id);
    };

    fileReader.readAsText(file);
  };

  const importShapefile = (shpFile, dbfFile) => {
    let shpReader = new FileReader();
    shpReader.readAsArrayBuffer(shpFile);

    shpReader.onload = async () => {
      const dbfReader = new FileReader();
      dbfReader.readAsArrayBuffer(dbfFile);

      dbfReader.onload = async () => {
        const geojson = shp.combine([
          shp.parseShp(shpReader.result),
          shp.parseDbf(dbfReader.result),
        ]);

        let userId = 4;
        if (auth.user) {
          userId = auth.user.id;
        }
        await createMap(null, userId, name, description, tags, geojson, compress);
        getAllMapsByUserId(auth.user.id);
      };
    };
  };

  const handleClose = () => {
    store.setOpenImportDialog(false);
  };

  const handleFilesChange = (files) => {
    // update chosen files
    setFilesToUpload([...files]);
  };

  const handleTagsChange = (event, value) => {
    setTags(value);
  };

  return (
    <Dialog open={store.importDialogOpen} onClose={handleClose}>
      <DialogTitle>Import</DialogTitle>
      <DialogContent>
        <Alert severity="info">Only .shp/.dbf or .geo.json file extensions are accepted</Alert>
        <FileUpload
          multiFile={true}
          onFilesChange={handleFilesChange}
          onContextReady={(context) => {}}
          title=""
          header=">[Drag and drop]<"
          maxUploadFiles={2}
          // allowedExtensions={["json", ".shp", ".dbf"]}
          showPlaceholderImage={true}
          ContainerProps={{
            elevation: 0,
            variant: "flat",
            sx: { p: 1 },
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="map-name"
          label="Map Name"
          type="text"
          fullWidth
          variant="standard"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          sx={{
            marginBottom: "5%",
          }}
          onChange={(event) => setDescription(event.target.value)}
        />
        
        <TagsInput freeSolo={true} onChange={handleTagsChange} />

        <Box sx={{ minWidth: 120 , mt: 2}}>
          <FormControl fullWidth>
            <InputLabel id="compression-label">Map Compression</InputLabel>
            <Select
              labelId="compress-label"
              id="compress-select"
              value={compress}
              label="Map Compression"
              onChange={(event) => setCompress(event.target.value)}
            >
              <MenuItem value={1}>Small</MenuItem>
              <MenuItem value={.01}>Medium</MenuItem>
              <MenuItem value={.0001}>Large</MenuItem>
              <MenuItem value={Number.MIN_VALUE}>No Compression</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Import</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportModal;
