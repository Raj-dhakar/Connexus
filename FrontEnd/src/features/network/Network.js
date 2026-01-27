import React, { useState } from 'react';
import {
    Button,
    Grid,
    Paper,
    Typography,
    Avatar,
    Box,
    Card,
    CardContent,
    CardActions,
    Container,
    useTheme
} from '@mui/material';
import Navbar from '../layout/Navbar';
import { Link, useLocation } from 'react-router-dom';
import { Message as MessageIcon } from '@mui/icons-material';

function Network() {
    const location = useLocation();
    const theme = useTheme();

    // Mock data - in a real app this would come from an API
    const [user] = useState([
        {
            id: "1",
            username: "Elon Musk",
            designation: "CEO of Tesla",
            profile_image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg",
            status: "connected"
        },
        {
            id: "2",
            username: "Bill Gates",
            designation: "Co-founder of Microsoft",
            profile_image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg",
            status: "connected"
        }
    ]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Assuming Navbar should be here if it's a page, mostly it's wrapped in Main or separately */}
            {/* If Network is a standalone route without Main layout, we might need Navbar. 
                Based on App.js, /network is a standalone route. So adding Navbar here or relying on Main layout wrapper.
                For now, I'll check if location.state has user info to pass to Navbar if I were to add it, 
                but usually Navbar retrieval is from Auth Context. 
            */}
            <Box sx={{ p: 4 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: 'text.primary' }}>
                        My Network
                    </Typography>

                    <Grid container spacing={3}>
                        {user.filter(user => user.status === "connected").map((eachUser) => (
                            <Grid item xs={12} sm={6} md={4} key={eachUser.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                                    <Avatar
                                        src={eachUser.profile_image}
                                        sx={{ width: 80, height: 80, mb: 2, border: `3px solid ${theme.palette.background.paper}`, boxShadow: theme.shadows[2] }}
                                    />
                                    <CardContent sx={{ textAlign: 'center', p: 0, mb: 2 }}>
                                        <Typography variant="h6" component="div" fontWeight="bold">
                                            {eachUser.username}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {eachUser.designation}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            component={Link}
                                            to="/message"
                                            state={{
                                                currentUserName: location.state?.currentUserName,
                                                currentProImg: location.state?.currentUserProImg,
                                                username: eachUser.username,
                                                id: eachUser.id,
                                                profile_image: eachUser.profile_image
                                            }}
                                            variant="outlined"
                                            startIcon={<MessageIcon />}
                                            fullWidth
                                            size="small"
                                        >
                                            Message
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}

export default Network;
