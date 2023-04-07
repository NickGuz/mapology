import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import React, { useContext } from 'react';
import AuthContext from '../auth/AuthContextProvider';

const LoginModal = (props) => {
    const { auth } = useContext(AuthContext);

    const handleSubmit = () => {
        auth.closeLoginDialog();
    }

    return (
        <Dialog open={auth.loginDialogOpen} onClose={auth.closeLoginDialog}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="email-or-username"
                    label="Email or Username"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                />

                <FormControlLabel control={<Checkbox />} label="Remember me" />

                <Button
                    onClick={handleSubmit}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Login
                </Button>
                <Button
                    onClick={handleSubmit}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 0, mb: 2 }}
                >
                    Create Account
                </Button>

                <Box textAlign='right'>
                    <Button>Forgot Password?</Button>
                </Box>

            </DialogContent>

            {/* <DialogActions> */}
                {/* <Button onClick={auth.closeLoginDialog}>Cancel</Button> */}
                {/* <Button onClick={handleSubmit}>Login</Button> */}
            {/* </DialogActions> */}
        </Dialog>
    )
}

export default LoginModal;