import React, { useState } from 'react'
import { Button, Grid, TextField } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate, Link } from 'react-router-dom'
import authApi from '../../../api/authApi'
import linkedin from "../../../images/linkedin.png"
import developer from "../../../images/developer.png"
import useAuth from '../useAuth'

function Signin() {

    const navigate = useNavigate()
    const { login } = useAuth();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signIn = async () => {
        console.log("SignIn button clicked");
        if (!email || !password) {
            console.log("Email or password missing");
            toast.warning("Please enter email and password")
            return
        }

        try {
            console.log("Attempting to login with", email);
            const response = await authApi.login(email, password);
            console.log("Login response received:", response);

            console.log(response.data.data.role);

            // Success: Cookie is set by backend automatically (HttpOnly)
            // But we also need the token for axiosInstance
            const responseData = response.data.data;
            sessionStorage.setItem("user", JSON.stringify(responseData))
            sessionStorage.setItem("token", responseData.jwtToken)

            // Show role immediately
            toast.success(`Login Successful! Role: ${responseData.role}`)
            console.log(responseData.role);

            // Wait 5 seconds before redirecting
            setTimeout(() => {
                if (responseData.role === 'ROLE_RECRUITER') {
                    navigate("/recruiter/dashboard")
                } else {
                    navigate("/main")
                }
            }, 5000)

        } catch (error) {
            console.error("Login failed", error)
            if (error.response && error.response.status === 401) {
                toast.error("Wrong credentials")
            } else {
                toast.error("Connecting to server failed")
            }
        }
    }


    return (
        <div>
            <Grid container>
                <Grid item xs={6} sx={{ paddingLeft: "80px", paddingTop: "15px" }}>
                    <ToastContainer autoClose={2000} position='top-right' />
                    <img style={{ width: "130px" }} src={linkedin} alt="logo" />
                    <h2 style={{ fontWeight: "100", fontSize: "60px", color: "#B26F28" }}>Welcome Back</h2>

                    <label style={{ color: "grey", fontSize: "10px" }}>Email</label>
                    <br />
                    <TextField onChange={(e) => setEmail(e.target.value)} variant='outlined' label="Email" sx={{ width: "400px", mt: "5px" }} />
                    <br />

                    <label style={{ color: "grey", fontSize: "10px" }}>Password</label>
                    <br />
                    <TextField type="password" onChange={(e) => setPassword(e.target.value)} variant='outlined' label="Password" sx={{ width: "400px", mt: "5px" }} />

                    <Button onClick={signIn} size='large' variant='contained' sx={{ width: "400px", borderRadius: "50px", mt: "25px", height: "50px" }}>Signin</Button>
                    <div style={{ marginTop: "20px" }}>
                        New to Connexus? <Link to="/signup" style={{ textDecoration: "none", color: "#B26F28", fontWeight: "bold", marginRight: "10px" }}>User Signup</Link>
                        |
                        <Link to="/recruiter/signup" style={{ textDecoration: "none", color: "#B26F28", fontWeight: "bold", marginLeft: "10px" }}>Recruiter Signup</Link>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <img style={{ width: "500px" }} src={developer} alt="developer" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Signin
