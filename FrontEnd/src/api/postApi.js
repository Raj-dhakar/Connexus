import axiosInstance from './axiosInstance';

const postApi = {
    getAllPosts: (params) => {
        return axiosInstance.get('/posts', { params });
    },
    createPost: (postData) => {
        return axiosInstance.post('/posts', postData);
    }
};

export default postApi;
