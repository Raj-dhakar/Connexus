import React, { useState, useEffect } from 'react';
import {
    Button,
    Grid,
    Typography,
    Avatar,
    Box,
    Card,
    CardContent,
    CardActions,
    Container,
    useTheme
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Message as MessageIcon } from '@mui/icons-material';
import connectionApi from '../../api/connectionApi';
import UserAvatar from '../common/UserAvatar';
import useAuth from '../auth/useAuth';
import Navbar from '../layout/Navbar';

function Network() {
    const location = useLocation();
    const theme = useTheme();
    const { user } = useAuth(); // Get user from auth context

    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await connectionApi.getFirstDegreeConnections();
                // Check if response.data is the list or response.data.data
                const data = Array.isArray(response.data) ? response.data : response.data.data || [];
                setConnections(data);
            } catch (error) {
                console.error("Failed to fetch connections", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();

        // Poll every 5 seconds
        const intervalId = setInterval(fetchConnections, 5000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 12 }}>
            {user && <Navbar userData={user} />}
            <Box sx={{ p: 4 }}>
                <Container maxWidth="lg">
                    {/* Invitation component removed as per request */}
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: 'text.primary' }}>
                        My Network
                    </Typography>

                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : connections.length === 0 ? (
                        <Typography color="text.secondary">No connections found.</Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {connections.map((person) => (
                                <Grid item xs={12} sm={6} md={4} key={person.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                                        <UserAvatar
                                            userId={person.userId}
                                            name={person.name}
                                            sx={{ width: 80, height: 80, mb: 2, border: `3px solid ${theme.palette.background.paper}`, boxShadow: theme.shadows[2], bgcolor: theme.palette.primary.main, fontSize: '2rem' }}
                                        />
                                        <CardContent sx={{ textAlign: 'center', p: 0, mb: 2 }}>
                                            <Typography variant="h6" component="div" fontWeight="bold">
                                                {person.name || 'Unknown User'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {person.role || 'Member'}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ width: '100%', justifyContent: 'center' }}>
                                            <Button
                                                component={Link}
                                                to="/message"
                                                state={{
                                                    currentUserName: location.state?.currentUserName,
                                                    currentProImg: location.state?.currentUserProImg,
                                                    username: person.name,
                                                    id: person.userId, // Use userId for messaging/profile context
                                                    profile_image: null // No image from connection service
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
                    )}
                </Container>
            </Box>
        </Box>
    )
}

export default Network;
