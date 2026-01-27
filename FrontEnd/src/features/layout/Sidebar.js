import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { motion } from 'framer-motion';

function Sidebar({ userData }) {
    // Gradient banner or use an image
    const bannerImage = "https://source.unsplash.com/random/800x200?technology";

    return (
        <Card
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <CardMedia
                component="img"
                height="80"
                image={bannerImage}
                alt="banner"
                sx={{ backgroundColor: 'primary.main' }} // Fallback color
            />
            <CardContent sx={{ pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -5 }}>
                <Avatar
                    src={userData?.profile_image}
                    sx={{ width: 80, height: 80, border: '4px solid white', mb: 1 }}
                />
                <Typography variant="h6" fontWeight="bold">
                    {userData?.username || "User"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {userData?.designation || "No Designation"}
                </Typography>
            </CardContent>

            <Divider />

            <List disablePadding>
                <ListItemButton
                    component={Link}
                    to="/connect"
                    state={{
                        username: userData?.username,
                        designation: userData?.designation,
                        profile_img: userData?.profile_image
                    }}
                >
                    <PeopleIcon color="action" sx={{ mr: 2 }} />
                    <ListItemText primary="Connections" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/invite"
                    state={{
                        username: userData?.username,
                        designation: userData?.designation,
                        profile_img: userData?.profile_image
                    }}
                >
                    <PersonAddIcon color="action" sx={{ mr: 2 }} />
                    <ListItemText primary="Invitations" primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
                </ListItemButton>
            </List>
        </Card>
    );
}

export default Sidebar;
