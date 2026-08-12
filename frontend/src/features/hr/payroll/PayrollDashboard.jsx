import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { payrollData, employeesList } from '../../../data/mockData';
import { payrollApi } from '../../../api/payrollApi';
import { employeeApi } from '../../../api/employeeApi';
import { InfotattvaPayslipTemplate } from './InfotattvaPayslipTemplate';
import { downloadPayslipPdf } from '../../../utils/pdfDownload';
import {
  DollarSign, CheckCircle, Calculator, FileText, Download, Play, Plus,
  Search, ShieldCheck, Briefcase, CreditCard, ArrowUpRight, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const initialStructures = [
  { id: 'STR-01', name: 'Executive Level (L7)', basic: '50%', hra: '20%', conveyance: '10%', specialAllowance: '10%', bonus: '5%', otherEarnings: '5%', membersCount: 12, band: '₹18,00,000 - ₹30,00,000 / Annum' },
  { id: 'STR-02', name: 'Senior Engineering (L5)', basic: '50%', hra: '20%', conveyance: '10%', specialAllowance: '10%', bonus: '5%', otherEarnings: '5%', membersCount: 45, band: '₹12,00,000 - ₹18,00,000 / Annum' },
  { id: 'STR-03', name: 'Mid-Level Professional (L4)', basic: '50%', hra: '20%', conveyance: '10%', specialAllowance: '10%', bonus: '5%', otherEarnings: '5%', membersCount: 120, band: '₹6,00,000 - ₹12,00,000 / Annum' },
  { id: 'STR-04', name: 'Associate Band (L2-L3)', basic: '50%', hra: '20%', conveyance: '10%', specialAllowance: '10%', bonus: '5%', otherEarnings: '5%', membersCount: 180, band: '₹3,50,000 - ₹6,00,000 / Annum' }
];

const initialPayslips = [
  { id: 'PAY-701', payslipCode: 'PAY-701', employeeName: 'Rahul Sharma', employeeId: 'EMP-0001', month: 'July 2026', designation: 'Senior Software Engineer', department: 'Engineering', joiningDate: '12/06/2023', workLocation: 'Bhubaneswar', panNumber: 'ABCDE1234F', bankName: 'HDFC Bank', accountNumber: '5010049281723', totalWorkingDays: 30, paidDays: 30, lopDays: 0, basic: 35000, hra: 14000, conveyance: 3000, specialAllowance: 5000, bonus: 2000, otherEarnings: 1000, gross: '₹60,000.00', grossRaw: 60000, netSalary: '₹60,000.00', netSalaryRaw: 60000, amountInWords: 'Indian Rupees Sixty Thousand Only', paymentMode: 'Bank Transfer', transactionRef: 'TXN-982710492', status: 'Paid' },
  { id: 'PAY-702', payslipCode: 'PAY-702', employeeName: 'Sarah Jenkins', employeeId: 'EMP-0002', month: 'July 2026', designation: 'HR Operations Manager', department: 'Human Resources', joiningDate: '01/03/2024', workLocation: 'Bhubaneswar', panNumber: 'FGHIJ5678K', bankName: 'ICICI Bank', accountNumber: '629101928374', totalWorkingDays: 30, paidDays: 30, lopDays: 0, basic: 40000, hra: 16000, conveyance: 3500, specialAllowance: 6000, bonus: 2500, otherEarnings: 1500, gross: '₹69,500.00', grossRaw: 69500, netSalary: '₹69,500.00', netSalaryRaw: 69500, amountInWords: 'Indian Rupees Sixty Nine Thousand Five Hundred Only', paymentMode: 'Bank Transfer', transactionRef: 'TXN-982710493', status: 'Paid' }
];

export const PayrollDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [wizardStep, setWizardStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Stats & Lists
  const [stats, setStats] = useState(payrollData);
  const [structuresList, setStructuresList] = useState(initialStructures);
  const [payslipsList, setPayslipsList] = useState(initialPayslips);
  const [dbEmployeesList, setDbEmployeesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddStructureOpen, setIsAddStructureOpen] = useState(false);
  const [isGenPayslipOpen, setIsGenPayslipOpen] = useState(false);

  // New Item States
  const [newStructure, setNewStructure] = useState({
    name: '',
    band: '₹6,00,000 - ₹12,00,000 / Annum',
    basic: '50%',
    hra: '20%',
    conveyance: '10%',
    specialAllowance: '10%',
    bonus: '5%',
    otherEarnings: '5%'
  });

  const [newPayslip, setNewPayslip] = useState({
    employeeId: '',
    month: 7,
    year: 2026,
    totalWorkingDays: 30,
    paidDays: 30,
    lopDays: 0,
    paymentMode: 'Bank Transfer',
    transactionRef: ''
  });

  // View Payslip Modal
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isViewPayslipOpen, setIsViewPayslipOpen] = useState(false);

  // Map route to active tab
  const getActiveTab = () => {
    if (location.pathname.includes('/structures')) return 'structures';
    if (location.pathname.includes('/payslips')) return 'payslips';
    return 'processing';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabId) => {
    if (tabId === 'structures') navigate('/hr/payroll/structures');
    else if (tabId === 'payslips') navigate('/hr/payroll/payslips');
    else navigate('/hr/payroll');
  };

  // Fetch Payroll API Data
  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const [statsRes, structRes, slipsRes, empRes] = await Promise.allSettled([
        payrollApi.getDashboardStats(),
        payrollApi.getSalaryStructures(),
        payrollApi.getAllPayslips(),
        employeeApi.getAllEmployees()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats((prev) => ({ ...prev, ...statsRes.value.data }));
      }
      if (structRes.status === 'fulfilled' && Array.isArray(structRes.value?.data) && structRes.value.data.length > 0) {
        setStructuresList(structRes.value.data);
      }
      if (slipsRes.status === 'fulfilled' && Array.isArray(slipsRes.value?.data) && slipsRes.value.data.length > 0) {
        setPayslipsList(slipsRes.value.data);
      }
      if (empRes.status === 'fulfilled' && Array.isArray(empRes.value?.data)) {
        setDbEmployeesList(empRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load payroll data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const payrollTabs = [
    { id: 'processing', label: 'Payroll Processing' },
    { id: 'structures', label: `Salary Structures (${structuresList.length})` },
    { id: 'payslips', label: `Payslips Archive (${payslipsList.length})` }
  ];

  const handleRunWizard = async () => {
    setIsProcessing(true);
    try {
      const res = await payrollApi.generateMonthlyPayroll({ month: 7, year: 2026 });
      setIsProcessing(false);
      setWizardStep(4);
      toast.success(res?.message || 'Payroll for July 2026 executed & Infotattva payslips generated!');
      fetchPayrollData();
    } catch (err) {
      console.error('Payroll engine error:', err);
      setIsProcessing(false);
      setWizardStep(4);
      toast.error(err.message || 'Error processing payroll');
    }
  };

  const handleCreateStructure = async (e) => {
    e.preventDefault();
    if (!newStructure.name || !newStructure.band) {
      toast.error('Please complete all structure details');
      return;
    }
    try {
      const res = await payrollApi.createSalaryStructure(newStructure);
      if (res?.success || res?.data) {
        toast.success(`Salary structure "${newStructure.name}" saved to database!`);
        fetchPayrollData();
      }
    } catch (err) {
      console.error('Error creating structure:', err);
      toast.error(err.message || 'Failed to create salary structure');
    } finally {
      setIsAddStructureOpen(false);
      setNewStructure({
        name: '',
        band: '₹6,00,000 - ₹12,00,000 / Annum',
        basic: '50%',
        hra: '20%',
        conveyance: '10%',
        specialAllowance: '10%',
        bonus: '5%',
        otherEarnings: '5%'
      });
    }
  };

  const handleGeneratePayslip = async (e) => {
    e.preventDefault();
    try {
      const targetEmp = dbEmployeesList.find((emp) => emp._id === newPayslip.employeeId);
      const res = await payrollApi.generateMonthlyPayroll({
        month: newPayslip.month || 7,
        year: newPayslip.year || 2026,
        employeeId: newPayslip.employeeId || undefined,
        totalWorkingDays: newPayslip.totalWorkingDays,
        paidDays: newPayslip.paidDays,
        lopDays: newPayslip.lopDays,
        paymentMode: newPayslip.paymentMode,
        transactionRef: newPayslip.transactionRef
      });
      if (res?.success || res?.data) {
        toast.success(`Infotattva Payslip generated for ${targetEmp ? `${targetEmp.firstName} ${targetEmp.lastName}` : 'Active Staff'}!`);
        fetchPayrollData();
      }
    } catch (err) {
      console.error('Error generating payslip:', err);
      toast.error(err.message || 'Failed to generate payslip');
    } finally {
      setIsGenPayslipOpen(false);
    }
  };

  const handleViewPayslip = async (pay) => {
    try {
      if (pay._id) {
        const res = await payrollApi.getPayslipById(pay._id);
        if (res?.data) {
          setSelectedPayslip(res.data);
          setIsViewPayslipOpen(true);
          return;
        }
      }
      setSelectedPayslip(pay);
      setIsViewPayslipOpen(true);
    } catch (err) {
      setSelectedPayslip(pay);
      setIsViewPayslipOpen(true);
    }
  };

  const handleStatusChange = async (payslipId, newStatus) => {
    try {
      await payrollApi.updatePaymentStatus(payslipId, { paymentStatus: newStatus });
      toast.success(`Payment status updated to ${newStatus}`);
      fetchPayrollData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const handleDownloadPdf = () => {
    const empName = selectedPayslip?.employeeName || selectedPayslip?.employeeId?.firstName || 'Employee';
    const month = selectedPayslip?.month || 'July_2026';
    downloadPayslipPdf('infotattva-salary-slip', `Infotattva_Payslip_${empName.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      {/* Page Header */}
      <PageHeader
        title="Payroll & Compensation Management"
        subtitle="Manage Infotattva salary structures, monthly payroll processing, tax calculation, and payslips archive."
        breadcrumbs={['Payroll', activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]}
        actions={
          activeTab === 'structures' ? (
            <Button onClick={() => setIsAddStructureOpen(true)} variant="primary" icon={Plus}>
              New Salary Structure
            </Button>
          ) : activeTab === 'payslips' ? (
            <Button onClick={() => setIsGenPayslipOpen(true)} variant="primary" icon={Plus}>
              Generate Payslip
            </Button>
          ) : null
        }
      />

      {/* Tabs Header */}
      <Tabs tabs={payrollTabs} activeTab={activeTab} onChange={handleTabChange} />

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#534675] animate-spin" />
          <span className="ml-3 text-sm font-medium text-slate-600">Loading Payroll System...</span>
        </div>
      )}

      {/* TAB 1: PAYROLL PROCESSING WIZARD */}
      {!loading && activeTab === 'processing' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Payroll Budget"
              value={stats.totalBudget || '₹4,85,000.00'}
              description="July 2026 Cycle"
              icon={DollarSign}
              iconBg="bg-[#f2f8e8] text-[#59781b]"
            />
            <StatCard
              title="Employees Processed"
              value={stats.processedCount || '387/389'}
              description="97% Completed"
              icon={CheckCircle}
              iconBg="bg-[#f0edf7] text-[#534675]"
            />
            <StatCard
              title="Pending Approvals"
              value={stats.pendingCount !== undefined ? String(stats.pendingCount) : '2'}
              description="Arrears & Adjustments"
              icon={Calculator}
              iconBg="bg-amber-50 text-amber-600 border border-amber-200"
            />
          </div>

          {/* Monthly Payroll Processing Wizard */}
          <Card className="space-y-6 bg-white border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-lg font-bold text-[#2c2738]">July 2026 Monthly Payroll Processing Wizard</h3>
              <p className="text-xs text-slate-500">Automated salary calculation engine (Infotattva Format)</p>
            </div>

            {/* Wizard Steps */}
            <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${wizardStep >= 1 ? 'bg-[#534675] text-white' : 'text-slate-500'}`}>
                1. Select Month
              </div>
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${wizardStep >= 2 ? 'bg-[#534675] text-white' : 'text-slate-500'}`}>
                2. Calculate Salaries
              </div>
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${wizardStep >= 3 ? 'bg-[#534675] text-white' : 'text-slate-500'}`}>
                3. Review Adjustments
              </div>
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${wizardStep >= 4 ? 'bg-[#9ec64c] text-white' : 'text-slate-500'}`}>
                4. Approve & Dispatch
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-[#2c2738]">Cycle Summary: {stats.cycleSummary || 'July 1 - July 31, 2026'}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Automated payroll calculation with instant Infotattva payslip generation.</p>
                </div>
                <Button
                  onClick={handleRunWizard}
                  isLoading={isProcessing}
                  variant="primary"
                  icon={Play}
                >
                  {wizardStep === 4 ? 'Re-Run Payroll Engine' : 'Execute Payroll Calculation'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: SALARY STRUCTURES */}
      {!loading && activeTab === 'structures' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {structuresList.map((str, idx) => (
            <Card key={str._id || str.id || idx} className="space-y-4 bg-white border border-slate-200 shadow-xs hover:border-[#534675]/40 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#f0edf7] text-[#534675] rounded-xl border border-[#dcd6e8]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#2c2738]">{str.name}</h4>
                    <p className="text-xs text-[#59781b] font-bold">Annual Band: {str.band}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#f0edf7] text-[#534675] font-bold rounded-lg border border-[#dcd6e8] text-[11px]">
                  {str.membersCount || 0} Assigned
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-3 border-t border-slate-100 text-xs text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Basic</p>
                  <p className="font-bold text-[#2c2738]">{str.basic}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">HRA</p>
                  <p className="font-bold text-[#2c2738]">{str.hra}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Conveyance</p>
                  <p className="font-bold text-[#534675]">{str.conveyance || '10%'}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Spl. Allowance</p>
                  <p className="font-bold text-[#534675]">{str.specialAllowance || '10%'}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Bonus</p>
                  <p className="font-bold text-[#534675]">{str.bonus || '5%'}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Other Earnings</p>
                  <p className="font-bold text-[#534675]">{str.otherEarnings || '5%'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: PAYSLIPS ARCHIVE */}
      {!loading && activeTab === 'payslips' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee name or payslip ID..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675] shadow-xs"
            />
          </div>

          <Card className="bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2c2738]">
                <thead className="bg-slate-50 uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">PAYSLIP CODE</th>
                    <th className="px-4 py-3">EMPLOYEE DETAILS</th>
                    <th className="px-4 py-3">PAY MONTH</th>
                    <th className="px-4 py-3">GROSS EARNINGS</th>
                    <th className="px-4 py-3">NET SALARY PAYABLE</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payslipsList
                    .filter((p) => (p.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.payslipCode || p.id || '').toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((pay, idx) => (
                      <tr key={pay._id || pay.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-slate-400">{pay.payslipCode || pay.id}</td>
                        <td className="px-4 py-3.5 font-bold text-[#2c2738]">
                          {pay.employeeName}
                          <span className="block text-[10px] text-slate-400 font-mono">{pay.employeeId}</span>
                        </td>
                        <td className="px-4 py-3.5 font-medium">{pay.month}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">{pay.gross}</td>
                        <td className="px-4 py-3.5 font-bold text-[#59781b]">{pay.netSalary || pay.gross}</td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleStatusChange(pay._id || pay.id, pay.status === 'Paid' ? 'Pending' : 'Paid')}
                            title="Click to toggle Paid/Pending status"
                            className="cursor-pointer"
                          >
                            <StatusBadge status={pay.status} />
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1">
                          <Button
                            onClick={() => handleViewPayslip(pay)}
                            variant="ghost"
                            size="sm"
                            icon={FileText}
                          >
                            View Slip
                          </Button>
                          <Button
                            onClick={() => {
                              handleViewPayslip(pay);
                              setTimeout(() => {
                                downloadPayslipPdf('infotattva-salary-slip', `Infotattva_Payslip_${(pay.employeeName || 'Employee').replace(/\s+/g, '_')}_${(pay.month || 'July_2026').replace(/\s+/g, '_')}.pdf`);
                              }, 300);
                            }}
                            variant="ghost"
                            size="sm"
                            icon={Download}
                          >
                            PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 1: NEW SALARY STRUCTURE */}
      <Modal
        isOpen={isAddStructureOpen}
        onClose={() => setIsAddStructureOpen(false)}
        title="Create Salary Pay Structure"
        subtitle="Establish pay component ratios and annual compensation bands (INR)."
        footer={
          <>
            <Button onClick={() => setIsAddStructureOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateStructure} variant="primary">Create Structure</Button>
          </>
        }
      >
        <form onSubmit={handleCreateStructure} className="space-y-4 text-xs">
          <Input
            label="Structure Title"
            value={newStructure.name}
            onChange={(e) => setNewStructure({ ...newStructure, name: e.target.value })}
            placeholder="e.g. Lead Specialist Band (L6)"
            required
          />
          <Input
            label="Annual Compensation Band (₹)"
            value={newStructure.band}
            onChange={(e) => setNewStructure({ ...newStructure, band: e.target.value })}
            placeholder="e.g. ₹12,00,000 - ₹16,00,000 / Annum"
            required
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Input
              label="Basic Pay (%)"
              value={newStructure.basic}
              onChange={(e) => setNewStructure({ ...newStructure, basic: e.target.value })}
              placeholder="50%"
              required
            />
            <Input
              label="HRA (%)"
              value={newStructure.hra}
              onChange={(e) => setNewStructure({ ...newStructure, hra: e.target.value })}
              placeholder="20%"
              required
            />
            <Input
              label="Conveyance (%)"
              value={newStructure.conveyance}
              onChange={(e) => setNewStructure({ ...newStructure, conveyance: e.target.value })}
              placeholder="10%"
              required
            />
            <Input
              label="Spl. Allowance (%)"
              value={newStructure.specialAllowance}
              onChange={(e) => setNewStructure({ ...newStructure, specialAllowance: e.target.value })}
              placeholder="10%"
              required
            />
            <Input
              label="Bonus / Incentive (%)"
              value={newStructure.bonus}
              onChange={(e) => setNewStructure({ ...newStructure, bonus: e.target.value })}
              placeholder="5%"
              required
            />
            <Input
              label="Other Earnings (%)"
              value={newStructure.otherEarnings}
              onChange={(e) => setNewStructure({ ...newStructure, otherEarnings: e.target.value })}
              placeholder="5%"
              required
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 2: GENERATE PAYSLIP */}
      <Modal
        isOpen={isGenPayslipOpen}
        onClose={() => setIsGenPayslipOpen(false)}
        title="Generate Employee Payslip"
        subtitle="Issue official Infotattva Business Solutions salary slip."
        footer={
          <>
            <Button onClick={() => setIsGenPayslipOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleGeneratePayslip} variant="primary">Generate Payslip</Button>
          </>
        }
      >
        <form onSubmit={handleGeneratePayslip} className="space-y-4 text-xs">
          <Select
            label="Select Employee"
            value={newPayslip.employeeId}
            onChange={(e) => setNewPayslip({ ...newPayslip, employeeId: e.target.value })}
            options={[
              { label: '-- Bulk Process All Active Staff --', value: '' },
              ...(dbEmployeesList.length > 0
                ? dbEmployeesList.map((emp) => ({ label: `${emp.firstName} ${emp.lastName} (${emp.employeeCode})`, value: emp._id }))
                : employeesList.map((emp) => ({ label: `${emp.name} (${emp.id})`, value: emp.id })))
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Pay Month"
              value={String(newPayslip.month)}
              onChange={(e) => setNewPayslip({ ...newPayslip, month: Number(e.target.value) })}
              options={[
                { label: 'July 2026', value: '7' },
                { label: 'June 2026', value: '6' },
                { label: 'May 2026', value: '5' }
              ]}
            />
            <Select
              label="Payment Mode"
              value={newPayslip.paymentMode}
              onChange={(e) => setNewPayslip({ ...newPayslip, paymentMode: e.target.value })}
              options={[
                { label: 'Bank Transfer', value: 'Bank Transfer' },
                { label: 'Cheque', value: 'Cheque' },
                { label: 'Cash', value: 'Cash' }
              ]}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Total Working Days"
              type="number"
              value={newPayslip.totalWorkingDays}
              onChange={(e) => setNewPayslip({ ...newPayslip, totalWorkingDays: e.target.value })}
            />
            <Input
              label="Paid Days"
              type="number"
              value={newPayslip.paidDays}
              onChange={(e) => setNewPayslip({ ...newPayslip, paidDays: e.target.value })}
            />
            <Input
              label="LOP Days"
              type="number"
              value={newPayslip.lopDays}
              onChange={(e) => setNewPayslip({ ...newPayslip, lopDays: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 3: VIEW INFOTATTVA SALARY SLIP TEMPLATE */}
      <Modal
        isOpen={isViewPayslipOpen}
        onClose={() => setIsViewPayslipOpen(false)}
        title="Official Infotattva Salary Slip Voucher"
        subtitle="Verified earnings statement."
        footer={
          <>
            <Button onClick={() => setIsViewPayslipOpen(false)} variant="outline">Close</Button>
            <Button onClick={handleDownloadPdf} variant="primary" icon={Download}>Download PDF</Button>
          </>
        }
      >
        {selectedPayslip && (
          <InfotattvaPayslipTemplate payslip={selectedPayslip} />
        )}
      </Modal>
    </div>
  );
};
