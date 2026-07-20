import React from 'react';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const NotFound = () => {
  const navigate = useNavigate();
  const { role } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-[#2c2738] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 max-w-md w-full shadow-xl">
        <div className="w-20 h-20 bg-[#f0edf7] border border-[#dcd6e8] rounded-3xl flex items-center justify-center text-[#534675] mx-auto mb-6">
          <FileQuestion className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#2c2738] mb-2">404 - Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">The page or resource you are looking for does not exist or has been relocated.</p>
        <Button onClick={() => navigate(role === 'hr_admin' ? '/hr/dashboard' : '/employee/dashboard')} variant="primary" icon={Home} className="w-full">
          Return to Portal
        </Button>
      </div>
    </div>
  );
};
