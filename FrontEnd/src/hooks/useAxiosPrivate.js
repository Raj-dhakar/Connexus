import { useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../features/auth/useAuth';

const useAxiosPrivate = () => {
    const { user } = useAuth();

    useEffect(() => {
        // Add interceptors for token handling if needed
        const requestIntercept = axiosInstance.interceptors.request.use(
            (config) => {
                // If using Bearer token, start inject here
                /*
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                */
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestIntercept);
        };
    }, [user]);

    return axiosInstance;
};

export default useAxiosPrivate;
