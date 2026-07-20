import { create } from 'zustand';
import { initialNotifications } from '../data/mockData';

export const useNotificationStore = create((set, get) => ({
  notifications: initialNotifications,

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
  },

  addNotification: (ntf) => {
    const created = {
      id: `NTF-${Date.now()}`,
      time: "Just now",
      read: false,
      ...ntf
    };
    set((state) => ({ notifications: [created, ...state.notifications] }));
  }
}));
