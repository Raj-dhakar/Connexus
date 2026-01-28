import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = () => {
            const userStr = Cookies.get("user");
            const token = Cookies.get("token");
            if (userStr && token) {
                try {
                    setUser(JSON.parse(userStr));
                } catch (e) {
                    console.error("Failed to parse user cookie", e);
                    setUser(null);
                }
            } else {
                // Explicitly set null or Guest structure if needed, but null is safer for logic checks
                // adhering to previous logic:
                if (!user) { // Only set if not already set to avoid loops?
                    setUser({
                        username: "Guest User",
                        designation: "Visitor",
                        profile_image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    });
                }
            }
        };

        checkUser();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkUser();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", checkUser);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", checkUser);
        };
    }, []);

    const login = (userData, token) => {
        Cookies.set("user", JSON.stringify(userData), { expires: 7 });
        Cookies.set("token", token, { expires: 7 });
        setUser(userData);
    };

    const logout = () => {
        Cookies.remove("user");
        Cookies.remove("token");
        setUser(null);
        navigate("/");
    };

    const updateUser = (userData) => {
        Cookies.set("user", JSON.stringify(userData), { expires: 7 });
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
