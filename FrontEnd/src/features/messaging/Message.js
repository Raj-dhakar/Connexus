import React, { useState, useEffect, useRef } from 'react';
import {
    Avatar,
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
    useTheme,
    CircularProgress,
    Badge
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import connectionApi from '../../api/connectionApi';
import messagingApi from '../../api/messagingApi';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function Message() {
    const theme = useTheme();
    const { user: currentUser } = useAuth();
    const location = useLocation();

    // State
    const [connections, setConnections] = useState([]);
    const [activeChatUser, setActiveChatUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [isLoadingConnections, setIsLoadingConnections] = useState(true);
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});

    // Refs
    const messagesEndRef = useRef(null);
    const activeChatUserRef = useRef(activeChatUser);

    // Update Ref whenever state changes
    useEffect(() => {
        activeChatUserRef.current = activeChatUser;
    }, [activeChatUser]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 1. Fetch Connections
    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await connectionApi.getFirstDegreeConnections();
                // console.log("Response Message: " + JSON.stringify(response));
                let conns = [];
                if (Array.isArray(response.data)) {
                    conns = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    conns = response.data.data;
                }
                setConnections(conns);

                // If redirected from Profile with a specific user, select them
                if (location.state?.userId) {
                    // Match by userId (preferred) or id
                    const targetUser = conns.find(c =>
                        String(c.userId) === String(location.state.userId) ||
                        String(c.id) === String(location.state.userId)
                    );
                    if (targetUser) {
                        setActiveChatUser(targetUser);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch connections", error);
            } finally {
                setIsLoadingConnections(false);
            }
        };
        if (currentUser) {
            fetchConnections();
        }
    }, [currentUser, location.state]);

    // Fetch Unread Counts
    useEffect(() => {
        const fetchUnread = async () => {
            if (currentUser) {
                try {
                    const myId = currentUser.id || currentUser.user_id || currentUser.userId;
                    const response = await messagingApi.getUnreadCounts(myId);
                    setUnreadCounts(response.data || {});
                } catch (error) {
                    console.error("Failed to fetch unread counts", error);
                }
            }
        };
        fetchUnread();
    }, [currentUser]);

    // 2. WebSocket Connection
    useEffect(() => {
        if (!currentUser) return;

        const client = Stomp.over(() => new SockJS('http://localhost:9090/ws'));

        // Disable debug logs if too noisy
        client.debug = () => { };

        client.connect({}, () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
            const myId = currentUser.id || currentUser.user_id || currentUser.userId;
            client.subscribe(`/queue/messages/${myId}`, (payload) => {
                const newMessage = JSON.parse(payload.body);
                handleIncomingMessage(newMessage, myId);
            });
        }, (err) => {
            console.error("WebSocket connection error:", err);
            setIsConnected(false);
        });

        setStompClient(client);

        return () => {
            if (client) {
                try {
                    client.disconnect();
                } catch (e) {
                    console.error("Error disconnecting", e);
                }
            }
            setIsConnected(false);
        };
    }, [currentUser]);

    const handleIncomingMessage = (newMessage, myId) => {
        const currentActive = activeChatUserRef.current;
        const activeId = currentActive?.userId || currentActive?.id;

        // Condition to append message:
        // 1. Sender is the active chat user
        // 2. OR Sender is ME (Echo) AND Recipient is active chat user

        const isFromActiveUser = activeId && (String(newMessage.senderId) === String(activeId));
        const isEchoToActiveUser = activeId && (String(newMessage.senderId) === String(myId)) && (String(newMessage.recipientId) === String(activeId));

        if (isFromActiveUser || isEchoToActiveUser) {
            setMessages(prev => [...prev, newMessage]);
        } else if (!isEchoToActiveUser) {
            // Message from someone else (or not active), increment unread count
            const senderId = newMessage.senderId;
            setUnreadCounts(prev => ({
                ...prev,
                [senderId]: (prev[senderId] || 0) + 1
            }));
        }
    };

    // 3. Fetch History on Active User Change
    useEffect(() => {
        if (!activeChatUser || !currentUser) return;

        const fetchHistory = async () => {
            try {
                const myId = currentUser.id || currentUser.user_id || currentUser.userId;
                const otherId = activeChatUser.userId || activeChatUser.id;
                const response = await messagingApi.getChatHistory(myId, otherId);
                if (response.data) {
                    setMessages(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();
    }, [activeChatUser, currentUser]);

    // Mark as read when opening chat
    useEffect(() => {
        if (activeChatUser && currentUser) {
            const myId = currentUser.id || currentUser.user_id || currentUser.userId;
            const otherId = activeChatUser.userId || activeChatUser.id;

            // If we have unread messages from this user, mark them as read
            if (unreadCounts[otherId] > 0) {
                messagingApi.markMessagesAsRead(myId, otherId)
                    .then(() => {
                        setUnreadCounts(prev => {
                            const newCounts = { ...prev };
                            delete newCounts[otherId];
                            return newCounts;
                        });
                    })
                    .catch(err => console.error("Failed to mark as read", err));
            }
        }
    }, [activeChatUser, currentUser, unreadCounts]);

    // Send Message
    const sendMessage = () => {
        if (!messageInput.trim() || !stompClient || !activeChatUser || !isConnected) {
            console.warn("Cannot send: Connection not ready or invalid input");
            return;
        }

        const myId = currentUser.id || currentUser.user_id || currentUser.userId;
        const otherId = activeChatUser.userId || activeChatUser.id;

        const chatMessage = {
            senderId: myId,
            recipientId: otherId,
            content: messageInput,
            timestamp: new Date()
        };

        try {
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
            setMessageInput("");
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <Box sx={{ height: '90vh', bgcolor: 'background.default', pt: 2, pb: 2 }}>
            <Container maxWidth="xl" sx={{ height: '100%' }}>
                <Grid container spacing={2} sx={{ height: '100%' }}>
                    {/* Sidebar */}
                    <Grid item xs={12} md={4} lg={3} sx={{ height: '100%' }}>
                        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="h6" fontWeight="bold">Messages</Typography>
                            </Box>
                            <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
                                {connections.map((conn) => (
                                    <ListItem
                                        button
                                        key={conn.userId || conn.id}
                                        selected={activeChatUser && (String(activeChatUser.userId) === String(conn.userId))}
                                        onClick={() => setActiveChatUser(conn)}
                                    >
                                        <ListItemAvatar>
                                            <Badge badgeContent={unreadCounts[conn.userId || conn.id]} color="error">
                                                <Avatar src={conn.profileImage || conn.profile_image} />
                                            </Badge>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={conn.name || `${conn.firstName} ${conn.lastName}`}
                                            secondary={conn.designation || ""}
                                            primaryTypographyProps={{ fontWeight: 'medium' }}
                                        />
                                    </ListItem>
                                ))}
                                {connections.length === 0 && !isLoadingConnections && (
                                    <Box p={2} textAlign="center">
                                        <Typography variant="body2" color="text.secondary">No connected users yet.</Typography>
                                    </Box>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Chat Area */}
                    <Grid item xs={12} md={8} lg={9} sx={{ height: '100%' }}>
                        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {activeChatUser ? (
                                <>
                                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={activeChatUser.profileImage || activeChatUser.profile_image} sx={{ mr: 2 }} />
                                        <Typography variant="h6">{activeChatUser.name || `${activeChatUser.firstName} ${activeChatUser.lastName}`}</Typography>
                                    </Box>

                                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc' }}>
                                        {messages.map((msg, index) => {
                                            const myId = currentUser?.id || currentUser?.user_id || currentUser?.userId;
                                            const isMe = String(msg.senderId) === String(myId);
                                            return (
                                                <Box key={index} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
                                                    <Paper sx={{
                                                        p: 2,
                                                        bgcolor: isMe ? 'primary.main' : 'white',
                                                        color: isMe ? 'white' : 'text.primary',
                                                        borderRadius: 2,
                                                        maxWidth: '70%',
                                                        boxShadow: 1
                                                    }}>
                                                        <Typography variant="body1">{msg.content}</Typography>
                                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8, textAlign: 'right' }}>
                                                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                        </Typography>
                                                    </Paper>
                                                </Box>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </Box>

                                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                                        <Grid container spacing={1}>
                                            <Grid item xs>
                                                <TextField
                                                    fullWidth
                                                    placeholder="Type a message..."
                                                    size="small"
                                                    value={messageInput}
                                                    onChange={(e) => setMessageInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                                    InputProps={{ sx: { borderRadius: 4 } }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <IconButton color="primary" onClick={sendMessage} disabled={!messageInput.trim()}>
                                                    <SendIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', flexDirection: 'column' }}>
                                    <SendIcon sx={{ fontSize: 60, opacity: 0.2, mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">Select a connection to start messaging</Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Message;
