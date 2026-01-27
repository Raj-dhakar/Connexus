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
    const [credentials, setCredentials] = useState({ username: "", email: "", password: "", profile_image: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCredentials({ ...credentials, profile_image: e.target.files[0] });
        }
    };

    const signup = async () => {
        const formData = new FormData();
        formData.append("username", credentials.username);
        formData.append("email", credentials.email);
        formData.append("password", credentials.password);
        formData.append("file", credentials.profile_image);

        try {
            await authApi.signup(formData);
            toast.success("Account created successfully!");
            navigate("/");
        } catch (error) {
            console.error("Signup error", error);
            toast.error("Registration failed. Try again.");
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

                <TextField
                    fullWidth
                    placeholder="Username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>,
                    }}
                />

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
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<PersonIcon />}
                    sx={{
                        justifyContent: 'flex-start',
                        color: 'text.secondary',
                        borderColor: 'rgba(255,255,255,0.1)',
                        py: 1.5,
                        '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                    }}
                >
                    {credentials.profile_image ? credentials.profile_image.name : "Upload Profile Picture"}
                    <input type="file" hidden onChange={handleFileChange} />
                </Button>

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
