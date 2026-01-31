import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../config/env';

const axiosInstance = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token'); // Retrieve from cookie

        // Exclude /auth/ endpoints from having the Authorization header attached
        if (token && !config.url.startsWith('/auth/')) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token expired or invalid
            Cookies.remove('token');
            Cookies.remove('user');
            window.location.href = '/'; // Hard redirect to login
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
