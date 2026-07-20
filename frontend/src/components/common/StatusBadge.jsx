import React from 'react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const getBadgeStyle = (val) => {
    const s = String(val).toLowerCase();

    if (['active', 'present', 'approved', 'paid', 'hired', 'completed', 'open'].includes(s)) {
      return 'bg-[#f2f8e8] text-[#4a6414] border-[#9ec64c]/40Dot bg-[#8eb63d]';
    }
    if (['pending', 'in progress', 'probation', 'review', 'shortlisted', 'screening', 'applied', 'notice period'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border-amber-200Dot bg-amber-500';
    }
    if (['rejected', 'absent', 'suspended', 'terminated', 'failed', 'urgent', 'high'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border-rose-200Dot bg-rose-500';
    }
    if (['on leave', 'half day', 'late', 'resigned', 'draft'].includes(s)) {
      return 'bg-[#f0edf7] text-[#534675] border-[#dcd6e8]Dot bg-[#534675]';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200Dot bg-slate-400';
  };

  const styleStr = getBadgeStyle(status);
  const colorPart = styleStr.split('Dot ')[0];
  const dotColor = styleStr.split('Dot ')[1] || 'bg-slate-400';

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };

  return (
    <span className={`inline-flex items-center font-bold rounded-full border ${colorPart} ${sizes[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      <span className="capitalize">{status}</span>
    </span>
  );
};
