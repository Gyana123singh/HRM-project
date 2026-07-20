import axiosClient from './axiosClient';

export const attendanceApi = {
  // Punch Clock In or Clock Out
  clockInOut: async (data = {}) => {
    return await axiosClient.post('/attendance/punch', data);
  },

  // Get current logged in employee's status today
  getTodayStatus: async () => {
    return await axiosClient.get('/attendance/today');
  },

  // Get attendance logs with date parameters
  getAttendanceLogs: async (params = {}) => {
    return await axiosClient.get('/attendance/logs', { params });
  },

  // Get department/company attendance summary for stats
  getAttendanceSummary: async () => {
    return await axiosClient.get('/attendance/summary');
  }
};

export default attendanceApi;
