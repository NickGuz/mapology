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

export default function PasswordResetScreen() {
  const { auth } = useContext(AuthContext);

  const handleSubmit = (event) => {
    // event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    // auth.resetPassword(
    //     formData.get('password'),
    //     formData.get('confirmPassword')
    // );
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
              <Box>
                <Typography component="h1" variant="h5">
                  Reset Password
                </Typography>
                <Typography component="h1" variant="subtitle2">
                  Enter a new password to permanently reset your password.
                </Typography>
              </Box>

              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="newPass"
                      name="newPass"
                      required
                      fullWidth
                      id="newPass"
                      label="New Password"
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Confirm Password"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Reset Password
                </Button>
              </Box>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}
