import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Home from './Home'
import useAuth from '../auth/useAuth'

function Main() {

    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        // If user is a Guest (no role) or null, redirect to login
        if (user && !user.role && user.username === 'Guest User') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div>
            {/* Only render if user exists to avoid errors in children */}
            {user && <Navbar userData={user} />}
            {user && <Home userData={user} />}
        </div>
    )
}

export default Main
