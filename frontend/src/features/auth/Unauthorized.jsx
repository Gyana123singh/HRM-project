import React from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const { role } = useAuthStore();

  const handleReturn = () => {
    if (role === 'hr_admin') {
      navigate('/hr/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-[#2c2738] flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 max-w-md w-full shadow-xl relative overflow-hidden">
        <div className="w-20 h-20 bg-rose-50 border border-rose-200 rounded-3xl flex items-center justify-center text-rose-600 mx-auto mb-6 shadow-sm">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>

        <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-mono font-bold rounded-full border border-rose-200">
          HTTP 403 FORBIDDEN
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2c2738] mt-4 mb-2 tracking-tight">
          Access Denied
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
          You do not have the required administrative permissions to access HR Admin management features. Your account is restricted to Employee Self-Service.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleReturn} variant="primary" size="lg" icon={Home} className="w-full">
            Back to My Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
