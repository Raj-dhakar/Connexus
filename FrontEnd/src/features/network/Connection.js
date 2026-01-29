import React, { useState, useEffect } from 'react'
import connectionApi from '../../api/connectionApi'
import { Avatar, Button, List, ListItem, ListItemText, Paper } from '@mui/material'
import { useLocation } from 'react-router-dom'

function Connection() {

    // const location = useLocation()
    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await connectionApi.getOtherPeople();
                const data = Array.isArray(response.data) ? response.data : response.data.data || [];
                setUserData(prevData => {
                    // Simple de-duplication or just overwrite if it's a full refresh. 
                    // Since we want "real-time" new users, overwriting is simplest, 
                    // but we should avoid flickering if possible. 
                    // For now, simple overwrite is standard for this type of polling unless complex merging is needed.
                    // However, to keep the "removed" ones removed until next fetch might be tricky if fetch happens *before* change propagate.
                    // But usually API returns fresh list. 
                    return data;
                });
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();

        // Poll every 5 seconds
        const intervalId = setInterval(fetchRecommendations, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const sendRequest = async (userId) => {
        try {
            // Optimistically remove user from list immediately
            setUserData(prevUserData => prevUserData.filter(user => {
                const currentId = user.userId || user.id;
                return currentId !== userId;
            }));

            await connectionApi.sendConnectionRequest(userId);
            console.log(`Request sent to user ${userId}`)
        } catch (error) {
            console.error("Failed to send request", error);
            // Optionally revert logical deletion here if needed, but for MVP just log error
        }
    }


    if (loading) return <div>Loading recommendations...</div>;

    if (userData.length === 0) return <div style={{ padding: "20px", textAlign: "center" }}>No suggestions available.</div>;

    return (
        <div style={{ padding: "20px", backgroundColor: "#F6F7F3", height: "100vh" }}>
            <div style={{ fontWeight: "bold", marginBottom: "10px", color: "#666" }}>People you may know</div>
            {userData.map((otherUser) => {
                return (
                    <Paper key={otherUser.id || otherUser.userId} sx={{ mb: 2 }}>
                        <List>
                            <ListItem>
                                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                    {otherUser.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
                                </Avatar>
                                <ListItemText
                                    primary={otherUser.name || otherUser.username || "Unknown"}
                                    secondary={otherUser.role || otherUser.designation || "Member"}
                                    sx={{ ml: 2 }}
                                />
                                <Button onClick={() => sendRequest(otherUser.userId || otherUser.id)} variant='outlined' size="small">Connect</Button>
                            </ListItem>
                        </List>
                    </Paper>
                )
            })}
        </div>
    )
}

export default Connection
