import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('hr@hrm.com');
  const [password, setPassword] = useState('HrPass123!');
  const [selectedRole, setSelectedRole] = useState('hr_admin');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login(email, password, selectedRole);
      setIsLoading(false);
      toast.success(`Logged in successfully as ${selectedRole === 'hr_admin' ? 'HR Admin' : 'Employee'}`);
      if (selectedRole === 'hr_admin') {
        navigate('/hr/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickPreset = (roleType) => {
    setSelectedRole(roleType);
    if (roleType === 'hr_admin') {
      setEmail('hr@hrm.com');
      setPassword('HrPass123!');
    } else {
      setEmail('employee@hrm.com');
      setPassword('EmpPass123!');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-[#2c2738] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#534675]/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#e95f87]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#534675] mx-auto flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#534675]/20">
            NX
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2c2738] tracking-tight">SmartHRM Portal</h1>
          <p className="text-xs sm:text-sm text-slate-500">Enterprise Human Resource Management System</p>
        </div>

        {/* Login Card */}
        <div className="glass-card bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Role Selection Switcher */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">
              Select Portal Role
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleQuickPreset('hr_admin')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${selectedRole === 'hr_admin'
                    ? 'bg-[#534675] text-white shadow-md shadow-[#534675]/20'
                    : 'text-slate-600 hover:text-[#2c2738]'
                  }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>HR Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('employee')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${selectedRole === 'employee'
                    ? 'bg-[#9ec64c] text-white shadow-md shadow-[#9ec64c]/20'
                    : 'text-slate-600 hover:text-[#2c2738]'
                  }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Employee ESS</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Work Email Address"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-white border-slate-300 text-[#534675]" />
                <span>Remember Me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Password reset link dispatched to work email"); }} className="text-[#534675] font-semibold hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              variant={selectedRole === 'hr_admin' ? 'primary' : 'accent'}
              size="lg"
              isLoading={isLoading}
              icon={ArrowRight}
              className="w-full mt-2"
            >
              Sign In to {selectedRole === 'hr_admin' ? 'HR Portal' : 'Employee ESS'}
            </Button>
          </form>

          {/* Preset Helper Bar */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 mb-2">Quick Test Login Presets:</p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('hr_admin')}
                className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-[#534675] font-semibold hover:bg-slate-200"
              >
                Preset HR Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('employee')}
                className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-[#59781b] font-semibold hover:bg-slate-200"
              >
                Preset Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
