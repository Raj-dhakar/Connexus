import React, { useRef } from 'react'
import profile from "../../../images/profile.png"
import { Card, CardContent, CardMedia, TextField, Typography } from '@mui/material'
import image from "../../../images/image.png"
import calendar from "../../../images/calendar.png"
import article from "../../../images/article.png"
import Post from './Post'
import Filepost from './Filepost'
import usePosts from '../usePosts'

function Middle({ userData }) {

    const postRef = useRef(null)
    const filePostRef = useRef(null)

    const { posts } = usePosts();

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
