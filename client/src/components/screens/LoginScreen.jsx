import * as React from "react";
import { useContext } from "react";
import AuthContext from "../../auth/AuthContextProvider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import IncorrectLoginModal from "../modals/IncorrectLoginModal";

export default function LoginScreen() {
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

  const handleCreateAccount = () => {
    navigate("/register/");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <IncorrectLoginModal/>
            <Box
              sx={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  minWidth: "100%",
                  marginBottom: 2,
                }}
              ></Box>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Typography component="h1" variant="subtitle2">
                Login to save and view your maps
              </Typography>
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
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 0, mb: 2 }} onClick={handleCreateAccount}>
                Create Account
              </Button>

              <Box textAlign="right">
                <Button onClick={handleForgotPassword}>Forgot Password?</Button>
              </Box>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}
