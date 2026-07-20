import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { useHRStore } from '../../../store/hrStore';
import { Check, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export const LeaveApprovals = () => {
  const { leaves, approveLeave, rejectLeave } = useHRStore();

  const handleApprove = (id, name) => {
    approveLeave(id);
    toast.success(`Approved leave application for ${name}`);
  };

  const handleReject = (id, name) => {
    rejectLeave(id);
    toast.error(`Rejected leave application for ${name}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Leave Requests Approval Matrix"
        subtitle="Review, approve, or reject pending workforce leave applications."
        breadcrumbs={['Time & Attendance', 'Leave Approvals']}
      />

      <div className="space-y-4">
        {leaves.map((req) => (
          <Card key={req.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 shadow-sm">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3">
                <h4 className="text-base font-bold text-[#2c2738]">{req.employeeName}</h4>
                <StatusBadge status={req.status} />
              </div>
              <p className="text-xs text-[#534675] font-bold">{req.leaveType} • {req.totalDays} Days ({req.startDate} to {req.endDate})</p>
              <p className="text-xs text-[#2c2738] bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-2">
                <span className="text-slate-500 font-medium">Reason:</span> "{req.reason}"
              </p>
              <p className="text-[11px] text-slate-500">Applied on: {req.appliedDate}</p>
            </div>

            {req.status === 'Pending' && (
              <div className="flex items-center gap-2 shrink-0">
                <Button onClick={() => handleApprove(req.id, req.employeeName)} variant="accent" icon={Check}>
                  Approve Leave
                </Button>
                <Button onClick={() => handleReject(req.id, req.employeeName)} variant="danger" icon={X}>
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
