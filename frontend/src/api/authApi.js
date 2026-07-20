import axiosClient from './axiosClient';

export const loginApi = async (credentials) => {
  const data = await axiosClient.post('/auth/login', credentials);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const logoutApi = async () => {
  try {
    await axiosClient.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
  }
};

export const getMeApi = async () => {
  return await axiosClient.get('/auth/me');
};

export const changePasswordApi = async (passwordData) => {
  return await axiosClient.put('/auth/change-password', passwordData);
};

export const authApi = {
  login: loginApi,
  logout: logoutApi,
  getMe: getMeApi,
  changePassword: changePasswordApi,
  loginApi,
  logoutApi,
  getMeApi,
  changePasswordApi
};

export default authApi;
