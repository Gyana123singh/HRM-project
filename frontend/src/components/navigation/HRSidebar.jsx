import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, Clock, DollarSign, Briefcase, Award,
  CheckSquare, ShieldAlert, Megaphone, UserMinus, BarChart3, Bot, Settings,
  ChevronDown, ChevronRight, Layers, FileText, Calendar, HelpCircle, Laptop
} from 'lucide-react';

export const HRSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({
    dashboard: true,
    organization: true,
    employees: true,
    attendance: false,
    payroll: false,
    recruitment: false,
    lifecycle: false,
    work: false,
    services: false,
    engagement: false,
    offboarding: false,
    reports: false,
    ai: false,
    admin: false
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navGroups = [
    {
      key: 'dashboard',
      label: 'DASHBOARD',
      icon: LayoutDashboard,
      items: [
        { path: '/hr/dashboard', label: 'HR Dashboard' }
      ]
    },
    {
      key: 'employees',
      label: 'EMPLOYEES',
      icon: Users,
      items: [
        { path: '/hr/employees', label: 'All Employees' },
        { path: '/hr/employees/add', label: 'Add Employee' }
      ]
    },
    {
      key: 'attendance',
      label: 'TIME & ATTENDANCE',
      icon: Clock,
      items: [
        { path: '/hr/attendance', label: 'Attendance' },
        { path: '/hr/attendance/regularization', label: 'Regularization' },
        { path: '/hr/attendance/shifts', label: 'Shift Management' },
        { path: '/hr/attendance/leave', label: 'Leave Approvals' },
        { path: '/hr/attendance/calendar', label: 'HR Calendar' }
      ]
    },
    {
      key: 'payroll',
      label: 'PAYROLL',
      icon: DollarSign,
      items: [
        { path: '/hr/payroll', label: 'Payroll Processing' },
        { path: '/hr/payroll/structures', label: 'Salary Structures' },
        { path: '/hr/payroll/payslips', label: 'Payslips' }
      ]
    },
    {
      key: 'work',
      label: 'WORK MANAGEMENT',
      icon: CheckSquare,
      items: [
        { path: '/hr/work/projects', label: 'Projects & Tasks' },
        { path: '/hr/work/timesheets', label: 'Timesheet Approvals' }
      ]
    },
    {
      key: 'reports',
      label: 'REPORTS & ANALYTICS',
      icon: BarChart3,
      items: [
        { path: '/hr/reports', label: 'HR Analytics' }
      ]
    },
    {
      key: 'ai',
      label: 'AI SUITE',
      icon: Bot,
      items: [
        { path: '/hr/ai/assistant', label: 'AI HR Assistant' },
        { path: '/hr/ai/screening', label: 'Resume Screening' }
      ]
    },
    {
      key: 'admin',
      label: 'ADMINISTRATION',
      icon: Settings,
      items: [
        { path: '/hr/admin/settings', label: 'Settings & Audit Logs' }
      ]
    }
  ];

  return (
    <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} shrink-0 h-full select-none`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#534675] flex items-center justify-center text-white font-black tracking-widest text-lg shadow-md shadow-[#534675]/20">
              H
            </div>
            <div>
              <span className="font-bold text-[#2c2738] tracking-tight text-base block">Epic HR</span>
              <span className="text-[10px] uppercase tracking-wider text-[#e95f87] font-bold">HR Admin Portal</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 mx-auto rounded-xl bg-[#534675] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#534675]/20">
            H
          </div>
        )}
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2 no-scrollbar">
        {navGroups.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = openGroups[group.key];
          const isChildActive = group.items.some((item) => location.pathname === item.path);

          if (collapsed) {
            return (
              <div key={group.key} className="relative group/tooltip flex justify-center py-2">
                <div className={`p-2.5 rounded-xl transition-all ${isChildActive ? 'bg-[#534675] text-white' : 'text-slate-500 hover:text-[#2c2738] hover:bg-[#f4f2f9]'}`}>
                  <GroupIcon className="w-5 h-5" />
                </div>
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#2c2738] text-white text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity z-50 shadow-xl">
                  {group.label}
                </div>
              </div>
            );
          }

          return (
            <div key={group.key} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.key)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold tracking-wider rounded-xl transition-all ${isChildActive ? 'text-[#534675] bg-[#f4f2f9]' : 'text-slate-500 hover:text-[#2c2738] hover:bg-[#f4f2f9]'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <GroupIcon className="w-4 h-4 text-[#534675]" />
                  <span>{group.label}</span>
                </div>
                {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {isOpen && (
                <div className="pl-6 space-y-1 border-l border-slate-200 ml-4">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      target={item.external ? "_blank" : undefined}
                      className={({ isActive }) =>
                        `block px-3 py-1.5 text-xs rounded-lg transition-colors font-medium ${isActive && !item.external
                          ? 'bg-white text-[#2c2738] border border-[#2c2738] font-bold shadow-xs'
                          : 'text-[#5c5670] hover:text-[#2c2738] hover:bg-[#f4f2f9]'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
