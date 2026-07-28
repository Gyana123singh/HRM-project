import axiosClient from './axiosClient';

export const aiApi = {
  // Get executive AI HR insights metrics
  getInsights: async () => {
    return await axiosClient.get('/ai/insights');
  },

  // Send real-time prompt message to AI Assistant
  sendChatMessage: async (message, history = []) => {
    return await axiosClient.post('/ai/chat', { message, history });
  }
};

export default aiApi;
