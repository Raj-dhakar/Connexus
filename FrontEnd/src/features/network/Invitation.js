import { Avatar, Button, List, ListItem, ListItemText, Paper } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import connectionApi from '../../api/connectionApi'
import UserAvatar from '../common/UserAvatar'

function Invitation({ showEmptyMessage = true }) {

    // const location = useLocation()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await connectionApi.getIncomingRequests();
                const data = Array.isArray(response.data) ? response.data : response.data.data || [];
                setRequests(data);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            } finally {
                setLoading(false)
            }
        };
        fetchRequests();

        // Poll every 5 seconds
        const intervalId = setInterval(fetchRequests, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const deleteReq = async (userToIgnore) => {
        const targetId = userToIgnore.userId || userToIgnore.id;
        try {
            // Optimistic update
            setRequests(prev => prev.filter(u => (u.userId || u.id) !== targetId));
            await connectionApi.rejectConnectionRequest(targetId);
        } catch (error) {
            console.error("Failed to ignore", error);
        }
    }

    const acceptReq = async (userToAccept) => {
        const targetId = userToAccept.userId || userToAccept.id;
        try {
            // Optimistic update
            setRequests(prev => prev.filter(u => (u.userId || u.id) !== targetId));
            await connectionApi.acceptConnectionRequest(targetId);
        } catch (error) {
            console.error("Failed to accept", error);
        }
    }

    if (loading) return <div>Loading invitations...</div>;

    if (requests.length === 0 && !showEmptyMessage) return null;

    return (
        <div style={{ padding: "20px", backgroundColor: "#F6F7F3", marginBottom: "20px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "10px", color: "#666" }}>Invitations</div>
            {requests.length === 0 ? (
                <div style={{ textAlign: "center", color: "#888", padding: "10px" }}>No pending invitations</div>
            ) : (
                requests.map((eachUser) => {
                    return <Paper key={eachUser.id} sx={{ mb: 2 }}>
                        <List>
                            <ListItem>
                                <UserAvatar userId={eachUser.userId || eachUser.id} name={eachUser.name} sx={{ bgcolor: 'primary.main' }} />
                                <ListItemText
                                    primary={eachUser.name || eachUser.username || "Unknown"}
                                    secondary={eachUser.role || eachUser.designation || "Member"}
                                    sx={{ ml: 2 }}
                                />
                                <Button onClick={() => deleteReq(eachUser)} sx={{ color: "grey" }} size="small">Ignore</Button>
                                <Button onClick={() => acceptReq(eachUser)} sx={{ ml: "5px" }} variant='outlined' size="small">Accept</Button>
                            </ListItem>
                        </List>
                    </Paper>
                })
            )}
        </div>
    )
}

export default Invitation
