import axiosInstance from './axiosInstance';

const postApi = {
    getAllPosts: (params) => {
        return axiosInstance.get('/posts', { params });
    },
    createPost: (postData) => {
        return axiosInstance.post('/posts', postData);
    },
    getPostsByUser: (userId) => {
        return axiosInstance.get(`/posts/users/${userId}/allPosts`);
    }
};

export default postApi;
