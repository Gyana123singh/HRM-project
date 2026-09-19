import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Drawer } from '../ui/Drawer';
import {
  LayoutDashboard, Building2, Users, Clock, DollarSign, Briefcase, Award,
  CheckSquare, Laptop, Megaphone, UserMinus, BarChart3, Bot, Settings,
  Calendar, FileCheck, Target, BookOpen, Folder, HelpCircle, User
} from 'lucide-react';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const { role } = useAuthStore();

  const hrItems = [
    { path: '/hr/dashboard', label: 'HR Dashboard', icon: LayoutDashboard },
    { path: '/hr/employees', label: 'All Employees', icon: Users },
    { path: '/hr/employees/add', label: 'Add Employee Wizard', icon: Users },
    { path: '/hr/attendance', label: 'Attendance & Regularization', icon: Clock },
    { path: '/hr/attendance/leave', label: 'Leave Approvals', icon: Calendar },
    { path: '/hr/payroll/structures', label: 'Salary Structures & Payslips', icon: DollarSign },
    { path: '/hr/lifecycle/onboarding', label: 'Onboarding & Goals', icon: Award },
    { path: '/hr/work/projects', label: 'Projects & Tasks', icon: CheckSquare },
    { path: '/hr/reports', label: 'HR Analytics', icon: BarChart3 },
    { path: '/hr/ai/assistant', label: 'AI HR Assistant', icon: Bot },
    { path: '/hr/admin/settings', label: 'Settings', icon: Settings },
    { path: '/careers', label: 'Public Career Portal ↗', external: true }
  ];

  const essItems = [
    { path: '/employee/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { path: '/employee/tasks', label: 'Projects & Tasks', icon: Target },
    { path: '/employee/payslips', label: 'Payslips & Salary', icon: DollarSign },
    { path: '/employee/goals', label: 'My Goals & OKRs', icon: Award },
    { path: '/employee/helpdesk', label: 'HR Help Desk', icon: HelpCircle },
    { path: '/employee/profile', label: 'My Profile', icon: User }
  ];

  const menuItems = role === 'hr_admin' ? hrItems : essItems;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      title={role === 'hr_admin' ? 'HR Admin Menu' : 'Employee Self-Service'}
    >
      <div className="space-y-1 pb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              target={item.external ? "_blank" : undefined}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm min-h-[44px] ${
                  isActive && !item.external
                    ? role === 'hr_admin'
                      ? 'bg-[#534675] text-white font-bold shadow-md'
                      : 'bg-[#9ec64c] text-white font-bold shadow-md'
                    : 'text-[#5c5670] hover:bg-slate-100 hover:text-[#2c2738]'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </Drawer>
  );
};
