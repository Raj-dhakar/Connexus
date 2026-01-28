import React, { useState, useEffect } from 'react';
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Avatar,
    Container,
    Grid,
    Paper,
    Divider,
    Chip,
    Button,
    useTheme,
    Slide,
    Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useAuth from '../../auth/useAuth';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedIcon from '@mui/icons-material/Verified';
import CakeIcon from '@mui/icons-material/Cake';
import PlaceIcon from '@mui/icons-material/Place'; // Placeholder for location if needed

import postApi from '../../../api/postApi'; // Import API

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ProfileDialog = ({ open, onClose, user }) => {
    const theme = useTheme();
    const { user: currentUser } = useAuth();
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (user && user.id) {
                try {
                    const response = await postApi.getPostsByUser(user.id);
                    console.log("User posts:", response);
                    if (response.data && Array.isArray(response.data.data)) {
                        setUserPosts(response.data.data);
                    } else if (Array.isArray(response.data)) {
                        setUserPosts(response.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch user posts for profile:", error);
                    setUserPosts([]); // Reset on error
                }
            }
        };

        if (open) { // Only fetch when dialog opens
            fetchUserPosts();
        }
    }, [user, open]);

    if (!user) return null;

    const isOwnProfile = currentUser && (currentUser.user_id === user.id || currentUser.id === user.id);

    console.log("user: " + JSON.stringify(user));
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    bgcolor: '#f8fafc', // Light grey background for professional look
                }
            }}
        >
            <AppBar sx={{ position: 'relative', bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1, fontWeight: 'bold' }} variant="h6" component="div">
                        Profile
                    </Typography>
                    {/* Optional: Add Action Buttons like "Edit Profile" here later */}
                </Toolbar>
            </AppBar>

            <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                {/* Banner Section */}
                <Box
                    sx={{
                        height: { xs: 200, md: 300 },
                        width: '100%',
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
                        position: 'relative',
                        mb: 10 // Space for avatar overlap
                    }}
                >
                    {/* Decorative abstract shapes or pattern could go here */}
                </Box>

                <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
                    <Grid container spacing={4}>
                        {/* Sidebar / Left Column */}
                        <Grid item xs={12} md={4} lg={3}>
                            <Box sx={{ position: 'relative', top: -80, display: 'flex', flexDirection: 'column', alignItems: 'center', md: { alignItems: 'flex-start' } }}>
                                <Avatar
                                    src={user.profileImage}
                                    alt={user.firstName}
                                    sx={{
                                        width: 160,
                                        height: 160,
                                        border: '6px solid white',
                                        boxShadow: theme.shadows[3],
                                        bgcolor: 'white' // Fallback
                                    }}
                                />
                                <Box sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
                                    <Typography variant="h4" fontWeight="800" gutterBottom>
                                        {user.firstName} {user.lastName}
                                        {user.role === 'RECRUITER' && (
                                            <VerifiedIcon color="primary" sx={{ ml: 1, verticalAlign: 'middle' }} />
                                        )}
                                    </Typography>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        @{user.username}
                                    </Typography>

                                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                                        <Chip
                                            label={user.designation || 'Member'}
                                            color="primary"
                                            variant="filled"
                                            sx={{ fontWeight: 'bold', px: 2, py: 2.5, borderRadius: 2 }}
                                        />

                                    </Stack>

                                    {/* Action Buttons (Placeholder) */}
                                    <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
                                        {!isOwnProfile && (
                                            <Button variant="contained" color="primary" fullWidth sx={{ borderRadius: 2 }}>
                                                Connect
                                            </Button>
                                        )}
                                        <Button variant="outlined" color="primary" fullWidth sx={{ borderRadius: 2 }}>
                                            Message
                                        </Button>
                                    </Stack>
                                </Box>

                                {/* Quick Details Card */}
                                <Paper elevation={0} variant="outlined" sx={{ width: '100%', mt: 4, p: 3, borderRadius: 4, bgcolor: 'white' }}>
                                    <Stack spacing={2}>
                                        <Typography variant="subtitle1" fontWeight="bold">Intro</Typography>

                                        {user.dob && (
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <CakeIcon color="action" fontSize="small" />
                                                <Typography variant="body2">Born {user.dob}</Typography>
                                            </Stack>
                                        )}
                                        {user.location && (
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <PlaceIcon color="action" fontSize="small" />
                                                <Typography variant="body2">{user.location}</Typography>
                                            </Stack>
                                        )}

                                        <Divider sx={{ my: 1 }} />

                                        {user.website && (
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <LanguageIcon color="action" fontSize="small" />
                                                <Typography
                                                    variant="body2"
                                                    component="a"
                                                    href={user.website}
                                                    target="_blank"
                                                    sx={{ color: 'primary.main', fontWeight: 'medium', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                                >
                                                    Website
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Stack>
                                </Paper>
                            </Box>
                        </Grid>

                        {/* Main Content / Right Column */}
                        <Grid item xs={12} md={8} lg={9} sx={{ mt: { xs: -6, md: 4 } }}>
                            <Box sx={{ pb: 8 }}>
                                {/* About Section */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                                        About
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                        {user.about || 'No about information available.'}
                                    </Typography>
                                </Paper>

                                {/* Contact Information Section */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                                        Contact Information
                                    </Typography>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main }}>
                                                        <EmailIcon />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">Email Address</Typography>
                                                        <Typography variant="body1" fontWeight="medium">{user.email || 'N/A'}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main }}>
                                                        <PhoneIcon />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                                                        <Typography variant="body1" fontWeight="medium">{user.phone || 'N/A'}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Skills Section */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                                        Skills
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {user.skills && user.skills.length > 0 ? (
                                            user.skills.map((skill, index) => (
                                                <Chip
                                                    key={index}
                                                    label={skill}
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 'medium', borderRadius: 2 }}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                No skills listed.
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>

                                {/* Activity / Stats Placeholder */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
                                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                                        Activity
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {userPosts.length > 0 ? (
                                            userPosts.map((post) => (
                                                <Grid item xs={12} key={post.postId}>
                                                    <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {/* Placeholder date since DTO might not have formatted date yet, or use current time as fallback */}
                                                            Posted an update
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium" sx={{ mt: 0.5 }}>
                                                            {post.title && <span style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>{post.title}</span>}
                                                            {post.description}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            ))
                                        ) : (
                                            <Grid item xs={12}>
                                                <Typography variant="body1" color="text.secondary">
                                                    No recent activity to show.
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Dialog>
    );
};

export default ProfileDialog;
