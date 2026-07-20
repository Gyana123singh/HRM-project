import React from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Sparkles, CheckCircle2, AlertTriangle, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResumeScreening = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <PageHeader
        title="AI Resume Screening & Match Analysis"
        subtitle="Automated resume parser comparing candidate CV against role requirements."
        breadcrumbs={['AI Suite', 'Resume Screening']}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Column */}
        <Card className="space-y-4 text-center bg-white">
          <h3 className="text-base font-bold text-slate-800">Upload Applicant CV</h3>
          <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 space-y-3">
            <Upload className="w-8 h-8 text-blue-600 mx-auto" />
            <p className="text-xs text-slate-700 font-medium">David_Wright_Resume.pdf</p>
            <Button onClick={() => toast.success('Re-parsing resume...')} variant="outline" size="sm">
              Change File
            </Button>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Target Role: Senior React Developer</p>
        </Card>

        {/* AI Match Ring & Breakdown */}
        <Card className="md:col-span-2 space-y-6 bg-white border-slate-200">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Score Ring */}
            <div className="relative w-32 h-32 rounded-full border-4 border-blue-600 flex flex-col items-center justify-center bg-blue-50 shadow-sm shrink-0">
              <span className="text-3xl font-black text-blue-600">87%</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Match Score</span>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Strong Fit Candidate
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Candidate possesses 6+ years React experience, Zustand state management, and modern Vite build pipelines. Excellent match for Senior React Developer position.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
            <div className="space-y-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <h4 className="font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Strengths
              </h4>
              <ul className="space-y-1 text-slate-700 font-medium list-disc list-inside">
                <li>React 19 & Vite architecture</li>
                <li>Redux Toolkit & Zustand</li>
                <li>Tailwind CSS design systems</li>
              </ul>
            </div>

            <div className="space-y-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Skill Gaps / Clarifications
              </h4>
              <ul className="space-y-1 text-slate-700 font-medium list-disc list-inside">
                <li>Graphql experience limited to 1 yr</li>
                <li>Verify notice period during interview</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
