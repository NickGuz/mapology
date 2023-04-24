import { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Comment = () => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = () => {
    setComments([...comments, commentText]);
    setCommentText("");
  };

  const handleCommentDelete = () => {
    const updatedComments = [...comments];
    updatedComments.splice(selectedCommentIndex, 1);
    setComments(updatedComments);
    setSelectedCommentIndex(null);
    setConfirmDeleteOpen(false);
  };

  const handleCommentDeleteClick = (index) => {
    setSelectedCommentIndex(index);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setSelectedCommentIndex(null);
    setConfirmDeleteOpen(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        marginRight: 5,
        marginTop: 2,
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 600,
        paddingLeft: 1,
        paddingBottom: 1,
        paddingRight: 1,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 600, flex: 1, overflowY: "auto", paddingTop: "10px" }}>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <Box
              key={index}
              sx={{
                border: 1,
                borderColor: "grey.300",
                borderRadius: "5px",
                padding: "10px",
                margin: "10px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar alt="User Profile Image" src={require("../../assets/avatar.jpg")} />
              <Typography sx={{ marginLeft: 1 }}>John:</Typography>
              <Typography sx={{ flex: 1, marginLeft: 1 }}>{comment}</Typography>
              <IconButton
                onClick={() => handleCommentDeleteClick(index)}
                sx={{ marginLeft: "auto" }}
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
          <Button sx={{ height: "100%" }} variant="contained" onClick={handleCommentSubmit}>
            Comment
          </Button>
        </Grid>
      </Grid>
      <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this comment?</DialogContentText>
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
