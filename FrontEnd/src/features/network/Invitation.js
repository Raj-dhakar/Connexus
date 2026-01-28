import { Avatar, Button, List, ListItem, ListItemText, Paper } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import connectionApi from '../../api/connectionApi'

function Invitation({ showEmptyMessage = true }) {

    const location = useLocation()
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
    }, []);

    const deleteReq = async (userToIgnore) => {
        try {
            await connectionApi.rejectConnectionRequest(userToIgnore.userId || userToIgnore.id);
            setRequests(requests.filter(u => (u.userId || u.id) !== (userToIgnore.userId || userToIgnore.id)));
        } catch (error) {
            console.error("Failed to ignore", error);
        }
    }

    const acceptReq = async (userToAccept) => {
        try {
            await connectionApi.acceptConnectionRequest(userToAccept.userId || userToAccept.id);
            setRequests(requests.filter(u => (u.userId || u.id) !== (userToAccept.userId || userToAccept.id)));
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
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    {eachUser.name ? eachUser.name.charAt(0).toUpperCase() : '?'}
                                </Avatar>
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
