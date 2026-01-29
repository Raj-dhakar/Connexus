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
    deleteMessage: (messageId) => {
        return axiosInstance.delete(`/messages/${messageId}`);
    },
    editMessage: (messageId, content) => {
        return axiosInstance.put(`/messages/${messageId}`, { content });
    },
    reactToMessage: (messageId, userId, reaction) => {
        return axiosInstance.put(`/messages/${messageId}/react`, { userId, reaction });
    }
};

export default messagingApi;
