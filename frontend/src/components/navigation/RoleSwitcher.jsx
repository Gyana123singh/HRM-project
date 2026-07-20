import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const RoleSwitcher = () => {
  const { role, switchRole } = useAuthStore();

  return (
    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
      <button
        onClick={() => switchRole('hr_admin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${role === 'hr_admin'
            ? 'bg-[#534675] text-white shadow-md shadow-[#534675]/20 border border-[#534675]/30'
            : 'text-slate-600 hover:text-[#2c2738]'
          }`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>HR ADMIN</span>
      </button>

      <button
        onClick={() => switchRole('employee')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${role === 'employee'
            ? 'bg-[#9ec64c] text-white shadow-md shadow-[#9ec64c]/20 border border-[#9ec64c]/30'
            : 'text-slate-600 hover:text-[#2c2738]'
          }`}
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span>EMPLOYEE</span>
      </button>
    </div>
  );
};
