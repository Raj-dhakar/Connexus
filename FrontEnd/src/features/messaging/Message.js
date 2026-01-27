import React, { useState } from 'react';
import {
    Avatar,
    Button,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    TextField,
    Typography,
    Box,
    Container,
    IconButton,
    Divider,
    useTheme
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

function Message() {
    const location = useLocation();
    const theme = useTheme();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            user: "Elon Musk",
            text: "Welcome to Connexus!",
            profile_image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg"
        }
    ]);

    const sendMessage = () => {
        if (!message.trim()) return;
        setMessages([...messages, {
            user: location.state?.currentUserName || "Me",
            text: message,
            profile_image: location.state?.currentProImg
        }]);
        setMessage("");
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 3, pb: 3 }}>
            <Container maxWidth="xl">
                <Grid container spacing={3} sx={{ height: '85vh' }}>
                    {/* Sidebar / Chat List */}
                    <Grid item xs={12} md={4} lg={3} sx={{ height: '100%', display: { xs: 'none', md: 'block' } }}>
                        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                                <Typography variant="h6" fontWeight="bold">Messaging</Typography>
                            </Box>
                            <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
                                <ListItem button selected>
                                    <ListItemAvatar>
                                        <Avatar src={location.state?.profile_image} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={location.state?.username || "Elon Musk"}
                                        secondary="Last active: 5m ago"
                                        primaryTypographyProps={{ fontWeight: 600 }}
                                    />
                                </ListItem>
                                {/* More mock items could go here */}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Chat Area */}
                    <Grid item xs={12} md={8} lg={9} sx={{ height: '100%' }}>
                        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Chat Header */}
                            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center' }}>
                                <Avatar src={location.state?.profile_image} sx={{ mr: 2 }} />
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {location.state?.username || "Elon Musk"}
                                </Typography>
                            </Box>

                            {/* Messages */}
                            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc' }}>
                                {messages.map((msg, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: msg.user === (location.state?.currentUserName || "Me") ? 'flex-end' : 'flex-start',
                                            mb: 2
                                        }}
                                    >
                                        {msg.user !== (location.state?.currentUserName || "Me") && (
                                            <Avatar src={msg.profile_image} sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }} />
                                        )}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: '10px 16px',
                                                bgcolor: msg.user === (location.state?.currentUserName || "Me") ? 'primary.main' : 'white',
                                                color: msg.user === (location.state?.currentUserName || "Me") ? 'white' : 'text.primary',
                                                borderRadius: 2,
                                                maxWidth: '75%',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <Typography variant="body1">{msg.text}</Typography>
                                        </Paper>
                                    </Box>
                                ))}
                            </Box>

                            {/* Input Area */}
                            <Box sx={{ p: 2, bgcolor: 'white', borderTop: `1px solid ${theme.palette.divider}` }}>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item xs>
                                        <TextField
                                            fullWidth
                                            placeholder="Type a message..."
                                            variant="outlined"
                                            size="small"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                            InputProps={{ sx: { borderRadius: 20 } }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <IconButton color="primary" onClick={sendMessage} disabled={!message.trim()}>
                                            <SendIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Message;
