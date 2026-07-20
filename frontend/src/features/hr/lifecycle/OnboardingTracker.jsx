import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { onboardingTasks } from '../../../data/mockData';
import { CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export const OnboardingTracker = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Onboarding & Orientation Tracker"
        subtitle="Monitor new hire task completion, document checks, and mentor assignment."
        breadcrumbs={['Employee Lifecycle', 'Onboarding']}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {onboardingTasks.map((item) => (
          <Card key={item.id} className="space-y-4 bg-white border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-[#2c2738]">{item.employee}</h4>
                <p className="text-xs text-slate-500">Assigned Mentor: {item.mentor}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Progress ({item.completed} / {item.total} Tasks)</span>
                <span className="font-bold text-[#534675]">{item.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-[#534675] to-[#9ec64c] rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
