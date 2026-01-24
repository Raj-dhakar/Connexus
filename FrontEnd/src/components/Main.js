import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Home from './Home'

function Main() {

  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUserData(JSON.parse(userStr))
    } else {
      // Fallback if no user is found
      setUserData({
        username: "Guest User",
        designation: "Visitor",
        profile_image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      })
    }
  }, [])

  return (
    <div>
      {/* Only render if userData exists to avoid errors in children */}
      {userData && <Navbar userData={userData} />}
      {userData && <Home userData={userData} />}
    </div>
  )
}

export default Main
