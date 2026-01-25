import React, { useState } from 'react'
import { Button, Grid, TextField } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../../../api/authApi'
import linkedin from "../../../images/linkedin.png"
import developer from "../../../images/developer.png"

function Signup() {

    const navigate = useNavigate()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signUp = async () => {
        if (!firstName || !lastName || !email || !password) {
            toast.warning("Please fill all fields")
            return
        }

        try {
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }

            const response = await authApi.signup(userData);

            if (response.status === 201) {
                toast.success("Account created successfully!")

                setTimeout(() => {
                    navigate("/")
                }, 1000)
            }

        } catch (error) {
            console.error("Signup failed", error)
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message || "Signup failed. User might already exist.")
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
                    <h2 style={{ fontWeight: "100", fontSize: "40px", color: "#B26F28" }}>Step into your professional community</h2>

                    <label style={{ color: "grey", fontSize: "10px" }}>First Name</label>
                    <br />
                    <TextField onChange={(e) => setFirstName(e.target.value)} variant='outlined' label="First Name" sx={{ width: "400px", mt: "5px", mb: "10px" }} />
                    <br />

                    <label style={{ color: "grey", fontSize: "10px" }}>Last Name</label>
                    <br />
                    <TextField onChange={(e) => setLastName(e.target.value)} variant='outlined' label="Last Name" sx={{ width: "400px", mt: "5px", mb: "10px" }} />
                    <br />

                    <label style={{ color: "grey", fontSize: "10px" }}>Email</label>
                    <br />
                    <TextField onChange={(e) => setEmail(e.target.value)} variant='outlined' label="Email" sx={{ width: "400px", mt: "5px", mb: "10px" }} />
                    <br />

                    <label style={{ color: "grey", fontSize: "10px" }}>Password</label>
                    <br />
                    <TextField type="password" onChange={(e) => setPassword(e.target.value)} variant='outlined' label="Password" sx={{ width: "400px", mt: "5px", mb: "10px" }} />
                    <br />

                    <Button onClick={signUp} size='large' variant='contained' sx={{ width: "400px", borderRadius: "50px", mt: "20px", height: "50px" }}>Agree & Join</Button>
                    <div style={{ marginTop: "20px" }}>
                        Already have an account? <Link to="/" style={{ textDecoration: "none", color: "#B26F28", fontWeight: "bold" }}>Sign In</Link>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <img style={{ width: "500px" }} src={developer} alt="developer" />
                </Grid>
            </Grid>
        </div>
    )
}

export default Signup
