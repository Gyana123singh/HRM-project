import axiosClient from './axiosClient';

export const recruitmentApi = {
  // Fetch job postings (public or authenticated)
  getJobs: async (params = {}) => {
    return await axiosClient.get('/recruitment/jobs', { params });
  },

  // Create new job posting (HR/Admin)
  createJob: async (jobData) => {
    return await axiosClient.post('/recruitment/jobs', jobData);
  },

  // Update job status (Open, Closed, Draft)
  updateJobStatus: async (id, statusData) => {
    return await axiosClient.patch(`/recruitment/jobs/${id}/status`, statusData);
  },

  // Submit job application
  applyForJob: async (applicationData) => {
    return await axiosClient.post('/recruitment/apply', applicationData);
  },

  // Get candidates (for HR Kanban board view)
  getCandidates: async (params = {}) => {
    return await axiosClient.get('/recruitment/candidates', { params });
  },

  // Update candidate status (Applied -> Screened -> Interviewed -> Offered -> Rejected)
  updateCandidateStatus: async (id, statusData) => {
    return await axiosClient.patch(`/recruitment/candidates/${id}/status`, statusData);
  }
};

export default recruitmentApi;
