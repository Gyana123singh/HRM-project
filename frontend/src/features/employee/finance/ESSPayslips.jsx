import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { payrollData } from '../../../data/mockData';
import { payrollApi } from '../../../api/payrollApi';
import { Download, Eye, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ESSPayslips = () => {
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [payslips, setPayslips] = useState(payrollData.recentPayslips);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPayslips = async () => {
      setLoading(true);
      try {
        const res = await payrollApi.getMyPayslips();
        const list = res?.data || res;
        if (Array.isArray(list) && list.length > 0) {
          setPayslips(list);
        }
      } catch (err) {
        console.error('Failed to load my payslips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPayslips();
  }, []);

  const handleDownload = (month, payslipObj) => {
    const ps = payslipObj || payslips.find(p => p.month === month) || payslips[0];
    const payslipText = `
==================================================
        OFFICIAL SALARY DISBURSEMENT PAYSLIP
                  ${ps.month || month || 'July 2026'}
==================================================
Employee: Rahul Sharma (Senior Frontend Developer)
Department: Engineering
Disbursement Date: 28 July 2026
Payment Status: ${ps.status || ps.paymentStatus || 'Paid'}
--------------------------------------------------
EARNINGS:
Basic Salary:            ${ps.basic || '$5,416.66'}
HRA & Allowances:        ${ps.hra || '$3,750.00'}
Gross Compensation:      ${ps.grossSalary || '$9,166.66'}

DEDUCTIONS:
PF & Income Tax:        -${ps.deductions || ps.totalDeductions || '$625.00'}
--------------------------------------------------
NET SALARY PAYABLE:      ${ps.netSalary || '$8,541.66'}
==================================================
    `;
    const blob = new Blob([payslipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payslip_${(ps.month || month || 'July_2026').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Payslip statement downloaded!`);
  };

  const latestSlip = payslips[0] || {};

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
            <span className="text-slate-800 font-bold text-sm">{latestSlip.basic || '$5,416.66'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-normal block">HRA & Allowances</span>
            <span className="text-slate-800 font-bold text-sm">{latestSlip.hra || '$3,750.00'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-normal block">Monthly Deductions</span>
            <span className="text-rose-600 font-bold text-sm">-{latestSlip.deductions || '$625.00'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-normal block">Net Pay Disbursed</span>
            <span className="text-emerald-600 font-black text-base">{latestSlip.netSalary || '$8,541.66'}</span>
          </div>
        </div>
      </Card>

      {/* Monthly Payslips Table */}
      <Card className="space-y-4 bg-white">
        <h3 className="text-base font-bold text-slate-800">Monthly Payslip History</h3>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#534675] animate-spin" />
            <span className="ml-2 text-xs font-medium text-slate-500">Loading your payslips...</span>
          </div>
        )}

        {!loading && (
          <div className="space-y-3">
            {payslips.map((ps, idx) => (
              <div key={ps._id || ps.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  <StatusBadge status={ps.status || ps.paymentStatus || 'Paid'} />
                  <Button onClick={() => setSelectedPayslip(ps)} variant="outline" size="sm" icon={Eye}>
                    View Payslip
                  </Button>
                  <Button onClick={() => handleDownload(ps.month, ps)} variant="primary" size="sm" icon={Download}>
                    Download PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* View Payslip Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={Boolean(selectedPayslip)}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip Statement - ${selectedPayslip.month}`}
          subtitle="Epic Corporation Inc. • Salary Disbursement Voucher"
          footer={
            <Button onClick={() => handleDownload(selectedPayslip.month, selectedPayslip)} variant="primary" icon={Download}>
              Download Official PDF
            </Button>
          }
        >
          <div className="space-y-4 text-xs text-slate-700 font-medium">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>Basic Salary:</span>
                <strong>{selectedPayslip.basic || '$5,416.66'}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span>HRA & House Allowance:</span>
                <strong>{selectedPayslip.hra || '$3,750.00'}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2 text-rose-600">
                <span>Tax & Insurance Deductions:</span>
                <strong>-{selectedPayslip.deductions || '$625.00'}</strong>
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
