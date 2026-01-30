import React, { useState, useEffect, useRef } from 'react';
import {
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
    Badge,
    Skeleton,
    Menu,
    MenuItem,
    ListItemIcon
} from '@mui/material';
import {
    Send as SendIcon,
    SentimentSatisfiedAlt as EmptyChatIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Reply as ReplyIcon,
    ContentCopy as CopyIcon,
    Close as CloseIcon,
    AddReaction as AddReactionIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import connectionApi from '../../api/connectionApi';
import messagingApi from '../../api/messagingApi';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import UserAvatar from '../common/UserAvatar';

function Message() {
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

    // Action State
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [reactionMenu, setReactionMenu] = useState(null); // { anchorEl, message }

    const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

    // Refs
    const messagesEndRef = useRef(null);
    const activeChatUserRef = useRef(activeChatUser);
    const messagesStateRef = useRef(messages);

    // Update Ref whenever state changes
    useEffect(() => {
        activeChatUserRef.current = activeChatUser;
    }, [activeChatUser]);

    useEffect(() => {
        messagesStateRef.current = messages;
    }, [messages]);

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

        const onMessageReceived = (payload) => {
            const newMessage = JSON.parse(payload.body);
            const myId = currentUser.id || currentUser.user_id || currentUser.userId;

            const currentActive = activeChatUserRef.current;
            const activeId = currentActive?.userId || activeChatUserRef.current?.id;

            const isFromActiveUser = activeId && (String(newMessage.senderId) === String(activeId));
            const isEchoToActiveUser = activeId && (String(newMessage.senderId) === String(myId)) && (String(newMessage.recipientId) === String(activeId));

            setMessages(prev => {
                const existingIndex = prev.findIndex(m => m.id === newMessage.id);
                if (existingIndex !== -1) {
                    // Update existing message (Edit or Delete)
                    const updated = [...prev];
                    updated[existingIndex] = newMessage;
                    return updated;
                } else {
                    // New Message
                    if (isFromActiveUser || isEchoToActiveUser) {
                        return [...prev, newMessage];
                    }
                    return prev;
                }
            });

            if (!isEchoToActiveUser && !isFromActiveUser) {
                const senderId = newMessage.senderId;
                // Check using Ref to avoid dependency loop
                if (messagesStateRef.current && !messagesStateRef.current.some(m => m.id === newMessage.id)) {
                    setUnreadCounts(prev => ({
                        ...prev,
                        [senderId]: (prev[senderId] || 0) + 1
                    }));
                }
            }
        };

        client.connect({}, () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
            const myId = currentUser.id || currentUser.user_id || currentUser.userId;
            client.subscribe(`/queue/messages/${myId}`, onMessageReceived);
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

    // Context Menu Handlers
    const handleContextMenu = (event, msg) => {
        event.preventDefault();
        setSelectedMessage(msg);
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : null,
        );
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleReactionClick = (event) => {
        // Switch from main context menu to reaction menu
        const anchorEl = event.currentTarget; // or use context menu position?
        // Actually, let's just close context menu and open reaction menu at the same position or center?
        // Simplest: Open reaction menu at the location of the context menu click
        setContextMenu(null);
        setReactionMenu({
            mouseX: contextMenu.mouseX,
            mouseY: contextMenu.mouseY,
            message: selectedMessage
        });
    };

    const handleCloseReactionMenu = () => {
        setReactionMenu(null);
    };

    const handleReactionSelect = (emoji) => {
        const msg = reactionMenu.message;
        const myId = currentUser.id || currentUser.user_id || currentUser.userId;

        handleCloseReactionMenu();

        if (msg) {
            messagingApi.reactToMessage(msg.id, myId, emoji)
                .catch(err => console.error("Failed to react", err));
        }
    };

    const handleEmojiDoubleClick = (msg, emoji) => {
        const myId = currentUser.id || currentUser.user_id || currentUser.userId;
        // Backend toggles if same reaction exists, so just sending it again removes it.
        // We logic check: if the user actually HAS this reaction, send it to remove.
        // If they don't have it, sending it adds it (which is also fine behavior for interaction, but strictly "remove" requested).
        // Let's just call the endpoint, behaving as a toggle.
        messagingApi.reactToMessage(msg.id, myId, emoji)
            .catch(err => console.error("Failed to remove reaction", err));
    };

    const handleAction = (action) => {
        const msg = selectedMessage;
        handleCloseContextMenu();
        if (!msg) return;

        switch (action) {
            case 'copy':
                navigator.clipboard.writeText(msg.content || "");
                break;
            case 'reply':
                setReplyingTo(msg);
                setEditingMessage(null);
                // Input focus handled by React effectively or user clicks
                break;
            case 'edit':
                setEditingMessage(msg);
                setReplyingTo(null);
                setMessageInput(msg.content);
                break;
            case 'delete':
                if (window.confirm("Delete this message?")) {
                    messagingApi.deleteMessage(msg.id)
                        .catch(err => console.error("Failed to delete", err));
                }
                break;
            case 'react':
                // Handled specifically in MenuItem, but good to have safety
                break;
            default:
                break;
        }
    };

    const cancelAction = () => {
        setReplyingTo(null);
        setEditingMessage(null);
        setMessageInput("");
    };

    // Send Message
    const sendMessage = () => {
        if (!messageInput.trim() || !stompClient || !activeChatUser || !isConnected) {
            return;
        }

        const myId = currentUser.id || currentUser.user_id || currentUser.userId;
        const otherId = activeChatUser.userId || activeChatUser.id;

        if (editingMessage) {
            // Edit Mode
            messagingApi.editMessage(editingMessage.id, messageInput)
                .then(() => {
                    setEditingMessage(null);
                    setMessageInput("");
                })
                .catch(err => console.error("Failed to edit", err));
            return;
        }

        const chatMessage = {
            senderId: myId,
            recipientId: otherId,
            content: messageInput,
            timestamp: new Date(),
            replyToId: replyingTo ? replyingTo.id : null,
            replyToContent: replyingTo ? replyingTo.content : null
        };

        try {
            stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
            setMessageInput("");
            setReplyingTo(null);
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
                                {isLoadingConnections ? (
                                    // Shimmer Loading Effect
                                    Array.from(new Array(5)).map((_, index) => (
                                        <ListItem key={index}>
                                            <ListItemAvatar>
                                                <Skeleton variant="circular" width={40} height={40} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Skeleton variant="text" width="60%" />}
                                                secondary={<Skeleton variant="text" width="40%" />}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    connections.map((conn) => (
                                        <ListItem
                                            button
                                            key={conn.userId || conn.id}
                                            selected={activeChatUser && (String(activeChatUser.userId) === String(conn.userId))}
                                            onClick={() => setActiveChatUser(conn)}
                                        >
                                            <ListItemAvatar>
                                                <Badge badgeContent={unreadCounts[conn.userId || conn.id]} color="error">
                                                    <UserAvatar userId={conn.userId || conn.id} name={conn.name} />
                                                </Badge>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={conn.name || `${conn.firstName} ${conn.lastName}`}
                                                secondary={conn.designation || ""}
                                                primaryTypographyProps={{ fontWeight: 'medium' }}
                                            />
                                        </ListItem>
                                    ))
                                )}
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
                                        <UserAvatar userId={activeChatUser.userId || activeChatUser.id} name={activeChatUser.name} sx={{ mr: 2 }} />
                                        <Typography variant="h6">{activeChatUser.name || `${activeChatUser.firstName} ${activeChatUser.lastName}`}</Typography>
                                    </Box>

                                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                                        {messages.length === 0 ? (
                                            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
                                                <EmptyChatIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.5 }} />
                                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                                    No messages yet
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
                                                    Start the conversation with {activeChatUser.name || activeChatUser.firstName}!
                                                    Say meaningful things.
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <>
                                                {messages.map((msg, index) => {
                                                    const myId = currentUser?.id || currentUser?.user_id || currentUser?.userId;
                                                    const isMe = String(msg.senderId) === String(myId);
                                                    const isDeleted = msg.status === 'DELETED';
                                                    return (
                                                        <Box key={index} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', mb: 2 }}>
                                                            <Paper
                                                                onContextMenu={(e) => handleContextMenu(e, msg)}
                                                                elevation={isDeleted ? 0 : 2}
                                                                sx={{
                                                                    p: 1.5,
                                                                    minWidth: '120px',
                                                                    background: isMe
                                                                        ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                                                                        : '#ffffff',
                                                                    color: isMe ? '#fff' : 'text.primary',
                                                                    borderRadius: 2,
                                                                    borderBottomRightRadius: isMe ? 0 : 2,
                                                                    borderTopLeftRadius: !isMe ? 0 : 2,
                                                                    maxWidth: '75%',
                                                                    boxShadow: isDeleted ? 'none' : (isMe ? 2 : 1),
                                                                    opacity: isDeleted ? 0.7 : 1,
                                                                    fontStyle: isDeleted ? 'italic' : 'normal',
                                                                    cursor: 'context-menu',
                                                                    position: 'relative'
                                                                }}>
                                                                {isDeleted ? (
                                                                    <Typography variant="body2" color="text.secondary" sx={{ color: isMe ? 'inherit' : 'text.secondary' }}>
                                                                        This message was deleted
                                                                    </Typography>
                                                                ) : (
                                                                    <>
                                                                        {msg.replyToContent && (
                                                                            <Box sx={{
                                                                                pl: 1,
                                                                                mb: 1,
                                                                                borderLeft: `3px solid ${isMe ? 'rgba(255,255,255,0.5)' : '#1976d2'}`,
                                                                                bgcolor: isMe ? 'rgba(0,0,0,0.1)' : 'rgba(25, 118, 210, 0.08)',
                                                                                borderRadius: 1,
                                                                                py: 0.5,
                                                                                pr: 1
                                                                            }}>
                                                                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', mb: 0.3, opacity: 0.9 }}>
                                                                                    Reply to:
                                                                                </Typography>
                                                                                <Typography variant="body2" noWrap sx={{ opacity: 0.85, fontSize: '0.8rem' }}>
                                                                                    {msg.replyToContent}
                                                                                </Typography>
                                                                            </Box>
                                                                        )}
                                                                        <Typography variant="body1" sx={{ lineHeight: 1.4 }}>{msg.content}</Typography>
                                                                    </>
                                                                )}
                                                                <Typography variant="caption" sx={{
                                                                    display: 'block',
                                                                    mt: 0.5,
                                                                    opacity: 0.7,
                                                                    fontSize: '0.7rem',
                                                                    textAlign: 'right'
                                                                }}>
                                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                                    {msg.edited && !isDeleted && " (edited)"}
                                                                </Typography>

                                                                {/* Reactions Display */}
                                                                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        gap: 0.5,
                                                                        position: 'absolute',
                                                                        bottom: -15, // Adjusted to hang slightly lower
                                                                        right: isMe ? 0 : 'auto', // Align with edge
                                                                        left: isMe ? 'auto' : 0,
                                                                        px: 0.5,
                                                                        py: 0,
                                                                        zIndex: 1,
                                                                        // Removed background, shadow, border
                                                                    }}>
                                                                        {Array.from(new Set(Object.values(msg.reactions))).map((emoji, idx) => (
                                                                            <Typography
                                                                                key={idx}
                                                                                variant="caption"
                                                                                sx={{ fontSize: '1.2rem', lineHeight: 1, cursor: 'pointer', userSelect: 'none' }}
                                                                                onDoubleClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleEmojiDoubleClick(msg, emoji);
                                                                                }}
                                                                            >
                                                                                {emoji}
                                                                            </Typography>
                                                                        ))}
                                                                        {(Object.keys(msg.reactions).length > 1) && (
                                                                            <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', ml: 0.5, alignSelf: 'center', textShadow: '0 0 2px white' }}>
                                                                                {Object.keys(msg.reactions).length}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                )}
                                                            </Paper>
                                                        </Box>
                                                    );
                                                })}
                                                <div ref={messagesEndRef} />
                                            </>
                                        )}
                                    </Box>

                                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                                        {/* Reply/Edit Banner */}
                                        {(replyingTo || editingMessage) && (
                                            <Box sx={{ mb: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                    <Typography variant="caption" color="primary" fontWeight="bold">
                                                        {replyingTo ? "Replying to:" : "Editing message:"}
                                                    </Typography>
                                                    <Typography variant="body2" noWrap color="text.secondary">
                                                        {replyingTo ? replyingTo.content : (editingMessage ? "..." : "")}
                                                    </Typography>
                                                </Box>
                                                <IconButton size="small" onClick={cancelAction}>
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        )}
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

            {/* Context Menu */}
            <Menu
                open={contextMenu !== null}
                onClose={handleCloseContextMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={() => handleAction('copy')}>
                    <ListItemIcon><CopyIcon fontSize="small" /></ListItemIcon>
                    Copy
                </MenuItem>
                <MenuItem onClick={() => handleAction('reply')}>
                    <ListItemIcon><ReplyIcon fontSize="small" /></ListItemIcon>
                    Reply
                </MenuItem>
                {selectedMessage && currentUser && (String(selectedMessage.senderId) === String(currentUser.id || currentUser.user_id || currentUser.userId)) && (
                    <MenuItem onClick={() => handleAction('edit')}>
                        <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                        Edit
                    </MenuItem>
                )}
                {selectedMessage && currentUser && (String(selectedMessage.senderId) === String(currentUser.id || currentUser.user_id || currentUser.userId)) && (
                    <MenuItem onClick={() => handleAction('delete')}>
                        <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
                        Delete
                    </MenuItem>
                )}
                <MenuItem onClick={handleReactionClick}>
                    <ListItemIcon><AddReactionIcon fontSize="small" /></ListItemIcon>
                    React...
                </MenuItem>
            </Menu>

            {/* Reaction Menu */}
            <Menu
                open={reactionMenu !== null}
                onClose={handleCloseReactionMenu}
                anchorReference="anchorPosition"
                anchorPosition={
                    reactionMenu !== null
                        ? { top: reactionMenu.mouseY, left: reactionMenu.mouseX }
                        : undefined
                }
            >
                <div style={{ padding: '0 8px', display: 'flex' }}>
                    {REACTION_EMOJIS.map((emoji) => (
                        <IconButton key={emoji} onClick={() => handleReactionSelect(emoji)} size="small">
                            <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
                        </IconButton>
                    ))}
                </div>
            </Menu>
        </Box >
    );
}

export default Message;
