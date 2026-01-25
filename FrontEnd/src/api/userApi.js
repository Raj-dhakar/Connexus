import axiosInstance from './axiosInstance';

const userApi = {
    getProfile: (userId) => {
        return axiosInstance.get(`/users/${userId}`);
    },
    // Add other user related calls here
};

export default userApi;
