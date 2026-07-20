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
    { path: '/hr/organization/profile', label: 'Organization Profile', icon: Building2 },
    { path: '/hr/organization/org-chart', label: 'Organization Chart', icon: Building2 },
    { path: '/hr/employees', label: 'All Employees', icon: Users },
    { path: '/hr/employees/add', label: 'Add Employee Wizard', icon: Users },
    { path: '/hr/attendance', label: 'Attendance & Regularization', icon: Clock },
    { path: '/hr/attendance/leave', label: 'Leave Approvals', icon: Calendar },
    { path: '/hr/payroll', label: 'Payroll Processing', icon: DollarSign },
    { path: '/hr/recruitment', label: 'Recruitment ATS', icon: Briefcase },
    { path: '/hr/lifecycle/onboarding', label: 'Onboarding & Goals', icon: Award },
    { path: '/hr/work/projects', label: 'Projects & Tasks', icon: CheckSquare },
    { path: '/hr/services/expenses', label: 'Expense Approvals', icon: Laptop },
    { path: '/hr/services/helpdesk', label: 'HR Help Desk', icon: HelpCircle },
    { path: '/hr/engagement/announcements', label: 'Announcements', icon: Megaphone },
    { path: '/hr/offboarding', label: 'Offboarding & Clearance', icon: UserMinus },
    { path: '/hr/reports', label: 'HR Analytics', icon: BarChart3 },
    { path: '/hr/ai/assistant', label: 'AI HR Assistant', icon: Bot },
    { path: '/hr/admin/settings', label: 'Settings', icon: Settings },
    { path: '/careers', label: 'Public Career Portal ↗', external: true }
  ];

  const essItems = [
    { path: '/employee/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { path: '/employee/attendance', label: 'Attendance & Regularization', icon: Clock },
    { path: '/employee/leave', label: 'Leave Requests', icon: Calendar },
    { path: '/employee/timesheets', label: 'Timesheets Entry', icon: FileCheck },
    { path: '/employee/tasks', label: 'Projects & Tasks', icon: Target },
    { path: '/employee/payslips', label: 'Payslips & Salary', icon: DollarSign },
    { path: '/employee/expenses', label: 'Expense Claims', icon: Folder },
    { path: '/employee/goals', label: 'My Goals & OKRs', icon: Target },
    { path: '/employee/training', label: 'Training Courses', icon: BookOpen },
    { path: '/employee/documents', label: 'Documents & Policies', icon: Folder },
    { path: '/employee/assets', label: 'Assigned Assets', icon: Laptop },
    { path: '/employee/helpdesk', label: 'HR Help Desk', icon: HelpCircle },
    { path: '/employee/directory', label: 'Employee Directory', icon: Users },
    { path: '/employee/announcements', label: 'Announcements', icon: Megaphone },
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
