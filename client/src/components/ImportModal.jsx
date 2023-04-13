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
import { createMap } from '../store/GlobalStoreHttpRequestApi';

const ImportModal = (props) => {
    const [filesToUpload, setFilesToUpload] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);

    const { store } = useContext(GlobalStoreContext);

    const handleSubmit = (event) => {
        store.setOpenImportDialog(false);
        console.log('selected files', filesToUpload);
        console.log('tags', tags);

        let fileReader = new FileReader();
        fileReader.onload = async (event) => { 
            let data = JSON.parse(event.target.result);
            console.log('parsed json', data);
            await createMap(
                null,
                4,
                name,
                description,
                tags,
                data
            );
        }
        fileReader.readAsText(filesToUpload[0]);
    }

    const handleClose = () => {
        store.setOpenImportDialog(false);
    }

    const handleFilesChange = (files) => {
        // update chosen files
        setFilesToUpload([...files]);
    }

    const handleTagsChange = (event, value) => {
        setTags(value);
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
                    allowedExtensions={['json']}
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
                    onChange={(event) => { setName(event.target.value) }}
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
                    onChange={(event) => setDescription(event.target.value)}
                />
                <TagsInput
                    freeSolo={true}
                    onChange={handleTagsChange}
                />

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Import</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ImportModal;