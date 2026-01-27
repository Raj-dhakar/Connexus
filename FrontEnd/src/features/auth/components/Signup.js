import React, { useState } from 'react';
import {
    Button,
    TextField,
    Typography,
    Box,
    Link as MuiLink,
    InputAdornment,
    IconButton,
    Paper,
    Grid
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
    Visibility,
    VisibilityOff,
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Work as WorkIcon
} from '@mui/icons-material';
import authApi from '../../../api/authApi';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Signup() {
    const [credentials, setCredentials] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const validateInputs = () => {
        const { firstName, lastName, email, password } = credentials;

        if (!firstName) {
            toast.error("First Name is required");
            return false;
        }
        if (firstName.length <= 3) {
            toast.error("First Name must be greater than 3 characters");
            return false;
        }
        if (!lastName) {
            toast.error("Last Name is required");
            return false;
        }
        if (lastName.length <= 3) {
            toast.error("Last Name must be greater than 3 characters");
            return false;
        }
        if (!email) {
            toast.error("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Invalid email address");
            return false;
        }
        if (!password) {
            toast.error("Password is required");
            return false;
        }
        return true;
    };

    const signup = async () => {
        if (!validateInputs()) return;

        const { firstName, lastName, email, password } = credentials;
        let response = null;
        try {
            response = await authApi.signup({ firstName, lastName, email, password });
            toast.success("Account created successfully!");
            navigate("/");
        } catch (error) {
            console.error("Signup error", error);
            toast.error(error.response?.data?.error?.message || "Registration failed. Try again.");
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Background Elements */}
            <Box component={motion.div}
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
                sx={{ position: 'absolute', top: -100, right: -100, width: '600px', height: '600px', borderRadius: '40%', border: '1px solid rgba(255,255,255,0.05)', zIndex: -1 }}
            />

            <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                elevation={24}
                sx={{
                    width: { xs: '90%', sm: '500px' },
                    padding: { xs: 4, md: 5 },
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(to right, #4facfe, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Join Connexus
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Create your futuristic profile today.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        placeholder="First Name"
                        name="firstName"
                        value={credentials.firstName}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
                        }}
                    />
                    <TextField
                        fullWidth
                        placeholder="Last Name"
                        name="lastName"
                        value={credentials.lastName}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
                        }}
                    />
                </Box>

                <TextField
                    fullWidth
                    placeholder="Email Address"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                    }}
                />

                <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={signup}
                    sx={{ mt: 2, borderRadius: '50px', fontSize: '1.1rem' }}
                >
                    Create Account
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Are you a recruiter?{' '}
                        <MuiLink component={Link} to="/recruiter/signup" underline="none" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                            Sign up here
                        </MuiLink>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Already have an account?{' '}
                        <MuiLink component={Link} to="/" underline="none" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            Log In
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

export default Signup;
