import axiosInstance from './axiosInstance';

const userApi = {
    getProfile: (userId) => {
        return axiosInstance.get(`/users/${userId}`);
    },
    getAllUsers: () => {
        return axiosInstance.get('/users/all');
    },
    updateUser: (userId, data) => {
        return axiosInstance.put(`/users/${userId}`, data);
    },
    // Add other user related calls here
};

export default userApi;
