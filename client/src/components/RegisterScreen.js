import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../auth/AuthContextProvider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';



export default function RegisterScreen() {
    const [users, setUsers] = useState(null); // TODO temp - delete
    const { auth } = useContext(AuthContext);

    // TODO temp - delete
    useEffect(() => {
        auth.getAllUsers().then((res) => {
            setUsers(res.data);
        });
    }, [auth]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.registerUser(
            formData.get('username'),
            formData.get('email'),
            formData.get('password'),
            formData.get('confirmPassword')
        );

        // TODO temp - delete
        auth.getAllUsers().then((res) => {
            setUsers(res.data);
        })
     
    };

    return (
        <Box sx = {{flexGrow:1}}>
            <Grid container spacing={1}>
                <Grid item xs= {4}>
                    
                </Grid>
                <Grid item xs= {8} >
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                           
                            <Typography component="h1" variant="h5">
                                Create Your Account
                            </Typography>
                            <Typography component="h1" variant="subtitle2">
                                Create an account to save and view your maps
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
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
                                <FormGroup >
                                    <FormControlLabel control={<Checkbox  />} 
                                    label={<Typography variant="body2" color="blue">I agree to the Terms of Service and Privacy Policy</Typography>}
                                    
                                    />
                                </FormGroup>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Create Your Account
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link href="/login/" variant="body2">
                                            Already have an account? Sign in
                                        </Link>
                                    </Grid>
                                </Grid>

                                {/* TODO temp - delete */}
                                <Typography component="h3">Registered Users</Typography>
                                <List dense={true}>
                                    {users && users.map(user => { return (
                                        <ListItem>
                                            <ListItemText
                                                primary={user.username}
                                                secondary={null}
                                            />
                                        </ListItem>
                                    )
                                    })}
                                </List>
                            </Box>
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </Box>
            
    );
}