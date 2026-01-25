import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUser(JSON.parse(userStr));
        } else {
            // Fallback or redirect logic could go here
            // For now, we mimic the previous behavior
            setUser({
                username: "Guest User",
                designation: "Visitor",
                profile_image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            });
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return { user, logout };
};

export default useAuth;
