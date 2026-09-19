import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { useHRStore } from '../../../store/hrStore';
import { useAuthStore } from '../../../store/authStore';
import { dashboardApi } from '../../../api';
import {
  Users, Calendar, CreditCard, Calculator, FileText, Sun, ToggleLeft, ToggleRight,
  TrendingUp, ArrowUpRight, Plus, Megaphone, DollarSign, Sparkles, ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const HRDashboard = () => {
  const { employees, addAnnouncement } = useHRStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [salaryToggle, setSalaryToggle] = useState(true);
  const [isAncModalOpen, setIsAncModalOpen] = useState(false);
  const [ancTitle, setAncTitle] = useState('');
  const [ancCategory, setAncCategory] = useState('General');
  const [ancContent, setAncContent] = useState('');

  // Dashboard API Stats State (Populated exclusively from real database data)
  const [dashboardData, setDashboardData] = useState({
    summary: null,
    salaryStats: [],
    revenueDonut: [],
    balanceTrend: [],
    bankBalances: {
      totalBalance: '₹0',
      bankOfAmerica: '₹0',
      rbcBank: '₹0',
      frostBank: '₹0'
    },
    employeeStructure: [],
    performanceTeams: [],
    projectSummary: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardStats = async () => {
      try {
        const res = await dashboardApi.getStats();
        const d = res?.data || res;
        if (isMounted && d) {
          setDashboardData({
            summary: d.summary || null,
            salaryStats: d.salaryStats || [],
            revenueDonut: d.revenueDonut || [],
            balanceTrend: d.balanceTrend || [],
            bankBalances: d.bankBalances || {
              totalBalance: '₹0',
              bankOfAmerica: '₹0',
              rbcBank: '₹0',
              frostBank: '₹0'
            },
            employeeStructure: d.employeeStructure || [],
            performanceTeams: d.performanceTeams || [],
            projectSummary: d.projectSummary || []
          });
        }
      } catch (error) {
        console.log('Dashboard stats load note:', error.message);
      }
    };

    fetchDashboardStats();
    return () => { isMounted = false; };
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!ancTitle || !ancContent) return;

    setIsSubmitting(true);
    try {
      await dashboardApi.createAnnouncement({
        title: ancTitle,
        category: ancCategory,
        content: ancContent,
        priority: 'Normal'
      });
      
      addAnnouncement({ title: ancTitle, category: ancCategory, content: ancContent, priority: 'Normal' });
      toast.success('Announcement published to company portal!');
      setIsAncModalOpen(false);
      setAncTitle('');
      setAncContent('');
    } catch (err) {
      addAnnouncement({ title: ancTitle, category: ancCategory, content: ancContent, priority: 'Normal' });
      toast.success('Announcement published locally!');
      setIsAncModalOpen(false);
      setAncTitle('');
      setAncContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeUserTitle = user?.name || user?.email?.split('@')[0] || 'HR Manager';
  const totalUsersCount = dashboardData.summary?.totalEmployees ?? employees?.length ?? 0;
  const openJobsCount = dashboardData.summary?.openJobs ?? 0;

  return (
    <div className="space-y-6 animate-fade-in pb-8 text-[#2c2738]">
      {/* Top Banner Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2c2738] tracking-tight capitalize">
          Welcome {activeUserTitle}!
        </h1>
        <p className="text-xs text-[#8c869e]">
          Real-time Workforce Overview & Aggregated Enterprise Metrics
        </p>
      </div>

      {/* Quick Action Icon Cards Row (6 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Users */}
        <div onClick={() => navigate('/hr/employees')} className="relative glass-card bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group">
          <div className="absolute top-0 left-0 bg-[#9ec64c] text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg rounded-tl-2xl">
            {totalUsersCount}
          </div>
          <Users className="w-8 h-8 text-[#7b6d9e] group-hover:scale-110 transition-transform mb-2 mt-1" />
          <span className="text-xs font-semibold text-slate-600">Users</span>
        </div>

        {/* Card 2: Holidays */}
        <div onClick={() => navigate('/hr/attendance/calendar')} className="relative glass-card bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group">
          <Sun className="w-8 h-8 text-[#7b6d9e] group-hover:scale-110 transition-transform mb-2 mt-1" />
          <span className="text-xs font-semibold text-slate-600">Holidays</span>
        </div>

        {/* Card 3: Events / Jobs */}
        <div onClick={() => navigate('/hr/attendance/calendar')} className="relative glass-card bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group">
          <div className="absolute top-0 left-0 bg-[#534675] text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg rounded-tl-2xl">
            {openJobsCount}
          </div>
          <Calendar className="w-8 h-8 text-[#7b6d9e] group-hover:scale-110 transition-transform mb-2 mt-1" />
          <span className="text-xs font-semibold text-slate-600">Events</span>
        </div>

        {/* Card 4: Payroll */}
        <div onClick={() => navigate('/hr/payroll')} className="relative glass-card bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group">
          <CreditCard className="w-8 h-8 text-[#7b6d9e] group-hover:scale-110 transition-transform mb-2 mt-1" />
          <span className="text-xs font-semibold text-slate-600">Payroll</span>
        </div>

        {/* Card 5: Accounts */}
        <div onClick={() => navigate('/hr/payroll/structures')} className="relative glass-card bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group">
          <Calculator className="w-8 h-8 text-[#7b6d9e] group-hover:scale-110 transition-transform mb-2 mt-1" />
          <span className="text-xs font-semibold text-slate-600">Accounts</span>
        </div>

        {/* Card 6: Report */}
        <div onClick={() => navigate('/hr/reports')} className="relative glass-card bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group">
          <FileText className="w-8 h-8 text-[#7b6d9e] group-hover:scale-110 transition-transform mb-2 mt-1" />
          <span className="text-xs font-semibold text-slate-600">Report</span>
        </div>
      </div>

      {/* Row 1: 3 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Column 1: SALARY STATISTICS (2 cols) */}
        <Card className="lg:col-span-2 space-y-4 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">SALARY STATISTICS</h3>
            <button onClick={() => setSalaryToggle(!salaryToggle)} className="text-[#534675] hover:opacity-80 transition-opacity">
              {salaryToggle ? <ToggleRight className="w-7 h-7 text-[#534675]" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.salaryStats} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0edf7" />
                <XAxis dataKey="month" stroke="#8c869e" fontSize={11} tickLine={false} />
                <YAxis stroke="#8c869e" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#eaedf2', borderRadius: '12px', color: '#2c2738', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="productA" stackId="a" fill="#534675" radius={[0, 0, 0, 0]} />
                <Bar dataKey="productB" stackId="a" fill="#7b6d9e" />
                <Bar dataKey="productC" stackId="a" fill="#a294c7" />
                <Bar dataKey="productD" stackId="a" fill="#c5bcde" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend indicator */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pb-2">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#534675]" /> BASIC</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#7b6d9e]" /> HRA</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#a294c7]" /> ALLOWANCE</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#c5bcde]" /> OTHER</span>
          </div>

          {/* Card Footer inside */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button onClick={() => navigate('/hr/reports')} className="bg-[#e95f87] hover:bg-[#d84c75] text-white px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs shrink-0">
              Generate Report
            </button>
            <p className="text-[11px] text-slate-400 text-center sm:text-right">
              Live aggregated monthly salary distribution based on active database records.
            </p>
          </div>
        </Card>

        {/* Column 2: REVENUE (1 col) */}
        <Card className="space-y-4 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">DEPARTMENT ALLOCATION</h3>

          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.revenueDonut}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                >
                  {dashboardData.revenueDonut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#eaedf2', borderRadius: '12px', color: '#2c2738' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 flex-wrap">
            {dashboardData.revenueDonut.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
            ))}
          </div>

          <div className="text-center pt-2">
            <h4 className="text-xl font-bold text-[#2c2738]">
              {dashboardData.summary?.totalPayrollCost != null ? `₹${Number(dashboardData.summary.totalPayrollCost).toLocaleString('en-IN')}` : '₹0'}
            </h4>
            <p className="text-[11px] text-slate-400">Total active workforce monthly payroll</p>
          </div>

          <button onClick={() => navigate('/hr/reports')} className="w-full bg-[#534675] hover:bg-[#433761] text-white py-2 rounded-lg text-xs font-bold transition-all shadow-xs mt-2">
            Send Report
          </button>
        </Card>

        {/* Column 3: MY BALANCE (1 col) */}
        <Card className="space-y-4 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">MY BALANCE</h3>
            <p className="text-[11px] text-slate-400">Total Active Payroll Liability</p>
            <h4 className="text-2xl font-bold text-[#2c2738] tracking-tight">{dashboardData.bankBalances.totalBalance}</h4>
          </div>

          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.balanceTrend} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38b6ff" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38b6ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="balance" stroke="#38b6ff" strokeWidth={2.5} fillOpacity={1} fill="url(#balanceColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between items-center border-b border-[#534675]/30 pb-1.5">
              <span className="text-slate-600 font-medium">HDFC / Primary Bank</span>
              <span className="font-bold text-[#2c2738]">{dashboardData.bankBalances?.bankOfAmerica || '₹0'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#e95f87] pb-1.5">
              <span className="text-slate-600 font-medium">ICICI Bank</span>
              <span className="font-bold text-[#2c2738]">{dashboardData.bankBalances?.rbcBank || '₹0'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
              <span className="text-slate-600 font-medium">SBI / Other Banks</span>
              <span className="font-bold text-[#2c2738]">{dashboardData.bankBalances?.frostBank || '₹0'}</span>
            </div>
          </div>

          <button onClick={() => navigate('/hr/payroll')} className="w-full bg-[#e95f87] hover:bg-[#d84c75] text-white py-2 rounded-lg text-xs font-bold transition-all shadow-xs mt-2">
            View More
          </button>
        </Card>
      </div>

      {/* Row 2: 3 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Column 1: EMPLOYEE STRUCTURE (2 cols) */}
        <Card className="lg:col-span-2 space-y-4 bg-white border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">EMPLOYEE STRUCTURE</h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.employeeStructure} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0edf7" />
                <XAxis dataKey="month" stroke="#8c869e" fontSize={11} tickLine={false} />
                <YAxis stroke="#8c869e" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#eaedf2', borderRadius: '12px', color: '#2c2738' }}
                />
                <Bar dataKey="netProfit" fill="#4b4068" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#7b6d9e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="freeCashFlow" fill="#a294c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#4b4068]" /> Net Profit</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#7b6d9e]" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#a294c7]" /> Free Cash Flow</span>
          </div>
        </Card>

        {/* Column 2: PERFORMANCE (1 col) */}
        <Card className="space-y-4 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">PERFORMANCE</h3>
            <p className="text-[11px] text-slate-400">
              Measure How Fast You're Growing Monthly Recurring Revenue. <a href="#" className="underline hover:text-[#534675]">Learn More</a>
            </p>
          </div>

          <div className="space-y-4 py-2">
            {dashboardData.performanceTeams.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2c2738]">{item.percent}</span>
                  <span className="text-slate-500">{item.name}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.barColor} rounded-full`} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Column 3: GROWTH (1 col) */}
        <Card className="space-y-4 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">GROWTH</h3>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.revenueDonut}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  dataKey="value"
                >
                  {dashboardData.revenueDonut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#eaedf2', borderRadius: '12px', color: '#2c2738' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 flex-wrap">
            {dashboardData.revenueDonut.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: PROJECT SUMMARY Table */}
      <Card className="space-y-4 bg-white border border-slate-200 shadow-xs overflow-hidden">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">PROJECT SUMMARY</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2c2738]">
            <thead className="bg-slate-50 uppercase font-bold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">CLIENT NAME</th>
                <th className="px-4 py-3">TEAM</th>
                <th className="px-4 py-3">PROJECT</th>
                <th className="px-4 py-3">PROJECT COST</th>
                <th className="px-4 py-3">PAYMENT</th>
                <th className="px-4 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboardData.projectSummary.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-slate-400">{row.id}</td>
                  <td className="px-4 py-3.5 font-bold text-[#2c2738]">{row.client}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-600">{row.teamCount} Members</td>
                  <td className="px-4 py-3.5 font-medium">{row.project}</td>
                  <td className="px-4 py-3.5 font-bold">{row.cost}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-600">{row.payment}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${row.badgeClass}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Floating Assistant Drawer / Trigger */}
      <div className="flex justify-end pt-2">
        <Button onClick={() => setIsAncModalOpen(true)} variant="secondary" icon={Megaphone}>
          Publish Company Announcement
        </Button>
      </div>

      {/* Modal: Create Announcement */}
      <Modal
        isOpen={isAncModalOpen}
        onClose={() => setIsAncModalOpen(false)}
        title="Publish Company Announcement"
        subtitle="Broadcast important news across the entire workforce portal."
        footer={
          <>
            <Button onClick={() => setIsAncModalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateAnnouncement} variant="primary" isLoading={isSubmitting}>Publish Announcement</Button>
          </>
        }
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <Input
            label="Announcement Title"
            value={ancTitle}
            onChange={(e) => setAncTitle(e.target.value)}
            placeholder="e.g. Q3 Townhall Meeting & Holiday Schedule"
            required
          />

          <Select
            label="Category"
            value={ancCategory}
            onChange={(e) => setAncCategory(e.target.value)}
            options={[
              { label: 'General Announcement', value: 'General' },
              { label: 'Policy Update', value: 'Policy Update' },
              { label: 'Event', value: 'Event' },
              { label: 'Emergency Notice', value: 'Emergency' }
            ]}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Content</label>
            <textarea
              value={ancContent}
              onChange={(e) => setAncContent(e.target.value)}
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="Enter announcement details..."
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
