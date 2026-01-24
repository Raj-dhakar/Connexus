import axios from 'axios'
import { Button, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import linkedin from "../images/linkedin.png"
import developer from "../images/developer.png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom'


function Signin() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const signIn = async () => {
    if (!email || !password) {
      toast.warning("Please enter email and password")
      return
    }

    try {
      const response = await axios.post("http://localhost:9090/auth/users/login", {
        email: email,
        password: password
      }, { withCredentials: true });

      console.log(response);

      // Axios throws an error for non-2xx responses, so if we reach here, it's a success

      // Success: Cookie is set by backend automatically (HttpOnly)
      // We set a mock user object for frontend display purposes since we can't read the HttpOnly cookie
      const mockUser = {
        username: email.split("@")[0],
        designation: "Developer",
        profile_image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        email: email
      }
      localStorage.setItem("user", JSON.stringify(mockUser))

      toast.success("Login Successful!")
      setTimeout(() => {
        navigate("/main")
      }, 500)

    } catch (error) {
      console.error("Login failed", error)
      if (error.response && error.response.status === 401) {
        toast.error("Wrong credentials")
      } else {
        // console.log("Raj ::" + error.response.data.error.message)
        toast.error(error.response.data.error.message)
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
            New to Connexus? <Link to="/signup" style={{ textDecoration: "none", color: "#B26F28", fontWeight: "bold" }}>Join now</Link>
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
