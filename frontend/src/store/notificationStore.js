import { create } from 'zustand';
import { initialNotifications } from '../data/mockData';
import { notificationApi } from '../api/notificationApi';

export const useNotificationStore = create((set, get) => ({
  notifications: initialNotifications,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await notificationApi.getNotifications();
      const list = res?.data || res;
      if (Array.isArray(list) && list.length > 0) {
        const formatted = list.map(n => ({
          id: n._id || n.id,
          title: n.title,
          message: n.message,
          type: n.type || 'system',
          role: n.role,
          read: n.read || false,
          link: n.link || '',
          time: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
        }));
        set({ notifications: formatted });
      }
    } catch (err) {
      console.log('Notification fetch note:', err.message);
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id || n._id === id) ? { ...n, read: true } : n)
    }));
    try {
      await notificationApi.markAsRead(id);
    } catch (err) {
      console.log('Mark read API sync:', err.message);
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true }))
    }));
    try {
      await notificationApi.markAllAsRead();
    } catch (err) {
      console.log('Mark all read API sync:', err.message);
    }
  },

  addNotification: async (ntf) => {
    const created = {
      id: `NTF-${Date.now()}`,
      time: "Just now",
      read: false,
      ...ntf
    };
    set((state) => ({ notifications: [created, ...state.notifications] }));
    try {
      await notificationApi.createNotification(ntf);
    } catch (err) {
      console.log('Notification create note:', err.message);
    }
  }
}));
