import { create } from 'zustand';
import { currentUserHRAdmin, currentUserEmployee } from '../data/mockData';
import { authApi } from '../api';

export const useAuthStore = create((set, get) => ({
  role: 'hr_admin', // 'hr_admin' or 'employee'
  user: currentUserHRAdmin,
  isAuthenticated: true,

  switchRole: (newRole) => {
    if (newRole === 'hr_admin') {
      set({ role: 'hr_admin', user: currentUserHRAdmin });
    } else {
      set({ role: 'employee', user: currentUserEmployee });
    }
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
        name: res.user.email ? res.user.email.split('@')[0] : 'Admin User',
        email: res.user.email,
        role: res.user.role
      } : (selectedRole === 'hr_admin' ? currentUserHRAdmin : currentUserEmployee);

      set({ role: roleMapped, user: userProfile, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      console.log('Backend auth login fallback:', error.message);
      // Fallback local auth state for dev testing
      const fallbackUser = selectedRole === 'hr_admin' ? currentUserHRAdmin : currentUserEmployee;
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
      set({ isAuthenticated: false, user: null });
    }
  },

  hasRole: (requiredRole) => {
    return get().role === requiredRole;
  }
}));
