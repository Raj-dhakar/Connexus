import axiosInstance from './axiosInstance';

const connectionApi = {
    getFirstDegreeConnections: () => {
        return axiosInstance.get('/connect/core/first-degree');
    },
    getIncomingRequests: () => {
        return axiosInstance.get('/connect/core/requested');
    },
    acceptConnectionRequest: (userId) => {
        return axiosInstance.post(`/connect/core/accept/${userId}`);
    },
    rejectConnectionRequest: (userId) => {
        return axiosInstance.post(`/connect/core/reject/${userId}`);
    },
    // Future endpoints (request, accept, reject) can be added here
};

export default connectionApi;
