import React, { useState } from 'react'
import { Avatar, Button, List, ListItem, ListItemText, Paper } from '@mui/material'
import { useLocation } from 'react-router-dom'

function Connection() {

    const location = useLocation()
    const currentUserUid = "mock-current-uid" // Mock ID

    const [userData] = useState([
        {
            id: "3",
            username: "Sundar Pichai",
            designation: "CEO of Google",
            profile_image: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Sundar_pichai.png"
        },
        {
            id: "4",
            username: "Satya Nadella",
            designation: "CEO of Microsoft",
            profile_image: "https://upload.wikimedia.org/wikipedia/commons/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg"
        }
    ])


    const sendRequest = (userId) => {
        console.log(`Request sent to user ${userId} from ${location.state?.username}`)
    }


    return (
        <div style={{ padding: "20px", backgroundColor: "#F6F7F3", height: "100vh" }}>
            {userData.filter(user => user.id !== currentUserUid).map((otherUser) => {
                return (
                    <Paper key={otherUser.id} sx={{ mb: 2 }}>
                        <List>
                            <ListItem>
                                <Avatar src={otherUser.profile_image} />
                                <ListItemText primary={otherUser.username} secondary={otherUser.designation} sx={{ ml: 2 }} />
                                <Button onClick={() => sendRequest(otherUser.id)} variant='outlined' size="small">Connect</Button>
                            </ListItem>
                        </List>
                    </Paper>
                )
            })}
        </div>
    )
}

export default Connection
