import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom";
import {signupUser} from "../services/UserConnection.tsx";
import { useState } from "react";
import {Alert} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";


const defaultTheme = createTheme();

export default function Signup({ onSignup }: any) {

    const [singUpError, setSingUpError] = useState<string>("");
    const [signUpSuccess, setSignUpSuccess] = useState<string>("");
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const user = {
            username: data.get('username') as string,
            email: data.get('email') as string,
            password: data.get('password') as string,
        };
        try {
            await signupUser(user);
            setSignUpSuccess("User Registered Successfully")
            setTimeout(() => {
                onSignup();
                setSignUpSuccess("")
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.status === 401) {
                setSingUpError("Invalid User Credentials");
            } else if (error.response && error.response.data && error.response.data.message) {
                setSingUpError(error.response.data.message);
            }
            // Clear error after 2 seconds
            setTimeout(() => {
                setSingUpError("");
            }, 2000);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="User Name"
                            name="username"
                            autoComplete="username"
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
                        />
                        {signUpSuccess && (
                            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                                {signUpSuccess}
                            </Alert>
                        )}
                        {singUpError && (
                            <Alert icon={<CheckIcon fontSize="inherit" />} severity="error">
                                {singUpError}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={signUpSuccess !== ""}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/login">
                                    {"You have an account? Login"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
