import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const RoleSwitcher = () => {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSwitchToRole = (targetRole) => {
    logout();
    navigate(`/login?role=${targetRole}`);
  };

  return (
    <div className="flex items-center bg-slate-100/90 p-0.5 sm:p-1 rounded-xl border border-slate-200 shrink-0">
      <button
        onClick={() => handleSwitchToRole('hr_admin')}
        className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${role === 'hr_admin'
            ? 'bg-[#534675] text-white shadow-xs border border-[#534675]/30'
            : 'text-slate-600 hover:text-[#2c2738]'
          }`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">HR ADMIN</span>
        <span className="sm:hidden">HR</span>
      </button>

      <button
        onClick={() => handleSwitchToRole('employee')}
        className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${role === 'employee'
            ? 'bg-[#9ec64c] text-white shadow-xs border border-[#9ec64c]/30'
            : 'text-slate-600 hover:text-[#2c2738]'
          }`}
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">EMPLOYEE</span>
        <span className="sm:hidden">ESS</span>
      </button>
    </div>
  );
};
