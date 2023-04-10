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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      
    >

        <Box sx={{ width: "100%", maxWidth: 600, flex: 1, overflowY: "auto", paddingTop: "10px" }}>

            {comments.length > 0 ? (
            comments.map((comment, index) => (
                <Box
                key={index}
                sx={{
                    padding: "10px",
                    margin: "10px 0",
                    display: "flex",
                    alignItems: "center",
                }}
                >
                <Avatar
                    alt="User Profile Image"
                    src={require("../assets/avatar.jpg")}
                />
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
            <Typography sx={{ml: 2}}>No comments yet</Typography>
            )}
        </Box>
        <Box
            sx={{
            width: "100%",
            maxWidth: 600,
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px",
            }}
        >
            <TextField
                label="Add a comment..."
                variant="outlined"
                multiline
                rows={4}
                value={commentText}
                onChange={handleCommentChange}
                fullWidth
                margin="normal"
                sx={{ flex: 1, mr: 1 }}
            />
            <Button variant="contained" onClick={handleCommentSubmit}>
                Comment
            </Button>
        </Box>
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
    </Box>
  );
};

export default Comment;
