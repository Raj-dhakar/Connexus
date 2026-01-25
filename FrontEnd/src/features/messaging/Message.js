import { Avatar, Button, Grid, List, ListItem, ListItemText, Paper, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function Message() {

    const location = useLocation()

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([
        {
            user: "Elon Musk",
            text: "Welcome to Connexus!",
            profile_image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg"
        }
    ])

    const sendMessage = () => {
        setMessages([...messages, {
            user: location.state?.currentUserName || "Me",
            text: message,
            profile_image: location.state?.currentProImg
        }])
        setMessage("")
    }

    return (
        <div style={{ padding: "30px" }}>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <Paper style={{ height: "100vh", padding: "10px" }}>
                        <h3>Messaging</h3>
                        <List>
                            <ListItem>
                                <Avatar src={location.state?.profile_image} />
                                <ListItemText primary={location.state?.username} sx={{ ml: 2 }} />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    <Paper style={{ height: "80vh", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            {messages.map((msg, index) => (
                                <div key={index} style={{
                                    display: "flex",
                                    marginBottom: "10px",
                                    justifyContent: msg.user === (location.state?.currentUserName || "Me") ? "flex-end" : "flex-start"
                                }}>
                                    {msg.user !== (location.state?.currentUserName || "Me") && <Avatar src={msg.profile_image} sx={{ width: 30, height: 30, mr: 1 }} />}
                                    <div style={{
                                        backgroundColor: msg.user === (location.state?.currentUserName || "Me") ? "#0a66c2" : "#f3f6f8",
                                        color: msg.user === (location.state?.currentUserName || "Me") ? "white" : "black",
                                        padding: "10px 15px",
                                        borderRadius: "20px",
                                        maxWidth: "70%"
                                    }}>
                                        {msg.text}
                                    </div>
                                    {msg.user === (location.state?.currentUserName || "Me") && <Avatar src={msg.profile_image} sx={{ width: 30, height: 30, ml: 1 }} />}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex" }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Write a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <Button onClick={sendMessage} variant="contained" sx={{ ml: 2 }}>Send</Button>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Message
