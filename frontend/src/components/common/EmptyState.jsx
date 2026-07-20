import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '../ui/Button';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No records found",
  description = "There are currently no items matching your criteria.",
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 glass-card bg-white rounded-2xl border border-dashed border-slate-200 text-center">
      <div className="p-4 rounded-2xl bg-[#f0edf7] text-[#534675] mb-4 border border-[#dcd6e8]">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-[#2c2738] mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};
