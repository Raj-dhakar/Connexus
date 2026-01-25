import axios from 'axios';
import config from '../config/env';

const axiosInstance = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global errors if needed
        return Promise.reject(error);
    }
);

export default axiosInstance;
