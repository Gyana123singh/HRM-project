import axiosClient from './axiosClient';

export const payrollApi = {
  // Bulk generate monthly payroll
  generateMonthlyPayroll: async (payrollData) => {
    return await axiosClient.post('/payroll/generate', payrollData);
  },

  // Get all payslips (HR/Admin)
  getAllPayslips: async (params = {}) => {
    return await axiosClient.get('/payroll', { params });
  },

  // Get my payslips (Employee Self-Service)
  getMyPayslips: async () => {
    return await axiosClient.get('/payroll/my-slips');
  },

  // Get payslip details by ID
  getPayslipById: async (id) => {
    return await axiosClient.get(`/payroll/${id}`);
  },

  // Update payment status (Pending, Processing, Paid)
  updatePaymentStatus: async (id, statusData) => {
    return await axiosClient.patch(`/payroll/${id}/status`, statusData);
  }
};

export default payrollApi;
