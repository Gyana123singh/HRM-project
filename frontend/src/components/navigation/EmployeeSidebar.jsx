import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, DollarSign, Target, Award, HelpCircle, User
} from 'lucide-react';

export const EmployeeSidebar = ({ collapsed }) => {
  const essGroups = [
    {
      label: 'EMPLOYEE PORTAL',
      items: [
        { path: '/employee/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        { path: '/employee/tasks', label: 'Projects & Tasks', icon: Target },
        { path: '/employee/payslips', label: 'Payslips & Salary', icon: DollarSign },
        { path: '/employee/goals', label: 'My Goals & OKRs', icon: Award },
        { path: '/employee/helpdesk', label: 'HR Help Desk', icon: HelpCircle },
        { path: '/employee/profile', label: 'My Profile', icon: User }
      ]
    }
  ];

  return (
    <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} shrink-0 h-full select-none`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-white">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#9ec64c] flex items-center justify-center text-white font-black tracking-widest text-lg shadow-md shadow-[#9ec64c]/20">
              ESS
            </div>
            <div>
              <span className="font-bold text-[#2c2738] tracking-tight text-base block">SmartHRM</span>
              <span className="text-[10px] uppercase tracking-wider text-[#59781b] font-bold">Employee Self-Service</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 mx-auto rounded-xl bg-[#9ec64c] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#9ec64c]/20">
            ESS
          </div>
        )}
      </div>

      {/* ESS Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4 no-scrollbar">
        {essGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-xs sm:text-sm ${isActive
                      ? 'bg-white text-[#2c2738] border border-[#2c2738] font-bold shadow-xs'
                      : 'text-[#5c5670] hover:text-[#2c2738] hover:bg-[#f4f2f9]'
                    }`
                  }
                >
                  <ItemIcon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};
