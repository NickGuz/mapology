import { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  addComment,
  getComments,
  deleteComment,
} from '../../store/GlobalStoreHttpRequestApi';
import AuthContext from '../../auth/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

const Comment = (props) => {
  const [commentText, setCommentText] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [mapComments, setMapComments] = useState([]);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      let fetchedComments = await getComments(props.mapId);
      console.log(fetchedComments);
      if (fetchedComments) {
        setMapComments(fetchedComments.data);
      }
    };
    fetchComments();
  }, []);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = () => {
    const helper = async () => {
      let comment = await addComment(auth.user.id, props.mapId, commentText);
      if (comment) {
        let fetchedComments = await getComments(props.mapId);
        setMapComments(fetchedComments.data);
      }
    };
    if (commentText != '') {
      helper();
    }
    setCommentText('');
  };

  const handleCommentDelete = () => {
    const asyncDeleteComment = async () => {
      let deleted = await deleteComment(selectedCommentId);
      if (deleted) {
        let fetchedComments = await getComments(props.mapId);
        setMapComments(fetchedComments.data);
      }
    };
    asyncDeleteComment();
    handleConfirmDeleteClose();
  };

  const handleCommentDeleteClick = (id) => {
    setSelectedCommentId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setSelectedCommentId(null);
    setConfirmDeleteOpen(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        marginRight: 5,
        marginTop: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 600,
        paddingLeft: 1,
        paddingBottom: 1,
        paddingRight: 1,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          flex: 1,
          overflowY: 'auto',
          paddingTop: '10px',
        }}
      >
        {mapComments.length > 0 ? (
          mapComments.map((comment, index) => (
            <Box
              key={index}
              sx={{
                border: 1,
                borderColor: 'grey.300',
                borderRadius: '5px',
                padding: '10px',
                margin: '10px 0',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Avatar
                alt="User Profile Image"
                onClick={() => navigate(`/profile/${comment.userId}`)}
                // src={require('../../assets/avatar.jpg')}
              >
                {comment.user.username[0].toUpperCase()}
              </Avatar>
              <Typography
                sx={{ marginLeft: 1 }}
                onClick={() => navigate(`/profile/${comment.userId}`)}
              >
                {comment.user.username}:{' '}
              </Typography>
              <Typography sx={{ flex: 1, marginLeft: 1 }}>
                {comment.text}
              </Typography>
              <IconButton
                onClick={() => handleCommentDeleteClick(comment.id)}
                sx={{
                  marginLeft: 'auto',
                  visibility: auth.user.id == comment.userId ? '' : 'hidden',
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography sx={{ ml: 2 }}>No comments yet</Typography>
        )}
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <TextField
            label="Add a comment..."
            variant="outlined"
            multiline
            maxRows={4}
            value={commentText}
            onChange={handleCommentChange}
            fullWidth
            sx={{ flex: 1, mr: 1 }}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            sx={{ height: '100%' }}
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={commentText == ''}
          >
            Comment
          </Button>
        </Grid>
      </Grid>
      <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose}>Cancel</Button>
          <Button onClick={handleCommentDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Comment;
