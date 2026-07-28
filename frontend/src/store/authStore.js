import { create } from 'zustand';
import { currentUserHRAdmin, currentUserEmployee } from '../data/mockData';
import { authApi } from '../api';

const getInitialRole = () => {
  return localStorage.getItem('user_role') || 'hr_admin';
};

const getInitialUser = () => {
  const savedRole = getInitialRole();
  const savedUser = localStorage.getItem('user_profile');
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      // fallback
    }
  }
  return savedRole === 'employee' ? currentUserEmployee : currentUserHRAdmin;
};

export const useAuthStore = create((set, get) => ({
  role: getInitialRole(), // 'hr_admin' or 'employee'
  user: getInitialUser(),
  isAuthenticated: true,

  switchRole: (newRole) => {
    const targetUser = newRole === 'hr_admin' ? currentUserHRAdmin : currentUserEmployee;
    localStorage.setItem('user_role', newRole);
    localStorage.setItem('user_profile', JSON.stringify(targetUser));
    set({ role: newRole, user: targetUser });
  },

  login: async (email, password, selectedRole = 'hr_admin') => {
    try {
      const res = await authApi.login({ email, password });
      if (res && res.token) {
        localStorage.setItem('token', res.token);
      }
      const roleMapped = selectedRole || (res?.user?.role === 'Employee' ? 'employee' : 'hr_admin');
      const userProfile = res?.user ? {
        id: res.user._id,
        name: res.user.name || (res.user.email ? res.user.email.split('@')[0] : 'User'),
        email: res.user.email,
        role: res.user.role
      } : (selectedRole === 'hr_admin' ? currentUserHRAdmin : currentUserEmployee);

      localStorage.setItem('user_role', roleMapped);
      localStorage.setItem('user_profile', JSON.stringify(userProfile));

      set({ role: roleMapped, user: userProfile, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.log('Backend auth login fallback:', error.message);
      // Fallback local auth state for dev testing
      const fallbackUser = selectedRole === 'hr_admin' ? currentUserHRAdmin : currentUserEmployee;
      localStorage.setItem('user_role', selectedRole);
      localStorage.setItem('user_profile', JSON.stringify(fallbackUser));
      set({ role: selectedRole, user: fallbackUser, isAuthenticated: true });
      return { success: true, warning: 'Logged in locally' };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_profile');
      set({ isAuthenticated: false, user: null, role: 'hr_admin' });
    }
  },

  hasRole: (requiredRole) => {
    return get().role === requiredRole;
  }
}));
