import React, { useState } from 'react'
import { Avatar, Button, List, ListItem, ListItemText, Paper } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

function Network() {

    const location = useLocation()


    const [user] = useState([
        {
            id: "1",
            username: "Elon Musk",
            designation: "CEO of Tesla",
            profile_image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg",
            status: "connected"
        },
        {
            id: "2",
            username: "Bill Gates",
            designation: "Co-founder of Microsoft",
            profile_image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg",
            status: "connected"
        }
    ])


    return (
        <div style={{ padding: "20px", backgroundColor: "#F6F7F3", height: "100vh" }}>
            {user.filter(user => user.status === "connected").map((eachUser) => {
                return <Paper key={eachUser.id} sx={{ mb: 2 }}>
                    <List>
                        <ListItem>
                            <Avatar src={eachUser.profile_image} />
                            <ListItemText primary={eachUser.username} secondary={eachUser.designation} sx={{ ml: 2 }} />
                            <Link to="/message" state={{
                                currentUserName: location.state?.currentUserName,
                                currentProImg: location.state?.currentUserProImg,
                                username: eachUser.username,
                                id: eachUser.id,
                                profile_image: eachUser.profile_image
                            }}>
                                <Button variant='outlined'>Message</Button></Link>
                        </ListItem>
                    </List>
                </Paper>
            })}
        </div>
    )
}

export default Network
