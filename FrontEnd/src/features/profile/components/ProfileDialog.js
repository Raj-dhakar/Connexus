import React, { useState, useEffect, useRef } from 'react';
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
    Chip,
    Button,
    useTheme,
    Slide,
    Stack,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import CakeIcon from '@mui/icons-material/Cake';
import PlaceIcon from '@mui/icons-material/Place';
import WorkIcon from '@mui/icons-material/Work';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import useAuth from '../../auth/useAuth';
import postApi from '../../../api/postApi';
import userApi from '../../../api/userApi';
import SkillAutocomplete from '../../common/SkillAutocomplete';
import LocationAutocomplete from '../../common/LocationAutocomplete';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EXPERIENCE_LEVELS = ["JUNIER", "MIDLEVEL", "SENIOR", "LEAD", "MANAGER"];

const ProfileDialog = ({ open, onClose, user }) => {
    const theme = useTheme();
    const { user: currentUser, updateUser } = useAuth();
    const [userPosts, setUserPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({});
    const [displayUser, setDisplayUser] = useState(user); // State for the user being displayed, allowing updates from API
    const fileInputRef = useRef(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Initialize form data when user opens dialog
    // Initialize data when user prop changes
    useEffect(() => {
        if (user) {
            setDisplayUser(user);
            // Fetch full profile if not complete or just to be safe for other users
            // Using a simple check: if we are viewing another user, let's fetch their latest data.
            // Or always fetch to ensure we have details like 'about', 'skills', etc. which might be missing in 'user' prop from feed.
            const fetchFullProfile = async () => {
                const targetId = user?.id || user?.user_id || user?.userId;
                if (targetId) {
                    try {
                        const response = await userApi.getProfile(targetId);
                        if (response.data && response.data.data) {
                            setDisplayUser(response.data.data);
                        } else if (response.data) {
                            setDisplayUser(response.data);
                        }
                    } catch (err) {
                        console.error("Failed to fetch full profile", err);
                    }
                }
            };

            // Trigger fetch
            fetchFullProfile();
        }
    }, [user, open]);

    // Update formData when displayUser changes (so edit mode has correct data if enabled)
    useEffect(() => {
        if (displayUser) {
            setFormData({
                firstName: displayUser.firstName || '',
                lastName: displayUser.lastName || '',
                designation: displayUser.designation || '',
                about: displayUser.about || '',
                location: displayUser.location || '',
                website: displayUser.website || '',
                phone: displayUser.phone || '',
                skills: displayUser.skills || [],
                expType: displayUser.expType || 'JUNIOR',
                email: displayUser.email
            });
        }
    }, [displayUser]);

    useEffect(() => {

        const fetchUserPosts = async () => {
            const targetId = user?.id || user?.user_id || user?.userId;
            if (user && targetId) {
                try {
                    const response = await postApi.getPostsByUser(targetId);
                    if (response.data && Array.isArray(response.data.data)) {
                        setUserPosts(response.data.data);
                    } else if (Array.isArray(response.data)) {
                        setUserPosts(response.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch user posts for profile:", error);
                    setUserPosts([]);
                }
            }
        };

        if (open) {
            fetchUserPosts();
        }
    }, [user, open]);

    if (!user) return null;

    const currentUserId = currentUser?.id || currentUser?.user_id || currentUser?.userId;
    const profileUserId = user?.id || user?.user_id || user?.userId;

    const isOwnProfile = currentUser && String(currentUserId) === String(profileUserId);

    // Use displayUser for rendering only if it matches the requested user prop
    // This prevents showing stale data from a previous open
    const isDisplayUserCurrent = displayUser && (String(displayUser.id) === String(profileUserId) || String(displayUser.userId) === String(profileUserId) || String(displayUser.user_id) === String(profileUserId));
    const renderUser = isDisplayUserCurrent ? displayUser : user;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleExpTypeChange = (e) => {
        setFormData(prev => ({ ...prev, expType: e.target.value }));
    };

    const handleSkillsChange = (newSkills) => {
        setFormData(prev => ({ ...prev, skills: newSkills }));
    };

    const handleLocationChange = (newLocation) => {
        // LocationAutocomplete might return an object or string depending on implementation
        // RecruiterDashboard uses Nominatim which returns object, but our component returns string/null for simple usage if we adapted it correctly.
        // Looking at LocationAutocomplete implementation: on change returns newValue which can be string.
        setFormData(prev => ({ ...prev, location: newLocation }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Merge existing user data with form updates
            const updatedUser = {
                ...user,
                ...formData,
                // Ensure ID is present
                id: renderUser.id
            };
            console.log(updatedUser);
            console.log(renderUser.id);
            await userApi.updateUser(renderUser.id, updatedUser);
            // Update local auth context if it's the own profile
            if (isOwnProfile) {
                updateUser(updatedUser);
            }
            setIsEditing(false);
            // Ideally refetch user or update local cache, but for now just close edit mode.
            // If the parent component responsible for 'user' prop doesn't update, 
            // the UI might revert until next fetch. 
            // We might need to call a refresh callback if provided, but for now we rely on 
            // the fact that we might need to manually update the display or reload.
            // Better: update valid user object in parent if possible, or just force reload of page?
            // Since we can't easily force parent update, we will assume prompt implies just sending the request.
            // To make UI reflect changes immediately without parent refresh, we can rely on formData being effectively displayed
            // BUT, if we exit edit mode, we display 'user' prop usually. 
            // Let's create a local displayUser that overrides 'user' prop after save.
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to save changes. : " + error.response.data.error.message);
        } finally {
            setSaving(false);
        }
    };

    // Use formData for display when editing, otherwise fall back to user prop.
    // However, after save, 'user' prop is still stale. 
    // Trick: We can just use formData for display if we update it on save? 
    // No, 'user' prop comes from parent. 
    // Let's just use formData as the source of truth for the Inputs.
    // For Display mode, we should use 'user'. 
    // WORKAROUND: For this task, we will just reload the window or ask user to refresh? 
    // Or better, we can modify the 'user' object locally? No, props are read-only.
    // We will assume the parent handles data refreshing or we just stick to 'formData' being correct 
    // if we successfully saved, but correct React pattern is parent update.
    // I will trigger a window.location.reload() for simplicity to ensure consistency as user requested "analyzie from backed folder" implying robust backend sync.
    // Actually, `window.location.reload()` is too jarring. 
    // I will use a local mergedUser state.

    // Let's use `localUser` state.

    const handleImageClick = () => {
        if (isOwnProfile && !isEditing) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await userApi.uploadProfileImage(formData);
            if (response.data && response.data.data) {
                // Update the displayed user with the new image URL
                // The API returns the image URL in response.data.data (ApiResponse<String>)
                const newImageUrl = response.data.data;
                setDisplayUser(prev => ({
                    ...prev,
                    profileImage: newImageUrl
                }));

                // Also update local auth context if it's the own profile
                if (isOwnProfile) {
                    updateUser({
                        ...currentUser,
                        profileImage: newImageUrl,
                        profile_image: newImageUrl // Ensure compatibility with components expecting snake_case (like Navbar)
                    });
                }
            }
        } catch (error) {
            console.error("Failed to upload profile image:", error);
            alert("Failed to upload image.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            // Entering edit mode: ensure formData is fresh
            setFormData({
                firstName: renderUser.firstName || '',
                lastName: renderUser.lastName || '',
                designation: renderUser.designation || '',
                about: renderUser.about || '',
                location: renderUser.location || '',
                website: renderUser.website || '',
                phone: renderUser.phone || '',
                skills: renderUser.skills || [],
                expType: renderUser.expType || 'JUNIOR',
                email: renderUser.email // keep email in form just in case, though maybe read only
            });
        }
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: { bgcolor: '#f8fafc' }
            }}
        >
            <AppBar sx={{ position: 'relative', bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1, fontWeight: 'bold' }} variant="h6">
                        Profile
                    </Typography>
                    {isOwnProfile && (
                        <Button
                            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                            variant={isEditing ? "contained" : "outlined"}
                            color="primary"
                            onClick={isEditing ? handleSave : handleEditToggle}
                            disabled={saving}
                        >
                            {isEditing ? (saving ? "Saving..." : "Save") : "Edit Profile"}
                        </Button>
                    )}
                    {isEditing && (
                        <Button
                            startIcon={<CancelIcon />}
                            color="error"
                            onClick={() => setIsEditing(false)}
                            sx={{ ml: 2 }}
                        >
                            Cancel
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Box sx={{ overflowY: 'auto', flexGrow: 1, pb: 4 }}>
                {/* Banner */}
                <Box sx={{
                    height: { xs: 200, md: 300 },
                    width: '100%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
                    mb: 10
                }} />

                <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
                    <Grid container spacing={4}>
                        {/* Left Column */}
                        <Grid item xs={12} md={4} lg={3}>
                            <Box sx={{ position: 'relative', top: -80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ position: 'relative' }}>
                                    {uploadingImage && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                zIndex: 2,
                                            }}
                                        >
                                            <CircularProgress color="secondary" />
                                        </Box>
                                    )}
                                    <Avatar
                                        src={renderUser.profileImage}
                                        sx={{
                                            width: 160,
                                            height: 160,
                                            border: '6px solid white',
                                            boxShadow: theme.shadows[3],
                                            bgcolor: 'white'
                                        }}
                                    />
                                    {isOwnProfile && !isEditing && (
                                        <>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 10,
                                                    right: 10,
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'primary.dark' },
                                                    boxShadow: 2,
                                                    zIndex: 3 // Ensure above overlay if needed, though usually overlay covers image
                                                }}
                                                onClick={handleImageClick}
                                                disabled={uploadingImage}
                                            >
                                                <CameraAltIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </Box>

                                <Box sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
                                    {isEditing ? (
                                        <Stack spacing={2} sx={{ mt: 2 }}>
                                            <TextField
                                                label="First Name"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                fullWidth
                                                size="small"
                                            />
                                            <TextField
                                                label="Last Name"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                fullWidth
                                                size="small"
                                            />
                                            <TextField
                                                label="Designation"
                                                name="designation"
                                                value={formData.designation}
                                                onChange={handleInputChange}
                                                fullWidth
                                                size="small"
                                            />
                                        </Stack>
                                    ) : (
                                        <>
                                            <Typography variant="h4" fontWeight="800" gutterBottom>
                                                {renderUser.firstName} {renderUser.lastName}
                                                {isOwnProfile && !isEditing && (
                                                    <IconButton size="small" onClick={handleEditToggle} sx={{ ml: 1 }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Typography>
                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                @{renderUser.username}
                                            </Typography>
                                            <Chip label={renderUser.designation || 'Member'} color="primary" variant="filled" sx={{ fontWeight: 'bold', px: 2, py: 2.5, borderRadius: 2, mt: 1 }} />
                                        </>
                                    )}
                                </Box>

                                {/* Intro / Quick Details */}
                                <Paper elevation={0} variant="outlined" sx={{ width: '100%', mt: 4, p: 3, borderRadius: 4, bgcolor: 'white' }}>
                                    <Stack spacing={2}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1" fontWeight="bold">Intro</Typography>
                                            {isOwnProfile && !isEditing && <IconButton size="small" onClick={handleEditToggle}><EditIcon fontSize="small" /></IconButton>}
                                        </Box>

                                        {isEditing ? (
                                            <>
                                                <LocationAutocomplete
                                                    value={formData.location}
                                                    onChange={handleLocationChange}
                                                />
                                                <TextField
                                                    label="Website"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleInputChange}
                                                    fullWidth
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position="start"><LanguageIcon fontSize="small" /></InputAdornment>,
                                                    }}
                                                />
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Experience Level</InputLabel>
                                                    <Select
                                                        value={formData.expType}
                                                        label="Experience Level"
                                                        onChange={handleExpTypeChange}
                                                    >
                                                        {EXPERIENCE_LEVELS.map(level => (
                                                            <MenuItem key={level} value={level}>{level}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </>
                                        ) : (
                                            <>
                                                {renderUser.dob && (
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <CakeIcon color="action" fontSize="small" />
                                                        <Typography variant="body2">Born {renderUser.dob}</Typography>
                                                    </Stack>
                                                )}
                                                {renderUser.location && (
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <PlaceIcon color="action" fontSize="small" />
                                                        <Typography variant="body2">{renderUser.location}</Typography>
                                                    </Stack>
                                                )}
                                                {renderUser.website && (
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <LanguageIcon color="action" fontSize="small" />
                                                        <Typography variant="body2" component="a" href={renderUser.website} target="_blank" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                                                            {renderUser.website}
                                                        </Typography>
                                                    </Stack>
                                                )}
                                                {renderUser.expType && (
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <WorkIcon color="action" fontSize="small" />
                                                        <Typography variant="body2">{renderUser.expType}</Typography>
                                                    </Stack>
                                                )}
                                            </>
                                        )}
                                    </Stack>
                                </Paper>
                            </Box>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} md={8} lg={9} sx={{ mt: { xs: -6, md: 4 } }}>
                            <Box sx={{ pb: 8 }}>
                                {/* About */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h5" fontWeight="bold">About</Typography>
                                        {isOwnProfile && !isEditing && <IconButton onClick={handleEditToggle}><EditIcon /></IconButton>}
                                    </Box>
                                    {isEditing ? (
                                        <TextField
                                            name="about"
                                            value={formData.about}
                                            onChange={handleInputChange}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            placeholder="Tell us about yourself..."
                                        />
                                    ) : (
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                                            {renderUser.about || 'No about information available.'}
                                        </Typography>
                                    )}
                                </Paper>

                                {/* Contact */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                        <Typography variant="h5" fontWeight="bold">Contact Information</Typography>
                                        {isOwnProfile && !isEditing && <IconButton onClick={handleEditToggle}><EditIcon /></IconButton>}
                                    </Box>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <EmailIcon color="primary" />
                                                    <Typography variant="caption" color="text.secondary">Email Address</Typography>
                                                </Stack>
                                                <Typography variant="body1" fontWeight="medium">{renderUser.email}</Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <PhoneIcon color="primary" />
                                                    <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                                                </Stack>
                                                {isEditing ? (
                                                    <TextField
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        size="small"
                                                        fullWidth
                                                        placeholder="+1 234 567 890"
                                                    />
                                                ) : (
                                                    <Typography variant="body1" fontWeight="medium">{renderUser.phone || 'N/A'}</Typography>
                                                )}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* Skills */}
                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h5" fontWeight="bold">Skills</Typography>
                                        {isOwnProfile && !isEditing && <IconButton onClick={handleEditToggle}><EditIcon /></IconButton>}
                                    </Box>

                                    {isEditing ? (
                                        <SkillAutocomplete
                                            value={formData.skills}
                                            onChange={handleSkillsChange}
                                        />
                                    ) : (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {renderUser.skills && renderUser.skills.length > 0 ? (
                                                renderUser.skills.map((skill, index) => (
                                                    <Chip key={index} label={skill} color="primary" variant="outlined" sx={{ borderRadius: 2 }} />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">No skills listed.</Typography>
                                            )}
                                        </Box>
                                    )}
                                </Paper>

                                {/* Activity */}
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
                                            <Typography variant="body1" color="text.secondary">No recent activity.</Typography>
                                        )}
                                    </Grid>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Dialog >
    );
};

export default ProfileDialog;
