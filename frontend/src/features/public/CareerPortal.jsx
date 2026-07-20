import React, { useState } from 'react';
import { jobsList } from '../../data/mockData';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Search, Upload, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const CareerPortal = () => {
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');

  const filteredJobs = jobsList.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase()));

  const handleApplySubmit = (e) => {
    e.preventDefault();
    toast.success(`Application submitted for ${selectedJob?.title}! HR will reach out.`);
    setIsApplyOpen(false);
    setApplicantName('');
    setApplicantEmail('');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-800 font-sans p-4 sm:p-8 space-y-8">
      {/* Brand Header */}
      <header className="max-w-5xl mx-auto flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xs">
            NX
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Nexus Global Careers</h1>
            <p className="text-xs text-slate-500 font-medium">Join our world-class technology workforce</p>
          </div>
        </div>
        <a href="/login" className="text-xs text-blue-600 hover:underline font-bold">Employee Login ↗</a>
      </header>

      {/* Hero Search */}
      <div className="max-w-3xl mx-auto text-center space-y-4 py-8">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">Build the Future With Us</h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto font-medium">Explore open engineering, product, sales, and operations positions across our global offices.</p>
        <Input
          icon={Search}
          placeholder="Search jobs by title or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-lg mx-auto bg-white"
        />
      </div>

      {/* Jobs Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 hover:border-blue-500 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-800">{job.title}</h3>
                <p className="text-xs text-blue-600 font-bold">{job.department} • {job.location}</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                {job.type}
              </span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">{job.description}</p>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
              <span>Posted: {job.postedDate}</span>
              <Button
                onClick={() => { setSelectedJob(job); setIsApplyOpen(true); }}
                variant="primary"
                size="sm"
                icon={ArrowRight}
              >
                Apply Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <Modal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          title={`Apply for ${selectedJob.title}`}
          subtitle={`${selectedJob.department} • ${selectedJob.location}`}
          footer={
            <>
              <Button onClick={() => setIsApplyOpen(false)} variant="outline">Cancel</Button>
              <Button onClick={handleApplySubmit} variant="accent">Submit Application</Button>
            </>
          }
        >
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <Input label="Full Name" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} required />
            <Input label="Email Address" type="email" value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} required />
            <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center space-y-2">
              <Upload className="w-6 h-6 text-blue-600 mx-auto" />
              <p className="text-xs text-slate-700 font-bold">Upload Resume / CV (PDF or DOCX)</p>
              <Button variant="outline" size="sm">Choose File</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
