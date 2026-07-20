import React, { useState } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { useAuthStore } from '../../../store/authStore';
import { useEmployeeStore } from '../../../store/employeeStore';
import { Clock, Calendar, DollarSign, FileText, Target, Folder } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const EmployeeDashboard = () => {
  const { user } = useAuthStore();
  const { isCheckedIn, checkInTime, toggleCheckIn, applyLeave } = useEmployeeStore();
  const navigate = useNavigate();

  const [timerStr, setTimerStr] = useState('06h 25m');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('2026-07-28');
  const [endDate, setEndDate] = useState('2026-07-29');
  const [leaveReason, setLeaveReason] = useState('');

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    applyLeave({ leaveType, startDate, endDate, totalDays: 2, reason: leaveReason });
    toast.success('Leave application submitted to HR Admin!');
    setIsLeaveModalOpen(false);
    setLeaveReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <PageHeader
        title={`Good Morning, ${user?.name?.split(' ')[0] || 'Rahul'} 👋`}
        subtitle="Monday, 20 July 2026 • Senior Frontend Developer (Engineering)"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsLeaveModalOpen(true)} variant="primary" icon={Calendar}>
              Apply Leave
            </Button>
            <Button onClick={() => navigate('/employee/expenses')} variant="secondary" icon={Folder}>
              Submit Expense
            </Button>
            <Button onClick={() => navigate('/employee/timesheets')} variant="outline" icon={FileText}>
              Add Timesheet
            </Button>
          </div>
        }
      />

      {/* Attendance & Leave Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Counter Widget */}
        <Card className="bg-white border-emerald-200 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Attendance Today</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {isCheckedIn ? 'Checked In' : 'Checked Out'}
              </h3>
            </div>
            <span className={`w-3 h-3 rounded-full ${isCheckedIn ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-medium">
            <div className="flex justify-between text-slate-500">
              <span>Check In Time:</span>
              <strong className="text-slate-800">{checkInTime}</strong>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Working Hours Today:</span>
              <strong className="text-emerald-600 font-mono text-sm font-bold">{timerStr}</strong>
            </div>
          </div>

          <Button
            onClick={() => {
              toggleCheckIn();
              toast.success(isCheckedIn ? 'Checked Out for the day!' : 'Checked In successfully!');
            }}
            variant={isCheckedIn ? 'danger' : 'accent'}
            size="lg"
            icon={Clock}
            className="w-full"
          >
            {isCheckedIn ? 'Check Out Now' : 'Check In Now'}
          </Button>
        </Card>

        {/* Leave Balances */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Casual Leave"
            value="6"
            description="Days Available"
            icon={Calendar}
            variant="cyan"
          />
          <StatCard
            title="Sick Leave"
            value="4"
            description="Days Available"
            icon={Calendar}
            variant="mint"
          />
          <StatCard
            title="Earned Leave"
            value="12"
            description="Days Available"
            icon={Calendar}
            variant="peach"
          />
        </div>
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Payslip Summary */}
        <Card className="space-y-4 bg-white">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Latest Payslip Summary (June 2026)
            </h3>
            <Button onClick={() => navigate('/employee/payslips')} variant="ghost" size="sm">
              View All ↗
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Gross Salary</span>
              <span className="text-slate-800 font-bold text-sm">$9,166.66</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Deductions</span>
              <span className="text-rose-600 font-bold text-sm">-$625.00</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 col-span-2">
              <span className="text-emerald-800 font-bold block">Net Salary Paid</span>
              <span className="text-emerald-600 font-black text-base">$8,541.66</span>
            </div>
          </div>
        </Card>

        {/* My Goals & Tasks */}
        <Card className="space-y-4 bg-white">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              My Q3 Goals & OKRs
            </h3>
            <Button onClick={() => navigate('/employee/goals')} variant="ghost" size="sm">
              View Goals ↗
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span className="text-slate-800">Migrate Micro-frontends to Vite</span>
                <span className="text-blue-600">85%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-600 w-[85%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply for Leave"
        subtitle="Submit leave request for HR Admin review."
        footer={
          <>
            <Button onClick={() => setIsLeaveModalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleLeaveSubmit} variant="primary">Submit Application</Button>
          </>
        }
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <Select
            label="Leave Type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            options={[
              { label: 'Casual Leave (6 Available)', value: 'Casual Leave' },
              { label: 'Sick Leave (4 Available)', value: 'Sick Leave' },
              { label: 'Earned Leave (12 Available)', value: 'Earned Leave' }
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Reason</label>
            <textarea
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              rows={3}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="State your reason for leave..."
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
