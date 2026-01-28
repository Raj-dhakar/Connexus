import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import ProfileDialog from './ProfileDialog';

const TestProfile = () => {
    const [open, setOpen] = useState(false);

    // Dummy user data based on UserDto
    const dummyUser = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        dob: "1990-01-01",
        email: "john.doe@example.com",
        role: "RECRUITER", // or USER
        website: "https://johndoe.dev",
        phone: "+1 234 567 8900",
        username: "johndoe",
        designation: "Senior Software Engineer",
        profileImage: "https://mui.com/static/images/avatar/1.jpg" // using MUI placeholder
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Profile Dialog Test
            </Typography>
            <Button variant="contained" onClick={handleOpen}>
                View Profile
            </Button>

            <ProfileDialog
                open={open}
                onClose={handleClose}
                user={dummyUser}
            />
        </Box>
    );
};

export default TestProfile;
