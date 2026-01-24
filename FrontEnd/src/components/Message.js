import { Button, List, ListItem, Paper, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

function Message() {

  const location = useLocation()

  const [message, setMessage] = useState("")
  const [messageData, setMessageData] = useState([
    {
      id: 1,
      username: "Elon Musk",
      profile_image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg",
      message: "Hello! Are you interested in working at SpaceX?"
    }
  ])


  const sendMessage = () => {
    if (!message) return;

    const newMessage = {
      id: messageData.length + 1,
      message: message,
      username: location.state?.username || "You",
      profile_image: location.state?.currentProImg || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    }

    setMessageData([...messageData, newMessage])
    setMessage("")
  }


  return (
    <div style={{ padding: "30px" }}>
      <Paper>
        <List>
          <ListItem>
            <div>
              <TextField value={message} onChange={(e) => setMessage(e.target.value)} variant='outlined' label="Type here" size='small' />
              <Button onClick={sendMessage} sx={{ ml: "30px" }} variant='contained'>Send</Button>
            </div>
          </ListItem>
        </List>
      </Paper>

      <div>
        {messageData.map((userMessage) => {
          return <div key={userMessage.id} style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img style={{ width: "30px", height: "30px", borderRadius: "40px" }} src={userMessage.profile_image} alt="user" />
              <h5 style={{ marginLeft: "10px" }}>{userMessage.username}</h5>
            </div>
            <h5 style={{ marginLeft: "30px", fontWeight: "100" }}>{userMessage.message}</h5>
          </div>
        })}
      </div>
    </div>
  )
}

export default Message
