import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

import Link from '@mui/material/Link';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  

export default function RegisterScreen() {

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
     
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
                                Create an accoutn to save and view your maps
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                        <TextField
                                            autoComplete="fname"
                                            name="Username"
                                            required
                                            fullWidth
                                            id="Username"
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
                                            name="ConfrimPassword"
                                            label="Confrim Password"
                                            type="password"
                                            id="ConfirmPassword"
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
                            </Box>
                        </Box>
                    </Container>
                </Grid>
            </Grid>
        </Box>
            
    );
}