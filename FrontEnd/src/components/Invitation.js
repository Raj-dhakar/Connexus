import { Avatar, Button, List, ListItem, ListItemText, Paper } from '@mui/material'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

function Invitation() {

    const location = useLocation() // kept for consistency if needed later

    const [user, setUser] = useState([
        {
            id: "5",
            username: "Tim Cook",
            designation: "CEO of Apple",
            profile_image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Tim_Cook_20090508.jpg",
            status: "pending"
        }
    ])


    const deleteReq = (userToIgnore) => {
        console.log("Ignored request from", userToIgnore.username)
        setUser(user.filter(u => u.id !== userToIgnore.id))
    }


    const acceptReq = (userToAccept) => {
        console.log("Accepted request from", userToAccept.username)
        setUser(user.filter(u => u.id !== userToAccept.id))
    }


    return (
        <div style={{ padding: "20px", backgroundColor: "#F6F7F3", height: "100vh" }}>
            {user.filter(user => user.status === "pending").map((eachUser) => {
                return <Paper key={eachUser.id} sx={{ mb: 2 }}>
                    <List>
                        <ListItem>
                            <Avatar src={eachUser.profile_image} />
                            <ListItemText primary={eachUser.username} secondary={eachUser.designation} sx={{ ml: 2 }} />
                            <Button onClick={() => deleteReq(eachUser)} sx={{ color: "grey" }} size="small">Ignore</Button>
                            <Button onClick={() => acceptReq(eachUser)} sx={{ ml: "5px" }} variant='outlined' size="small">Accept</Button>
                        </ListItem>
                    </List>
                </Paper>
            })}
            {user.filter(user => user.status === "pending").length === 0 && <div style={{ textAlign: "center", marginTop: "20px" }}>No pending invitations</div>}
        </div>
    )
}

export default Invitation
