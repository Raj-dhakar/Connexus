import axios from "axios";
import Cookies from "js-cookie";

const ADMIN_API_URL = "http://localhost:9090/admin-api/api/Admin";

const adminApi = axios.create({
    baseURL: ADMIN_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Interceptor to attach token
adminApi.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getAdminStats = () => adminApi.get("/stats");
export const getAdminUsers = () => adminApi.get("/users");
export const getAdminRecruiters = () => adminApi.get("/recruiters");
export const deleteUser = (id) => adminApi.delete(`/users/${id}`);
export const deletePost = (id) => adminApi.delete(`/posts/${id}`);

export default {
    getAdminStats,
    getAdminUsers,
    getAdminRecruiters,
    deleteUser,
    deletePost
};
