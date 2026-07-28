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
import {
  DollarSign, CheckCircle, Calculator, FileText, Download, Play, Plus,
  Search, ShieldCheck, Briefcase, CreditCard, ArrowUpRight, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const initialStructures = [
  { id: 'STR-01', name: 'Executive Level (L7)', basic: '60%', hra: '25%', allowances: '15%', deductions: '10%', membersCount: 12, band: '$150k - $250k' },
  { id: 'STR-02', name: 'Senior Engineering (L5)', basic: '55%', hra: '20%', allowances: '25%', deductions: '12%', membersCount: 45, band: '$110k - $150k' },
  { id: 'STR-03', name: 'Mid-Level Professional (L4)', basic: '50%', hra: '20%', allowances: '30%', deductions: '10%', membersCount: 120, band: '$85k - $110k' },
  { id: 'STR-04', name: 'Associate Band (L2-L3)', basic: '50%', hra: '15%', allowances: '35%', deductions: '8%', membersCount: 180, band: '$50k - $85k' }
];

const initialPayslips = [
  { id: 'PAY-701', employeeName: 'Rahul Sharma', employeeId: 'EMP-1024', month: 'July 2026', gross: '$10,250.00', deductions: '$1,250.00', netSalary: '$9,000.00', status: 'Paid' },
  { id: 'PAY-702', employeeName: 'Sarah Jenkins', employeeId: 'EMP-1001', month: 'July 2026', gross: '$14,500.00', deductions: '$1,800.00', netSalary: '$12,700.00', status: 'Paid' },
  { id: 'PAY-703', employeeName: 'Alex Vance', employeeId: 'EMP-1002', month: 'July 2026', gross: '$16,200.00', deductions: '$2,100.00', netSalary: '$14,100.00', status: 'Paid' },
  { id: 'PAY-704', employeeName: 'Jessica Lin', employeeId: 'EMP-1003', month: 'July 2026', gross: '$12,000.00', deductions: '$1,500.00', netSalary: '$10,500.00', status: 'Pending' },
  { id: 'PAY-705', employeeName: 'Michael Chang', employeeId: 'EMP-1005', month: 'July 2026', gross: '$11,000.00', deductions: '$1,300.00', netSalary: '$9,700.00', status: 'Paid' }
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
  const [newStructure, setNewStructure] = useState({ name: '', band: '$80k - $120k', basic: '50%', hra: '20%' });
  const [newPayslip, setNewPayslip] = useState({ employeeId: '', month: 7, year: 2026 });

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
      if (structRes.status === 'fulfilled' && Array.isArray(structRes.value?.data)) {
        setStructuresList(structRes.value.data);
      }
      if (slipsRes.status === 'fulfilled' && Array.isArray(slipsRes.value?.data)) {
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
      toast.success(res?.message || 'Payroll for July 2026 executed & payslips generated!');
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
      setNewStructure({ name: '', band: '$80k - $120k', basic: '50%', hra: '20%', allowances: '25%', deductions: '10%' });
    }
  };

  const handleGeneratePayslip = async (e) => {
    e.preventDefault();
    try {
      const targetEmp = dbEmployeesList.find((emp) => emp._id === newPayslip.employeeId);
      const res = await payrollApi.generateMonthlyPayroll({
        month: newPayslip.month || 7,
        year: newPayslip.year || 2026,
        employeeId: newPayslip.employeeId || undefined
      });
      if (res?.success || res?.data) {
        toast.success(`Payslip generated for ${targetEmp ? `${targetEmp.firstName} ${targetEmp.lastName}` : 'Active Staff'}!`);
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

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      {/* Page Header */}
      <PageHeader
        title="Payroll & Compensation Management"
        subtitle="Manage salary structures, monthly payroll processing, tax calculation, and payslips."
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
              value={stats.totalBudget || '$485,000.00'}
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
              <p className="text-xs text-slate-500">Automated salary calculation & tax withholding calculation engine</p>
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
                  <p className="text-xs text-slate-500 mt-0.5">Automated payroll calculation with instant payslip dispatch & tax calculation.</p>
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

              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs text-center">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Basic Pay</p>
                  <p className="font-bold text-[#2c2738]">{str.basic}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">HRA</p>
                  <p className="font-bold text-[#2c2738]">{str.hra}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Allowances</p>
                  <p className="font-bold text-[#534675]">{str.allowances}</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Deductions</p>
                  <p className="font-bold text-rose-600">{str.deductions}</p>
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
              placeholder="Search employee or payslip ID..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675] shadow-xs"
            />
          </div>

          <Card className="bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2c2738]">
                <thead className="bg-slate-50 uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">PAYSLIP ID</th>
                    <th className="px-4 py-3">EMPLOYEE NAME</th>
                    <th className="px-4 py-3">PAY MONTH</th>
                    <th className="px-4 py-3">GROSS SALARY</th>
                    <th className="px-4 py-3">DEDUCTIONS</th>
                    <th className="px-4 py-3">NET PAY</th>
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
                        <td className="px-4 py-3.5 font-semibold text-rose-600">{pay.deductions}</td>
                        <td className="px-4 py-3.5 font-bold text-[#59781b]">{pay.netSalary}</td>
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
                            View
                          </Button>
                          <Button
                            onClick={() => toast.success(`Downloaded payslip PDF for ${pay.employeeName}`)}
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
        subtitle="Establish pay component ratios and annual compensation bands."
        footer={
          <>
            <Button onClick={() => setIsAddStructureOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateStructure} variant="primary">Create Structure</Button>
          </>
        }
      >
        <form onSubmit={handleCreateStructure} className="space-y-4">
          <Input
            label="Structure Title"
            value={newStructure.name}
            onChange={(e) => setNewStructure({ ...newStructure, name: e.target.value })}
            placeholder="e.g. Lead Technical Specialist Band (L6)"
            required
          />
          <Input
            label="Annual Compensation Band ($)"
            value={newStructure.band}
            onChange={(e) => setNewStructure({ ...newStructure, band: e.target.value })}
            placeholder="e.g. $120k - $160k"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Basic Pay Allocation (%)"
              value={newStructure.basic}
              onChange={(e) => setNewStructure({ ...newStructure, basic: e.target.value })}
              placeholder="50%"
              required
            />
            <Input
              label="HRA Component (%)"
              value={newStructure.hra}
              onChange={(e) => setNewStructure({ ...newStructure, hra: e.target.value })}
              placeholder="20%"
              required
            />
            <Input
              label="Special Allowances (%)"
              value={newStructure.allowances}
              onChange={(e) => setNewStructure({ ...newStructure, allowances: e.target.value })}
              placeholder="25%"
              required
            />
            <Input
              label="Tax & Deductions (%)"
              value={newStructure.deductions}
              onChange={(e) => setNewStructure({ ...newStructure, deductions: e.target.value })}
              placeholder="10%"
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
        subtitle="Issue official salary payment voucher for the monthly cycle."
        footer={
          <>
            <Button onClick={() => setIsGenPayslipOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleGeneratePayslip} variant="primary">Generate Payslip</Button>
          </>
        }
      >
        <form onSubmit={handleGeneratePayslip} className="space-y-4">
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
        </form>
      </Modal>

      {/* MODAL 3: VIEW PAYSLIP VOUCHER */}
      <Modal
        isOpen={isViewPayslipOpen}
        onClose={() => setIsViewPayslipOpen(false)}
        title="Official Payslip Voucher"
        subtitle="Verified earnings statement and tax breakdown."
        footer={
          <>
            <Button onClick={() => window.print()} variant="outline" icon={Download}>Print / Download</Button>
            <Button onClick={() => setIsViewPayslipOpen(false)} variant="primary">Close</Button>
          </>
        }
      >
        {selectedPayslip && (
          <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-sm font-bold text-[#2c2738]">
                  {selectedPayslip.employeeId?.firstName
                    ? `${selectedPayslip.employeeId.firstName} ${selectedPayslip.employeeId.lastName}`
                    : selectedPayslip.employeeName || 'Employee'}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  {selectedPayslip.employeeId?.employeeCode || selectedPayslip.employeeId || 'EMP-1001'}
                </p>
              </div>
              <StatusBadge status={selectedPayslip.paymentStatus || selectedPayslip.status || 'Paid'} />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Pay Period</span>
                <p className="font-bold text-[#2c2738]">{selectedPayslip.month || 'July 2026'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Base Salary</span>
                <p className="font-bold text-[#2c2738]">{selectedPayslip.baseSalary ? `$${selectedPayslip.baseSalary.toLocaleString()}` : selectedPayslip.gross}</p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">House Rent Allowance (HRA)</span>
                <span>{selectedPayslip.allowances?.hra ? `$${selectedPayslip.allowances.hra.toLocaleString()}` : '$1,500.00'}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Medical & Transport Allowance</span>
                <span>$3,500.00</span>
              </div>
              <div className="flex justify-between font-medium text-rose-600 pt-1 border-t border-slate-100">
                <span>Tax Withholding & Deductions</span>
                <span>-{selectedPayslip.deductions?.tax ? `$${(selectedPayslip.deductions.tax + (selectedPayslip.deductions.providentFund || 0)).toLocaleString()}` : selectedPayslip.deductions}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#59781b] pt-2 border-t border-slate-200">
                <span>Net Disbursed Salary</span>
                <span>{selectedPayslip.netSalary ? (typeof selectedPayslip.netSalary === 'number' ? `$${selectedPayslip.netSalary.toLocaleString()}` : selectedPayslip.netSalary) : '$9,000.00'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
