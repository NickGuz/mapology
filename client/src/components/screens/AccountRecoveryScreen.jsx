import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LoginModal from "../modals/LoginModal";
import AuthContext from "../../auth/AuthContextProvider";
import { useNavigate } from "react-router-dom";

const AccountRecoveryScreen = (props) => {
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const handleLogin = () => {
    auth.openLoginDialog();
  };

  const handleRegister = () => {
    navigate("/register/");
  };

  const handleRecoveryEmail = (event) => {
    // if temporary password is provided
    if(flag){
      console.log('testing')
    }
    const formData = new FormData(event.currentTarget);
    auth.sendRecoveryEmail(formData.get("email"));
    // auth.sendRecoveryEmail('kevin.zhou.3@stonybrook.edu');
  };

  const handleFlag = () => {
    flag ? setFlag(false) : setFlag(true)
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 18,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                  }}
                >
                  <Typography component="h1" variant="h5">
                    Forgot Password
                  </Typography>
                  <Typography component="h1" variant="subtitle2">
                    Enter your email in the field below.
                  </Typography>
                  <Typography component="h1" variant="subtitle2">
                    You will receive a one time password to login.
                  </Typography>
                  <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleRecoveryEmail} >
                    <Grid container spacing={2}>
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
                      {flag ? 
                        <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          name="Temporary Password"
                          label="Temporary Password"
                          type="Temporary Password"
                          id="Temporary Password"
                          autoComplete="Temporary Password"
                        />
                        </Grid> : null}
                      
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Checkbox/>}
                          onChange={handleFlag}
                          label={
                            <Typography variant="body2" color="blue">
                              I already have a Temporary Password
                            </Typography>
                          }
                        />
                      </Grid>
                    </Grid>
                    <Box display={"flex"} flexDirection={"row"}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        // sx={{ mt: 3, mb: 2, mr: 4 }}
                      >
                        {flag ? 'LOGIN' : 'SEND PASSWORD'}
                      </Button>
                      {/* <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={true}
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Login
                      </Button> */}
                    </Box>
                  </Box>
                  {/* <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, mr: 4 }}
                        onClick={() => handleRecoveryEmail()}
                      >
                        SEND PASSWORD TEST BUTTON
                      </Button> */}
                </Box>
              </Container>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item alignItems="flex-start">
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Container component="main" maxWidth="xs">
                  <CssBaseline />
                  <Box
                    sx={{
                      marginTop: 18,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                    }}
                  >
                    <Typography component="h1" variant="h5">
                      Login
                    </Typography>
                    <Typography component="h1" variant="subtitle2">
                      Remember your password?
                    </Typography>
                    <Typography component="h1" variant="subtitle2">
                      Click the button below to login and get access to your maps.
                    </Typography>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  </Box>
                </Container>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Container component="main" maxWidth="xs">
                  <CssBaseline />
                  <Box
                    sx={{
                      marginTop: 15,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                    }}
                  >
                    <Typography component="h1" variant="h5">
                      Register
                    </Typography>
                    <Typography component="h1" variant="subtitle2">
                      Don't have an account yet?
                    </Typography>
                    <Typography component="h1" variant="subtitle2">
                      Sign up with the button below to begin creating new maps!
                    </Typography>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleRegister}
                    >
                      Register
                    </Button>
                  </Box>
                </Container>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <LoginModal />
    </Box>
  );
};

export default AccountRecoveryScreen;
