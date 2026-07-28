import axiosClient from './axiosClient';

export const taskApi = {
  // Create a new personal task
  createTask: async (taskData) => {
    return await axiosClient.post('/tasks', taskData);
  },

  // Get logged in employee's tasks
  getMyTasks: async () => {
    return await axiosClient.get('/tasks/my-tasks');
  },

  // Update task status and progress
  updateTaskStatus: async (id, statusData) => {
    return await axiosClient.patch(`/tasks/${id}/status`, statusData);
  }
};

export default taskApi;
