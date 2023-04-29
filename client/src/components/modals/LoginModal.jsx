import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useContext } from "react";
import AuthContext from "../../auth/AuthContextProvider";
import { useNavigate } from "react-router-dom";

const LoginModal = (props) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    auth.loginUser(formData.get("userInfo"), formData.get("password"));
  };

  const handleForgotPassword = () => {
    auth.closeLoginDialog();
    navigate("/account-recovery/");
  };

  return (
    <Dialog open={auth.loginDialogOpen} onClose={auth.closeLoginDialog}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="userInfo"
            label="Email Address or Username"
            name="userInfo"
            autoComplete="Email Address or Username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            sx={{ mt: 3, mb: 2 }}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 0, mb: 2 }}>
          Create Account
        </Button>

        <Box textAlign="right">
          <Button onClick={handleForgotPassword}>Forgot Password?</Button>
        </Box>
      </DialogContent>

      {/* <DialogActions> */}
      {/* <Button onClick={auth.closeLoginDialog}>Cancel</Button> */}
      {/* <Button onClick={handleSubmit}>Login</Button> */}
      {/* </DialogActions> */}
    </Dialog>
  );
};

export default LoginModal;
