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

    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    return { user, login, logout };
};

export default useAuth;
