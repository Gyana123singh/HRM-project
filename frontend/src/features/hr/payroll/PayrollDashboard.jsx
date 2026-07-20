import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { payrollData, employeesList } from '../../../data/mockData';
import {
  DollarSign, CheckCircle, Calculator, FileText, Download, Play, Plus,
  Search, ShieldCheck, Briefcase, CreditCard, ArrowUpRight
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
  const [structuresList, setStructuresList] = useState(initialStructures);
  const [payslipsList, setPayslipsList] = useState(initialPayslips);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddStructureOpen, setIsAddStructureOpen] = useState(false);
  const [isGenPayslipOpen, setIsGenPayslipOpen] = useState(false);

  // New Item States
  const [newStructure, setNewStructure] = useState({ name: '', band: '$80k - $120k', basic: '50%', hra: '20%' });
  const [newPayslip, setNewPayslip] = useState({ employeeName: 'Rahul Sharma', month: 'July 2026', netSalary: '$9,000.00' });

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

  const payrollTabs = [
    { id: 'processing', label: 'Payroll Processing' },
    { id: 'structures', label: `Salary Structures (${structuresList.length})` },
    { id: 'payslips', label: `Payslips Archive (${payslipsList.length})` }
  ];

  const handleRunWizard = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setWizardStep(4);
      toast.success('Payroll for July 2026 approved & payslips generated!');
    }, 1200);
  };

  const handleCreateStructure = (e) => {
    e.preventDefault();
    const created = {
      id: `STR-0${structuresList.length + 1}`,
      name: newStructure.name,
      band: newStructure.band,
      basic: newStructure.basic,
      hra: newStructure.hra,
      allowances: '25%',
      deductions: '10%',
      membersCount: 0
    };
    setStructuresList([...structuresList, created]);
    toast.success(`Salary structure ${newStructure.name} created!`);
    setIsAddStructureOpen(false);
    setNewStructure({ name: '', band: '$80k - $120k', basic: '50%', hra: '20%' });
  };

  const handleGeneratePayslip = (e) => {
    e.preventDefault();
    const selectedEmp = employeesList.find(e => e.name === newPayslip.employeeName) || employeesList[0];
    const created = {
      id: `PAY-${800 + payslipsList.length}`,
      employeeName: selectedEmp.name,
      employeeId: selectedEmp.id,
      month: newPayslip.month,
      gross: selectedEmp.salary,
      deductions: '$1,200.00',
      netSalary: newPayslip.netSalary,
      status: 'Paid'
    };
    setPayslipsList([created, ...payslipsList]);
    toast.success(`Payslip generated for ${selectedEmp.name}!`);
    setIsGenPayslipOpen(false);
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

      {/* TAB 1: PAYROLL PROCESSING WIZARD */}
      {activeTab === 'processing' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Payroll Budget"
              value={payrollData.totalBudget}
              description="July 2026 Cycle"
              icon={DollarSign}
              iconBg="bg-[#f2f8e8] text-[#59781b]"
            />
            <StatCard
              title="Employees Processed"
              value={payrollData.processedCount}
              description="97% Completed"
              icon={CheckCircle}
              iconBg="bg-[#f0edf7] text-[#534675]"
            />
            <StatCard
              title="Pending Approvals"
              value={payrollData.pendingCount}
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
                  <h4 className="text-base font-bold text-[#2c2738]">Cycle Summary: July 1 - July 31, 2026</h4>
                  <p className="text-xs text-slate-500 mt-0.5">389 Employees • Gross: $485,000 • Deductions: $42,500 • Net Disbursed: $442,500</p>
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
      {activeTab === 'structures' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {structuresList.map((str) => (
            <Card key={str.id} className="space-y-4 bg-white border border-slate-200 shadow-xs hover:border-[#534675]/40 transition-all">
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
                  {str.membersCount} Assigned
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
      {activeTab === 'payslips' && (
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
                    <th className="px-4 py-3">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payslipsList
                    .filter(p => p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-slate-400">{pay.id}</td>
                        <td className="px-4 py-3.5 font-bold text-[#2c2738]">
                          {pay.employeeName}
                          <span className="block text-[10px] text-slate-400 font-mono">{pay.employeeId}</span>
                        </td>
                        <td className="px-4 py-3.5 font-medium">{pay.month}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">{pay.gross}</td>
                        <td className="px-4 py-3.5 font-semibold text-rose-600">{pay.deductions}</td>
                        <td className="px-4 py-3.5 font-bold text-[#59781b]">{pay.netSalary}</td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={pay.status} />
                        </td>
                        <td className="px-4 py-3.5">
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
            placeholder="e.g. Lead Technical Specialist Band"
            required
          />
          <Input
            label="Annual Compensation Band"
            value={newStructure.band}
            onChange={(e) => setNewStructure({ ...newStructure, band: e.target.value })}
            placeholder="e.g. $100k - $140k"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Basic Pay Allocation (%)"
              value={newStructure.basic}
              onChange={(e) => setNewStructure({ ...newStructure, basic: e.target.value })}
              required
            />
            <Input
              label="HRA Component (%)"
              value={newStructure.hra}
              onChange={(e) => setNewStructure({ ...newStructure, hra: e.target.value })}
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
            value={newPayslip.employeeName}
            onChange={(e) => setNewPayslip({ ...newPayslip, employeeName: e.target.value })}
            options={employeesList.map(emp => ({ label: `${emp.name} (${emp.id})`, value: emp.name }))}
          />
          <Select
            label="Pay Month"
            value={newPayslip.month}
            onChange={(e) => setNewPayslip({ ...newPayslip, month: e.target.value })}
            options={[
              { label: 'July 2026', value: 'July 2026' },
              { label: 'June 2026', value: 'June 2026' },
              { label: 'May 2026', value: 'May 2026' }
            ]}
          />
          <Input
            label="Calculated Net Disbursement ($)"
            value={newPayslip.netSalary}
            onChange={(e) => setNewPayslip({ ...newPayslip, netSalary: e.target.value })}
            required
          />
        </form>
      </Modal>
    </div>
  );
};
