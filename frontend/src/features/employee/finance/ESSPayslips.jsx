import React, { useState } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { payrollData } from '../../../data/mockData';
import { Download, Eye, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const ESSPayslips = () => {
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const handleDownload = (month) => {
    toast.success(`Downloading ${month} Payslip PDF...`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <PageHeader
        title="My Payslips & Salary Information"
        subtitle="Access monthly salary breakdowns, tax withholdings, and download PDF payslips."
        breadcrumbs={['My Finance', 'Payslips']}
      />

      {/* Salary Overview Card */}
      <Card className="bg-white border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Annual Compensation Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
          <div>
            <span className="text-slate-400 font-normal block">Basic Salary (Monthly)</span>
            <span className="text-slate-800 font-bold text-sm">$5,416.66</span>
          </div>
          <div>
            <span className="text-slate-400 font-normal block">HRA & Allowances</span>
            <span className="text-slate-800 font-bold text-sm">$3,750.00</span>
          </div>
          <div>
            <span className="text-slate-400 font-normal block">Monthly Deductions</span>
            <span className="text-rose-600 font-bold text-sm">-$625.00</span>
          </div>
          <div>
            <span className="text-slate-400 font-normal block">Net Pay Disbursed</span>
            <span className="text-emerald-600 font-black text-base">$8,541.66</span>
          </div>
        </div>
      </Card>

      {/* Monthly Payslips Table */}
      <Card className="space-y-4 bg-white">
        <h3 className="text-base font-bold text-slate-800">Monthly Payslip History</h3>
        <div className="space-y-3">
          {payrollData.recentPayslips.map((ps) => (
            <div key={ps.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{ps.month}</h4>
                  <p className="text-xs text-slate-500 font-medium">Net Pay: <strong className="text-emerald-600">{ps.netSalary}</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={ps.status} />
                <Button onClick={() => setSelectedPayslip(ps)} variant="outline" size="sm" icon={Eye}>
                  View Payslip
                </Button>
                <Button onClick={() => handleDownload(ps.month)} variant="primary" size="sm" icon={Download}>
                  Download PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* View Payslip Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={Boolean(selectedPayslip)}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip Statement - ${selectedPayslip.month}`}
          subtitle="Nexus Global Technologies • Employee ID: EMP-1024"
          footer={
            <Button onClick={() => handleDownload(selectedPayslip.month)} variant="primary" icon={Download}>
              Download Official PDF
            </Button>
          }
        >
          <div className="space-y-4 text-xs text-slate-700 font-medium">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Basic Salary:</span>
                <strong>{selectedPayslip.basic}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>HRA & House Allowance:</span>
                <strong>{selectedPayslip.hra}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-rose-600">
                <span>Tax & Insurance Deductions:</span>
                <strong>-{selectedPayslip.deductions}</strong>
              </div>
              <div className="flex justify-between pt-2 text-sm text-emerald-600 font-black">
                <span>Net Salary Payable:</span>
                <span>{selectedPayslip.netSalary}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
