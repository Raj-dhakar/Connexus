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
    uploadProfileImage: (formData) => {
        return axiosInstance.post('/users/self/profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    // Add other user related calls here
};

export default userApi;
