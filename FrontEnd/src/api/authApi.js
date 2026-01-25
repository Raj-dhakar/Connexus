import axiosInstance from './axiosInstance';

const authApi = {
    login: (email, password) => {
        return axiosInstance.post('/auth/users/login', { email, password });
    },
    signup: (userData) => {
        return axiosInstance.post('/auth/users/signup', userData);
    },
    signupRecruiter: (recruiterData) => {
        return axiosInstance.post('/auth/recruiters/signup', recruiterData);
    }
};

export default authApi;
