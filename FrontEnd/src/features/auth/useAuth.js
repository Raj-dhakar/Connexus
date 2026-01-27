import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = () => {
            const userStr = Cookies.get("user");
            const token = Cookies.get("token");
            if (userStr && token) {
                setUser(JSON.parse(userStr));
            } else {
                // If token or user is missing, ensure we are logged out
                setUser({
                    username: "Guest User",
                    designation: "Visitor",
                    profile_image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                });
            }
        };

        checkUser();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkUser();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", checkUser); // Also check on window focus

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", checkUser);
        };
    }, []);

    const login = (userData, token) => {
        Cookies.set("user", JSON.stringify(userData));
        Cookies.set("token", token);
        setUser(userData);
    };

    const logout = () => {
        Cookies.remove("user");
        Cookies.remove("token");
        navigate("/");
    };

    return { user, login, logout };
};

export default useAuth;
