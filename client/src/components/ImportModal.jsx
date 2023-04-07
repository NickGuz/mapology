import React, { useContext, useState } from 'react';
import GlobalStoreContext from '../store/store';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TagsInput from './TagsInput';
import FileUpload from 'react-mui-fileuploader';
import { Alert } from '@mui/material';

const ImportModal = (props) => {
    const [filesToUpload, setFilesToUpload] = useState([]);

    const { store } = useContext(GlobalStoreContext);

    const handleSubmit = () => {
        store.setOpenImportDialog(false);
        console.log(filesToUpload);
    }

    const handleClose = () => {
        store.setOpenImportDialog(false);
    }

    const handleFilesChange = (files) => {
        // update chosen files
        setFilesToUpload([...files]);
    }

    return (
        <Dialog open={store.importDialogOpen} onClose={handleClose}>
            <DialogTitle>Import</DialogTitle>
            <DialogContent>
                <Alert severity="info">
                    Only .shp/.dbf or .geo.json file extensions are accepted
                </Alert>
                <FileUpload
                    multiFile={true}
                    onFilesChange={handleFilesChange}
                    onContextReady={(context) => {}}
                    title=""
                    header=">[Drag and drop]<"
                    maxUploadFiles={2}
                    allowedExtensions={['geo.json', 'shp', 'dbf']}
                    showPlaceholderImage={true}
                    ContainerProps={{
                        elevation: 0,
                        variant: "flat",
                        sx: { p: 1 }
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
                        marginBottom: '5%'
                    }}
                />
                <TagsInput />

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Import</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImportModal;