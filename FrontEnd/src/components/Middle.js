import React, { useRef, useState } from 'react'
import profile from "../images/profile.png"
import { Card, CardContent, CardMedia, TextField, Typography } from '@mui/material'
import image from "../images/image.png"
import calendar from "../images/calendar.png"
import article from "../images/article.png"
import steve from "../images/steve.jpg"
import Post from './Post'
import Filepost from './Filepost'

function Middle({ userData }) {

  const postRef = useRef(null)
  const filePostRef = useRef(null)

  // Mock Posts
  const [posts] = useState([
    {
      id: 1,
      username: "Elon Musk",
      designation: "CEO of Tesla",
      profile_image: "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg",
      textPost: "Just launched another rocket! Space exploration is the future.",
      filePost: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
    },
    {
      id: 2,
      username: "Bill Gates",
      designation: "Co-founder of Microsoft",
      profile_image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Bill_Gates_2017_%28cropped%29.jpg",
      textPost: "Working on solving climate change challenges.",
      filePost: null
    },
    {
      id: 3,
      username: "Steve Jobs",
      designation: "Co-founder of Apple",
      profile_image: steve,
      textPost: "Stay hungry, stay foolish.",
      filePost: "https://images.unsplash.com/photo-1556656793-02715d8dd6f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2687&q=80"
    }
  ])

  return (
    <div>
      <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "10px" }}>
        <img style={{ width: "55px", borderRadius: "40px" }} src={userData?.profile_image ?? profile} alt="profile" />
        <TextField onClick={() => postRef.current?.click()} variant='outlined' label="Start a post" style={{ width: "450px", marginLeft: "20px" }} InputProps={{ sx: { borderRadius: 150 } }} />
        <Post ref={postRef} />
        <Filepost ref={filePostRef} />
        <img onClick={() => filePostRef.current?.click()} style={{ width: "30px", marginLeft: "10px" }} src={image} alt="media" /> Media
        <img style={{ width: "30px", marginLeft: "140px" }} src={calendar} alt="calendar" /> Event
        <img style={{ width: "30px", marginLeft: "90px" }} src={article} alt="article" /> Write Article
      </div>
      <div style={{ paddingTop: "20px" }}>
        {posts.map((post) => {
          return <Card key={post.id} sx={{ mt: "10px" }}>
            <CardContent>
              <div style={{ display: "flex" }}>
                <img src={post.profile_image ?? profile} style={{ width: "50px", borderRadius: "40px", height: "50px", objectFit: "cover" }} alt="author" />
                <div style={{ marginLeft: "10px" }}>
                  <Typography>{post.username}</Typography>
                  <Typography sx={{ color: "#BFBFBF" }}>{post.designation}</Typography>
                </div>
              </div>
              <h5>{post.textPost}</h5>
            </CardContent>
            {post.filePost && <CardMedia
              component="img"
              height={250}
              image={post.filePost}>

            </CardMedia>}
          </Card>
        })}
      </div>
    </div>
  )
}

export default Middle
