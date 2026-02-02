import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import {
    Button,
    TextField,
    Typography,
    Box,
    Link as MuiLink,
    InputAdornment,
    IconButton,
    Paper,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
    Visibility,
    VisibilityOff,
    Email as EmailIcon,
    Lock as LockIcon,
    Google as GoogleIcon,
    GitHub as GitHubIcon
} from '@mui/icons-material';
import authApi from '../../../api/authApi';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

function Signin() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const signin = async () => {
        const { email, password } = credentials;

        if (!email) {
            toast.error("Email is required");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Invalid email address");
            return;
        }
        if (!password) {
            toast.error("Password is required");
            return;
        }

        try {
            const response = await authApi.login(credentials.email, credentials.password);
            const jwtToken = response.data.data.jwtToken;

            console.log("JWT Token:", jwtToken);
            console.log("Response:", response.data.data);


            if (jwtToken) {
                // 1. Store Token
                Cookies.set('token', jwtToken, { expires: 7 });

                // 2. Decode Token (as per requirement)
                let decoded = null;
                try {
                    decoded = jwtDecode(jwtToken);
                    console.log("Decoded Token:", decoded);
                } catch (decodeError) {
                    console.error("Token decoding failed", decodeError);
                }

                // 3. Fetch User Profile
                const userResponse = await authApi.getMe(decoded.user_id);
                console.log("User Response:", userResponse);

                if (userResponse.data) {
                    const userData = userResponse.data.data;

                    // Normalize profile image
                    if (userData.profileImage) {
                        userData.profile_image = userData.profileImage;
                    }

                    // 4. Store Full Profile
                    Cookies.set('user', JSON.stringify(userData), { expires: 7 });

                    toast.success("Welcome back to the future!");

                    if (userData.role === "ROLE_ADMIN") {
                        navigate("/admin/dashboard");
                    } else if (userData.role === "ROLE_RECRUITER") {
                        navigate("/recruiter/dashboard");
                    } else {
                        navigate("/main");
                    }
                } else {
                    toast.error("Failed to fetch user profile.");
                }
            } else {
                toast.error(response.data.error.message);
            }
        } catch (error) {
            console.error("Login error", error);
            toast.error(error.response?.data?.message || "Invalid credentials");
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
            {/* Animated Floating Orbs */}
            <Box component={motion.div}
                animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                sx={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,242,254,0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: -1 }}
            />
            <Box component={motion.div}
                animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.5, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                sx={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,172,254,0.2) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(50px)', zIndex: -1 }}
            />

            <Paper
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                elevation={24}
                sx={{
                    width: { xs: '90%', sm: '450px' },
                    padding: { xs: 4, md: 6 },
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            background: 'linear-gradient(135deg, #FFF 0%, #00f2fe 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1,
                            letterSpacing: '-1px'
                        }}
                    >
                        Sign In
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome back to the <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>Connexus</Box> network.
                    </Typography>
                </Box>

                {/* Form */}
                <TextField
                    fullWidth
                    placeholder="Email Address"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
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
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                        control={<Checkbox sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: 'primary.main' } }} />}
                        label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
                    />
                    <MuiLink component={Link} to="#" underline="hover" sx={{ color: 'primary.main', fontSize: '0.9rem' }}>
                        Forgot Password?
                    </MuiLink>
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={signin}
                    sx={{ mt: 1, py: 1.5, fontSize: '1.1rem' }}
                >
                    Sign In
                </Button>

                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                    <Typography variant="caption" color="text.secondary">OR CONTINUE WITH</Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton sx={{ border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <GoogleIcon sx={{ color: '#fff' }} />
                    </IconButton>
                    <IconButton sx={{ border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <GitHubIcon sx={{ color: '#fff' }} />
                    </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Don't have an account?{' '}
                    <MuiLink component={Link} to="/signup" underline="none" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                        Join Now
                    </MuiLink>
                </Typography>
            </Paper>
        </Box>
    );
}

export default Signin;
