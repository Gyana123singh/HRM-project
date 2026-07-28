import axiosClient from './axiosClient';

export const organizationApi = {
  // Get Company Profile
  getProfile: async () => {
    return await axiosClient.get('/organization/profile');
  },

  // Update Company Profile
  updateProfile: async (profileData) => {
    return await axiosClient.put('/organization/profile', profileData);
  },

  // Get Branches
  getBranches: async () => {
    return await axiosClient.get('/organization/branches');
  },

  // Create Branch
  createBranch: async (branchData) => {
    return await axiosClient.post('/organization/branches', branchData);
  },

  // Get Departments
  getDepartments: async () => {
    return await axiosClient.get('/departments');
  },

  // Create Department
  createDepartment: async (deptData) => {
    return await axiosClient.post('/departments', deptData);
  },

  // Get Designations
  getDesignations: async () => {
    return await axiosClient.get('/organization/designations');
  },

  // Create Designation
  createDesignation: async (desigData) => {
    return await axiosClient.post('/organization/designations', desigData);
  }
};
