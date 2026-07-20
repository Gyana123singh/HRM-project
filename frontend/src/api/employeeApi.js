import axiosClient from './axiosClient';

export const employeeApi = {
  // Fetch all employees with optional params: page, limit, search, department, status, employmentType
  getAllEmployees: async (params = {}) => {
    return await axiosClient.get('/employees', { params });
  },

  // Fetch employee details by ID
  getEmployeeById: async (id) => {
    return await axiosClient.get(`/employees/${id}`);
  },

  // Create a new employee
  createEmployee: async (employeeData) => {
    return await axiosClient.post('/employees', employeeData);
  },

  // Update existing employee profile
  updateEmployee: async (id, employeeData) => {
    return await axiosClient.put(`/employees/${id}`, employeeData);
  },

  // Soft delete / Offboard employee
  deleteEmployee: async (id) => {
    return await axiosClient.delete(`/employees/${id}`);
  },

  // Toggle employee Active / Inactive status
  toggleStatus: async (id) => {
    return await axiosClient.patch(`/employees/${id}/toggle-status`);
  },

  // Department APIs
  getDepartments: async () => {
    return await axiosClient.get('/departments');
  },

  createDepartment: async (deptData) => {
    return await axiosClient.post('/departments', deptData);
  }
};

export default employeeApi;
