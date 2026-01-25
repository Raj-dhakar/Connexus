import React from 'react'
import Navbar from './Navbar'
import Home from './Home'
import useAuth from '../auth/useAuth'

function Main() {

    const { user } = useAuth();

    return (
        <div>
            {/* Only render if user exists to avoid errors in children */}
            {user && <Navbar userData={user} />}
            {user && <Home userData={user} />}
        </div>
    )
}

export default Main
