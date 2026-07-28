import axiosClient from './axiosClient';

export const lifecycleApi = {
  // Get Onboarding Trackers
  getOnboarding: async () => {
    return await axiosClient.get('/lifecycle/onboarding');
  },

  // Get Performance Appraisal Reviews
  getReviews: async () => {
    return await axiosClient.get('/lifecycle/reviews');
  },

  // Create Performance Review
  createReview: async (reviewData) => {
    return await axiosClient.post('/lifecycle/reviews', reviewData);
  },

  // Get Goals & OKRs
  getGoals: async () => {
    return await axiosClient.get('/lifecycle/goals');
  },

  // Create Goal Objective
  createGoal: async (goalData) => {
    return await axiosClient.post('/lifecycle/goals', goalData);
  },

  // Get Kudos & Recognition
  getKudos: async () => {
    return await axiosClient.get('/lifecycle/kudos');
  },

  // Give Kudos Recognition
  giveKudos: async (kudosData) => {
    return await axiosClient.post('/lifecycle/kudos', kudosData);
  }
};

export default lifecycleApi;
