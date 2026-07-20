import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import { RoleSwitcher } from './RoleSwitcher';
import { Avatar } from '../ui/Avatar';
import { Bell, Menu, Search, LogOut, ShieldCheck, UserCheck, CheckCheck } from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onOpenMobileMenu, onToggleSidebar }) => {
  const { user, role, logout } = useAuthStore();
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read && (n.role === role || !n.role)).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs gap-4">
      {/* Left: Mobile hamburger, Sidebar Toggle & Title / Search */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <button
          onClick={onToggleSidebar}
          className="hidden md:flex p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle sidebar width"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand logo visible on mobile header */}
        <div className="flex items-center gap-2 md:hidden">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs ${role === 'hr_admin' ? 'bg-[#534675]' : 'bg-[#9ec64c]'}`}>
            {role === 'hr_admin' ? 'HR' : 'ESS'}
          </div>
          <span className="font-bold text-[#2c2738] text-sm">SmartHRM</span>
        </div>

        {/* Header Breadcrumbs / Title & Search Bar (Desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="font-bold text-[#2c2738] text-sm whitespace-nowrap">HR Dashboard</span>
          <select className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1 text-slate-600 focus:outline-none">
            <option>Year 2026</option>
            <option>Year 2025</option>
          </select>
          <div className="relative w-48 xl:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs text-[#2c2738] placeholder-slate-400 focus:outline-none focus:border-[#534675]"
            />
          </div>
        </div>
      </div>

      {/* Middle & Right Header Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-600">
          <span className="cursor-pointer hover:text-[#534675]">Language ▾</span>
          <span className="cursor-pointer hover:text-[#534675]">Reports ▾</span>
          <span className="cursor-pointer hover:text-[#534675]">Project ▾</span>
        </div>

        {/* Role Switcher for instant live evaluation */}
        <RoleSwitcher />

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#e95f87] rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#e95f87] rounded-full" />
            )}
          </button>
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-[#2c2738] leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 mt-1 capitalize leading-none">{role === 'hr_admin' ? 'HR Admin' : 'Employee'}</p>
            </div>
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-card bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-[#2c2738]">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  navigate(role === 'hr_admin' ? '/hr/admin/settings' : '/employee/profile');
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2c2738] flex items-center gap-2"
              >
                {role === 'hr_admin' ? <ShieldCheck className="w-4 h-4 text-[#534675]" /> : <UserCheck className="w-4 h-4 text-[#9ec64c]" />}
                <span>My Profile & Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs text-rose-500 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Drawer */}
      <Drawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        title="Notification Center"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-xs text-slate-500">{unreadCount} unread messages</span>
            <button
              onClick={markAllAsRead}
              className="text-xs text-[#534675] hover:underline flex items-center gap-1 font-semibold"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all as read
            </button>
          </div>

          {notifications.map((ntf) => (
            <div
              key={ntf.id}
              onClick={() => markAsRead(ntf.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${ntf.read
                  ? 'bg-slate-50 border-slate-200 text-slate-500'
                  : 'bg-[#f4f2f9] border-[#534675]/30 text-[#2c2738] shadow-xs'
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-xs font-semibold">{ntf.title}</h4>
                <span className="text-[10px] text-slate-400">{ntf.time}</span>
              </div>
              <p className="text-xs text-slate-600">{ntf.message}</p>
            </div>
          ))}
        </div>
      </Drawer>
    </header>
  );
};
