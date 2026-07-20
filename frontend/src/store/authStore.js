import { create } from 'zustand';
import { currentUserHRAdmin, currentUserEmployee } from '../data/mockData';

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

  login: (email, password, selectedRole = 'hr_admin') => {
    if (selectedRole === 'hr_admin') {
      set({ role: 'hr_admin', user: currentUserHRAdmin, isAuthenticated: true });
    } else {
      set({ role: 'employee', user: currentUserEmployee, isAuthenticated: true });
    }
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
  },

  hasRole: (requiredRole) => {
    return get().role === requiredRole;
  }
}));
