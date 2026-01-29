import axiosInstance from './axiosInstance';

const messagingApi = {
    getChatHistory: (userId1, userId2) => {
        return axiosInstance.get(`/messages/${userId1}/${userId2}`);
    },
    getUnreadCounts: (userId) => {
        return axiosInstance.get(`/messages/unread/${userId}`);
    },
    markMessagesAsRead: (userId, senderId) => {
        return axiosInstance.put(`/messages/read/${userId}/${senderId}`);
    },
};

export default messagingApi;
