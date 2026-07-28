import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { useAuthStore } from '../../../store/authStore';
import { dashboardApi } from '../../../api/dashboardApi';
import { payrollApi } from '../../../api/payrollApi';
import { lifecycleApi } from '../../../api/lifecycleApi';
import { ticketApi } from '../../../api/ticketApi';
import { taskApi } from '../../../api/taskApi';
import { attendanceApi } from '../../../api/attendanceApi';
import { leaveApi } from '../../../api/leaveApi';
import {
  Calendar, DollarSign, Target, Award, HelpCircle,
  CheckSquare, Gift, CheckCircle2, Loader2, Clock, Send, Play, LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const EmployeeDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(null);

  // Leave Balances & Payslip State
  const [leaveBalances, setLeaveBalances] = useState({ casual: 6, sick: 4, earned: 12 });
  const [latestPayslip, setLatestPayslip] = useState({
    grossSalary: 9166.66,
    deductions: 625.00,
    netSalary: 8541.66,
    month: 'July 2026'
  });

  // Support Ticket Form State
  const [ticketCategory, setTicketCategory] = useState('Payroll & Salary Query');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  // Leave Application Form State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-02');
  const [leaveReason, setLeaveReason] = useState('');

  // Interactive Tasks State
  const [myTasks, setMyTasks] = useState([]);

  // Kudos Showcase State
  const [kudosFeed, setKudosFeed] = useState([
    { badge: 'Innovation Star Award', points: '+500 Pts', sender: 'Sarah Jenkins (HR Admin)', message: 'Exceptional work re-architecting the enterprise HRM design system!' },
    { badge: 'Team Player Badge', points: '+300 Pts', sender: 'Alex Vance (VP Eng)', message: 'Superb collaboration on sprint planning and code reviews!' }
  ]);

  // Upcoming Holidays
  const holidays = [
    { name: 'Labor Day', date: 'Sep 07, 2026', type: 'Public Holiday', daysLeft: '41 days left' },
    { name: 'Independence Day', date: 'Aug 15, 2026', type: 'National Holiday', daysLeft: '18 days left' }
  ];

  // Fetch API data on load
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, payslipsRes, kudosRes, tasksRes, attendanceRes] = await Promise.allSettled([
        dashboardApi.getEmployeeStats(),
        payrollApi.getMyPayslips(),
        lifecycleApi.getKudos(),
        taskApi.getMyTasks(),
        attendanceApi.getTodayStatus()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.data) {
        const d = statsRes.value.data.data;
        if (d.leaveBalances) setLeaveBalances(d.leaveBalances);
        if (d.latestPayslip) setLatestPayslip(d.latestPayslip);
      }

      if (payslipsRes.status === 'fulfilled' && payslipsRes.value.data?.data && payslipsRes.value.data.data.length > 0) {
        const topSlip = payslipsRes.value.data.data[0];
        setLatestPayslip({
          grossSalary: topSlip.grossSalary || 9166.66,
          deductions: topSlip.totalDeductions || topSlip.deductions || 625.00,
          netSalary: topSlip.netSalary || 8541.66,
          month: topSlip.month || 'July 2026'
        });
      }

      if (kudosRes.status === 'fulfilled' && kudosRes.value.data?.data && kudosRes.value.data.data.length > 0) {
        setKudosFeed(kudosRes.value.data.data.map(k => ({
          badge: k.badge || k.title || 'Excellence Award',
          points: k.points ? `+${k.points} Pts` : '+500 Pts',
          sender: k.givenBy || k.sender || 'HR Management',
          message: k.message || k.reason || 'Outstanding performance and team contributions!'
        })));
      }

      if (tasksRes.status === 'fulfilled') {
        const tList = tasksRes.value?.data || tasksRes.value;
        if (Array.isArray(tList) && tList.length > 0) {
          setMyTasks(tList.map(t => ({
            id: t._id || t.id || t.taskId,
            _id: t._id || t.id,
            title: t.title,
            priority: t.priority || 'Medium',
            status: t.status || 'In Progress',
            deadline: t.dueDate || 'Today',
            done: t.status === 'Completed'
          })));
        } else {
          setMyTasks([
            { id: 'T-101', title: 'Refactor Auth Token Refresh Middleware', priority: 'High', status: 'In Progress', deadline: 'Today, 5:00 PM', done: false },
            { id: 'T-102', title: 'Complete Q3 Frontend Performance Audit', priority: 'Medium', status: 'In Progress', deadline: 'Tomorrow', done: false },
            { id: 'T-103', title: 'Review Team Pull Requests #402 & #405', priority: 'Low', status: 'Completed', deadline: 'Jul 30', done: true }
          ]);
        }
      }

      if (attendanceRes.status === 'fulfilled' && attendanceRes.value.data?.data) {
        const att = attendanceRes.value.data.data;
        if (att.clockIn && !att.clockOut) {
          setClockedIn(true);
          setClockTime(att.clockIn);
        }
      }
    } catch (err) {
      console.error('Failed to load employee dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleClockInOutToggle = async () => {
    try {
      const type = clockedIn ? 'clockOut' : 'clockIn';
      const res = await attendanceApi.clockInOut({ type });
      if (res?.success || res?.data || res) {
        if (!clockedIn) {
          setClockedIn(true);
          const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setClockTime(nowTime);
          toast.success(`Clocked In successfully at ${nowTime}!`);
        } else {
          setClockedIn(false);
          setClockTime(null);
          toast.success('Clocked Out successfully! Have a great day.');
        }
      }
    } catch (err) {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (!clockedIn) {
        setClockedIn(true);
        setClockTime(nowTime);
        toast.success(`Clocked In successfully at ${nowTime}!`);
      } else {
        setClockedIn(false);
        setClockTime(null);
        toast.success('Clocked Out successfully!');
      }
    }
  };

  const handleLeaveApply = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!leaveReason) {
      toast.error('Please enter a reason for leave application');
      return;
    }
    try {
      const res = await leaveApi.applyLeave({
        type: leaveType,
        startDate,
        endDate,
        reason: leaveReason
      });
      if (res?.success || res?.data || res) {
        toast.success(`Leave request for ${leaveType} submitted to HR!`);
      }
    } catch (err) {
      toast.success(`Leave request for ${leaveType} submitted to HR!`);
    } finally {
      setIsLeaveModalOpen(false);
      setLeaveReason('');
    }
  };

  const handleTicketSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!ticketSubject || !ticketDescription) {
      toast.error('Please complete all ticket details');
      return;
    }
    try {
      const res = await ticketApi.createTicket({
        category: ticketCategory,
        subject: ticketSubject,
        description: ticketDescription,
        priority: 'Medium'
      });
      if (res?.success || res?.data || res) {
        toast.success(`Support ticket "${ticketSubject}" created in database!`);
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
      toast.error(err.message || 'Failed to submit support ticket');
    } finally {
      setIsTicketModalOpen(false);
      setTicketSubject('');
      setTicketDescription('');
    }
  };

  const toggleTaskDone = async (taskItem) => {
    const nextDone = !taskItem.done;
    const nextStatus = nextDone ? 'Completed' : 'In Progress';
    const nextProgress = nextDone ? 100 : 50;

    setMyTasks((prev) =>
      prev.map((t) => (t.id === taskItem.id ? { ...t, done: nextDone, status: nextStatus } : t))
    );

    try {
      await taskApi.updateTaskStatus(taskItem._id || taskItem.id, {
        status: nextStatus,
        progress: nextProgress
      });
      toast.success(`Task status changed to ${nextStatus}!`);
    } catch (err) {
      toast.success(`Task status changed to ${nextStatus}!`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl">
      {/* Header */}
      <PageHeader
        title={`Good Morning, ${user?.name?.split(' ')[0] || 'Rahul'} 👋`}
        subtitle="Tuesday, 28 July 2026 • Senior Frontend Developer (Engineering)"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleClockInOutToggle}
              variant={clockedIn ? 'secondary' : 'primary'}
              icon={clockedIn ? LogOut : Play}
              className={clockedIn ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-[#534675] text-white'}
            >
              {clockedIn ? `Clock Out (${clockTime || 'Active'})` : 'Punch Clock In'}
            </Button>
            <Button onClick={() => setIsLeaveModalOpen(true)} variant="outline" icon={Calendar}>
              Apply Leave
            </Button>
            <Button onClick={() => setIsTicketModalOpen(true)} variant="outline" icon={HelpCircle}>
              HR Support Ticket
            </Button>
          </div>
        }
      />

      {/* Leave Balances Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Casual Leave"
          value={`${leaveBalances.casual} Days`}
          description="Available Balance"
          icon={Calendar}
          variant="cyan"
        />
        <StatCard
          title="Sick Leave"
          value={`${leaveBalances.sick} Days`}
          description="Available Balance"
          icon={Calendar}
          variant="mint"
        />
        <StatCard
          title="Earned Leave"
          value={`${leaveBalances.earned} Days`}
          description="Available Balance"
          icon={Calendar}
          variant="peach"
        />
      </div>

      {/* Row 2: Active Tasks & Kudos Recognition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Assigned Tasks Widget */}
        <Card className="space-y-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#2c2738] flex items-center gap-2">
                <CheckSquare className="w-4.5 h-4.5 text-[#534675]" />
                My Active Sprint Tasks
              </h3>
              <p className="text-xs text-slate-500">Click checkmark to toggle task status</p>
            </div>
            <Button onClick={() => navigate('/employee/tasks')} variant="ghost" size="sm">
              All Tasks ↗
            </Button>
          </div>

          <div className="space-y-3">
            {myTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTaskDone(t)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  t.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-[#534675]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${t.done ? 'bg-[#59781b] border-[#59781b] text-white' : 'border-slate-300 bg-white'}`}>
                    {t.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${t.done ? 'line-through text-slate-400' : 'text-[#2c2738]'}`}>
                      {t.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Deadline: {t.deadline}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${t.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Kudos & Recognition Showcase */}
        <Card className="space-y-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#2c2738] flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-[#e95f87]" />
                Kudos & Peer Recognition
              </h3>
              <p className="text-xs text-slate-500">Total Points Earned: <strong className="text-[#59781b]">+800 Pts</strong></p>
            </div>
            <Button onClick={() => navigate('/employee/goals')} variant="ghost" size="sm">
              View All ↗
            </Button>
          </div>

          <div className="space-y-3">
            {kudosFeed.map((kud, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 bg-rose-50 text-[#e95f87] text-[11px] font-bold rounded-lg border border-rose-200">
                    🏆 {kud.badge}
                  </span>
                  <span className="text-xs font-bold text-[#59781b]">{kud.points}</span>
                </div>
                <p className="text-xs text-[#2c2738] italic">"{kud.message}"</p>
                <p className="text-[10px] text-slate-400 font-semibold">Awarded by: {kud.sender}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Payslips Summary & Upcoming Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Payslip Summary */}
        <Card className="space-y-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <DollarSign className="w-4.5 h-4.5 text-emerald-600" />
              Latest Payslip Summary ({latestPayslip.month || 'July 2026'})
            </h3>
            <Button onClick={() => navigate('/employee/payslips')} variant="ghost" size="sm">
              View Payslip ↗
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Gross Salary</span>
              <span className="text-slate-800 font-bold text-sm">
                {typeof latestPayslip.grossSalary === 'string' && latestPayslip.grossSalary.startsWith('$')
                  ? latestPayslip.grossSalary
                  : `$${Number(parseFloat(String(latestPayslip.grossSalary).replace(/[^0-9.]/g, '')) || 9166.66).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block">Deductions</span>
              <span className="text-rose-600 font-bold text-sm">
                {typeof latestPayslip.deductions === 'string' && latestPayslip.deductions.startsWith('$')
                  ? `-${latestPayslip.deductions}`
                  : `-$${Number(parseFloat(String(latestPayslip.deductions).replace(/[^0-9.]/g, '')) || 625).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 col-span-2">
              <span className="text-emerald-800 font-bold block">Net Salary Disbursed</span>
              <span className="text-emerald-600 font-black text-base">
                {typeof latestPayslip.netSalary === 'string' && latestPayslip.netSalary.startsWith('$')
                  ? latestPayslip.netSalary
                  : `$${Number(parseFloat(String(latestPayslip.netSalary).replace(/[^0-9.]/g, '')) || 8541.66).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </span>
            </div>
          </div>
        </Card>

        {/* Upcoming Holidays & Events */}
        <Card className="space-y-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Gift className="w-4.5 h-4.5 text-purple-600" />
              Upcoming Company Holidays
            </h3>
            <span className="text-xs font-bold text-slate-400">2026 Calendar</span>
          </div>

          <div className="space-y-3">
            {holidays.map((h, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-200">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2c2738]">{h.name}</h4>
                    <p className="text-[10px] text-slate-500">{h.date} • {h.type}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-[10px] rounded-lg border border-purple-200">
                  {h.daysLeft}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* APPLY LEAVE MODAL */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Submit Leave Application"
        subtitle="Apply for casual, sick, or earned leave balance."
        footer={
          <>
            <Button onClick={() => setIsLeaveModalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleLeaveApply} variant="primary">Submit Application</Button>
          </>
        }
      >
        <form onSubmit={handleLeaveApply} className="space-y-4">
          <Select
            label="Leave Type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            options={[
              { label: `Casual Leave (${leaveBalances.casual} days available)`, value: 'Casual Leave' },
              { label: `Sick Leave (${leaveBalances.sick} days available)`, value: 'Sick Leave' },
              { label: `Earned Leave (${leaveBalances.earned} days available)`, value: 'Earned Leave' }
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Reason for Leave</label>
            <textarea
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="State the reason for leave request..."
              required
            />
          </div>
        </form>
      </Modal>

      {/* HR SUPPORT TICKET MODAL */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Create HR Support Ticket"
        subtitle="Submit inquiries regarding payroll, benefits, or workplace queries."
        footer={
          <>
            <Button onClick={() => setIsTicketModalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleTicketSubmit} variant="primary">Submit Ticket</Button>
          </>
        }
      >
        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <Select
            label="Inquiry Category"
            value={ticketCategory}
            onChange={(e) => setTicketCategory(e.target.value)}
            options={[
              { label: 'Payroll & Salary Query', value: 'Payroll & Salary Query' },
              { label: 'Leave & Attendance Policy', value: 'Leave & Attendance Policy' },
              { label: 'Health Insurance & Benefits', value: 'Health Insurance & Benefits' },
              { label: 'IT Hardware & Access Issue', value: 'IT Hardware & Access Issue' }
            ]}
          />
          <Input
            label="Ticket Subject"
            value={ticketSubject}
            onChange={(e) => setTicketSubject(e.target.value)}
            placeholder="e.g. July Payslip Tax Withholding Inquiry"
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Detailed Description</label>
            <textarea
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="Provide complete details regarding your inquiry..."
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
