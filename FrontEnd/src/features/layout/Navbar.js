import { Button, Grid } from '@mui/material'
import React from 'react'
import linked from "../../images/linked.png"
import lens from "../../images/lens.png"
import home from "../../images/home.png"
import message from "../../images/message.png"
import network from "../../images/network.png"
import profile from "../../images/profile.png"
import { Link, useNavigate } from 'react-router-dom'

function Navbar({ userData }) {

    const navigate = useNavigate()

    const logout = () => {
        sessionStorage.removeItem("user")
        navigate("/")
    }

    return (
        <div style={{ padding: "10px", borderBottom: "1px solid #D6D6D6" }}>
            <Grid container>
                <Grid item xs={5}>
                    <img style={{ width: "35px", marginLeft: "80px" }} src={linked} alt="logo" />
                    <img style={{ width: "25px", marginLeft: "20px" }} src={lens} alt="search" />
                </Grid>
                <Grid item xs={6}>
                    <Link to="/main"><img style={{ width: "25px", marginLeft: "20px" }} src={home} alt="home" /></Link>
                    <Link to="/network" state={{
                        currentUserProImg: userData?.profile_image,
                        currentUserName: userData?.username
                    }}><img style={{ width: "25px", marginLeft: "50px" }} src={network} alt="network" /></Link>
                    <Link to="/message" state={{
                        currentUserProImg: userData?.profile_image,
                        currentUserName: userData?.username
                    }}><img style={{ width: "25px", marginLeft: "50px" }} src={message} alt="message" /></Link>
                    <img style={{ width: "25px", marginLeft: "50px", borderRadius: "40px" }} src={userData?.profile_image ?? profile} alt="profile" />
                </Grid>
                <Grid item xs={1}>
                    <Button onClick={logout} variant="contained" size="small" sx={{ color: "black", backgroundColor: "white" }}>Logout</Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default Navbar
