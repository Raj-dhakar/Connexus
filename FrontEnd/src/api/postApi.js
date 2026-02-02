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
    },
    updatePost: (postId, data) => {
        return axiosInstance.put(`/posts/${postId}`, data);
    },
    deletePost: (postId) => {
        return axiosInstance.delete(`/posts/${postId}`);
    },
    updatePostMedia: (postId, formData) => {
        return axiosInstance.put(`/posts/${postId}/media`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    likePost: (postId) => {
        return axiosInstance.post(`/likes/${postId}`);
    },
    unlikePost: (postId) => {
        return axiosInstance.delete(`/likes/${postId}`);
    }
};

export default postApi;
