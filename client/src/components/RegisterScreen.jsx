
import * as React from "react";
import { useContext } from "react";
import AuthContext from "../auth/AuthContextProvider";
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

export default function RegisterScreen() {
  const { auth } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    auth.registerUser(
      formData.get("username"),
      formData.get("email"),
      formData.get("password"),
      formData.get("confirmPassword")
    );
  };

  const handleLogin = () => {
    auth.openLoginDialog();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
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
              >
                {auth.registered && <Alert severity="error">Username already exists!</Alert>}
                {auth.notSamePass && <Alert severity="error">Passwords must match!</Alert>}
                {auth.acctEmpt && <Alert severity="error">Input fields must not be empty!</Alert>}
                {auth.invalidEmail && <Alert severity="error">Invalid email!</Alert>}
                {auth.user && <Alert severity="info">Account created succesfully!</Alert>}
              </Box>
              <Typography component="h1" variant="h5">
                Create Your Account
              </Typography>
              <Typography component="h1" variant="subtitle2">
                Create an account to save and view your maps
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="username"
                      name="username"
                      required
                      fullWidth
                      id="username"
                      label=" Username"
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={
                      <Typography variant="body2" color="blue">
                        I agree to the Terms of Service and Privacy Policy
                      </Typography>
                    }
                  />
                </FormGroup>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Create Your Account
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link component="button" onClick={handleLogin} variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}
