import axiosInstance from './axiosInstance';

const postApi = {
    getAllPosts: () => {
        return axiosInstance.get('/posts');
    },
    createPost: (postData) => {
        return axiosInstance.post('/posts', postData);
    }
};

export default postApi;
