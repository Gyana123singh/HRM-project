import axiosClient from './axiosClient';

export const dashboardApi = {
  getStats: async () => {
    return await axiosClient.get('/dashboard/stats');
  },

  getAnnouncements: async () => {
    return await axiosClient.get('/dashboard/announcements');
  },

  createAnnouncement: async (announcementData) => {
    return await axiosClient.post('/dashboard/announcements', announcementData);
  }
};

export default dashboardApi;
