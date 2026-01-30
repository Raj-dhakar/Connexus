import axiosInstance from './axiosInstance';

const postApi = {
    getAllPosts: (params) => {
        return axiosInstance.get('/posts', { params });
    },
    createPost: (formData) => {
        return axiosInstance.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Important for file upload
            }
        });
    },
    getPostsByUser: (userId) => {
        return axiosInstance.get(`/posts/users/${userId}/allPosts`);
    }
};

export default postApi;
