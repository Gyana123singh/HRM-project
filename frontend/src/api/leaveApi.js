import axiosClient from './axiosClient';

export const leaveApi = {
  // Apply for a leave
  applyLeave: async (leaveData) => {
    return await axiosClient.post('/leaves', leaveData);
  },

  // Get logged in employee's leave applications
  getMyLeaves: async () => {
    return await axiosClient.get('/leaves/my-leaves');
  },

  // Get all leave applications (Admin/HR/Manager view)
  getAllLeaveRequests: async (params = {}) => {
    return await axiosClient.get('/leaves', { params });
  },

  // Update status (Approve or Reject)
  updateLeaveStatus: async (id, statusData) => {
    return await axiosClient.patch(`/leaves/${id}/status`, statusData);
  }
};

export default leaveApi;
