import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useHRStore } from '../../../store/hrStore';
import { jobsList as initialJobs } from '../../../data/mockData';
import {
  UserPlus, Star, Mail, Phone, Calendar, ArrowRight, CheckCircle, FileText,
  Briefcase, Plus, Search, MapPin, Users, Award, TrendingUp, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CandidatesKanban = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { candidates, updateCandidateStage, addCandidate } = useHRStore();
  const [jobs, setJobs] = useState(initialJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeStageTab, setActiveStageTab] = useState('Applied'); // For mobile

  // Modals
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);

  // New Item States
  const [newJob, setNewJob] = useState({ title: '', department: 'Engineering', location: 'New York (Hybrid)', type: 'Full-Time', description: '' });
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '', position: 'Senior React Developer', experience: '5 Years' });

  const stages = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Offer', 'Hired'];

  // Map route to active tab
  const getActiveTab = () => {
    if (location.pathname.includes('/jobs')) return 'jobs';
    if (location.pathname.includes('/candidates')) return 'candidates';
    return 'overview';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabId) => {
    if (tabId === 'jobs') navigate('/hr/recruitment/jobs');
    else if (tabId === 'candidates') navigate('/hr/recruitment/candidates');
    else navigate('/hr/recruitment');
  };

  const recruitmentTabs = [
    { id: 'overview', label: 'ATS Overview' },
    { id: 'jobs', label: `Job Openings (${jobs.length})` },
    { id: 'candidates', label: `Candidates Pipeline (${candidates.length})` }
  ];

  const handleMoveStage = (candidateId, currentStage, direction) => {
    const idx = stages.indexOf(currentStage);
    const newIdx = direction === 'next' ? idx + 1 : idx - 1;
    if (newIdx >= 0 && newIdx < stages.length) {
      updateCandidateStage(candidateId, stages[newIdx]);
      toast.success(`Candidate moved to ${stages[newIdx]}`);
    }
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    const created = {
      id: `JOB-20${jobs.length + 1}`,
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      type: newJob.type,
      applicants: 0,
      status: 'Open',
      postedDate: new Date().toISOString().split('T')[0],
      description: newJob.description
    };
    setJobs([created, ...jobs]);
    toast.success(`Job requisition "${newJob.title}" posted!`);
    setIsAddJobOpen(false);
    setNewJob({ title: '', department: 'Engineering', location: 'New York (Hybrid)', type: 'Full-Time', description: '' });
  };

  const handleCreateCandidate = (e) => {
    e.preventDefault();
    addCandidate({
      name: newCandidate.name,
      email: newCandidate.email,
      position: newCandidate.position,
      experience: newCandidate.experience,
      stage: 'Applied',
      matchScore: 92,
      rating: 4.8
    });
    toast.success(`Candidate ${newCandidate.name} added to ATS pipeline!`);
    setIsAddCandidateOpen(false);
    setNewCandidate({ name: '', email: '', position: 'Senior React Developer', experience: '5 Years' });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl">
      {/* Page Header */}
      <PageHeader
        title="Recruitment & Applicant Tracking System (ATS)"
        subtitle="Manage job openings, candidate pipelines, resume screening, and hiring funnels."
        breadcrumbs={['Recruitment', activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]}
        actions={
          activeTab === 'jobs' ? (
            <Button onClick={() => setIsAddJobOpen(true)} variant="primary" icon={Plus}>
              Post Job Opening
            </Button>
          ) : (
            <Button onClick={() => setIsAddCandidateOpen(true)} variant="primary" icon={UserPlus}>
              Add Candidate
            </Button>
          )
        }
      />

      {/* Tabs */}
      <Tabs tabs={recruitmentTabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* TAB 1: ATS OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Job Requisitions"
              value={jobs.filter(j => j.status === 'Open').length}
              change="+2 this week"
              changeType="positive"
              icon={Briefcase}
              iconBg="bg-[#f0edf7] text-[#534675]"
            />
            <StatCard
              title="Total Candidates in Funnel"
              value={candidates.length}
              change="92% AI Match Average"
              changeType="positive"
              icon={Users}
              iconBg="bg-[#f2f8e8] text-[#59781b]"
            />
            <StatCard
              title="Interviews Scheduled"
              value={candidates.filter(c => c.stage === 'Interview').length}
              change="5 today"
              changeType="positive"
              icon={Calendar}
              iconBg="bg-purple-50 text-[#534675]"
            />
            <StatCard
              title="Offers Extended"
              value={candidates.filter(c => c.stage === 'Offer' || c.stage === 'Hired').length}
              change="100% Acceptance Rate"
              changeType="positive"
              icon={Award}
              iconBg="bg-amber-50 text-amber-600 border border-amber-200"
            />
          </div>

          <Card className="space-y-4 bg-white border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#2c2738]">Recruitment Pipeline Stage Breakdown</h3>
              <Button onClick={() => navigate('/hr/recruitment/candidates')} variant="ghost" size="sm">
                View Full Kanban Board ↗
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {stages.map((stg) => {
                const count = candidates.filter(c => c.stage === stg).length;
                return (
                  <div key={stg} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{stg}</p>
                    <p className="text-2xl font-extrabold text-[#534675]">{count}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Candidates</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: JOB OPENINGS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job title or location..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675] shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs
              .filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.location.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((job) => (
                <Card key={job.id} className="space-y-4 bg-white border border-slate-200 shadow-xs hover:border-[#534675]/40 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold text-[#2c2738]">{job.title}</h4>
                        <p className="text-xs text-[#534675] font-bold">{job.department}</p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location} • {job.type}
                    </p>

                    {job.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                        "{job.description}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Posted: {job.postedDate}</span>
                    <span className="px-3 py-1 bg-[#f0edf7] text-[#534675] font-bold rounded-lg border border-[#dcd6e8]">
                      {job.applicants} Applicants
                    </span>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: CANDIDATES KANBAN BOARD */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          {/* Mobile Stage Selector Switcher (Visible on Mobile) */}
          <div className="flex md:hidden overflow-x-auto no-scrollbar gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            {stages.map((stage) => (
              <button
                key={stage}
                onClick={() => setActiveStageTab(stage)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeStageTab === stage ? 'bg-[#534675] text-white shadow-md' : 'text-slate-600'
                  }`}
              >
                {stage} ({candidates.filter(c => c.stage === stage).length})
              </button>
            ))}
          </div>

          {/* Kanban Desktop Grid (Hidden on Mobile) */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto no-scrollbar pb-6 min-w-max">
            {stages.map((stage) => {
              const stageCandidates = candidates.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="w-64 glass-panel bg-white rounded-2xl p-3 border border-slate-200 flex flex-col gap-3 min-h-[500px]">
                  {/* Column Header */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200 px-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#2c2738]">{stage}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono font-bold text-[#534675]">
                      {stageCandidates.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3 flex-1">
                    {stageCandidates.map((can) => (
                      <Card
                        key={can.id}
                        hoverable
                        onClick={() => setSelectedCandidate(can)}
                        className="p-3.5 space-y-2.5 bg-white border-slate-200 shadow-xs cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#2c2738]">{can.name}</h4>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {can.rating}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#534675] font-semibold">{can.position}</p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                          <span className="px-2 py-0.5 bg-[#f2f8e8] text-[#59781b] rounded-md font-bold border border-[#9ec64c]/30">
                            {can.matchScore}% AI Match
                          </span>
                          <span className="text-slate-500">{can.experience}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Stage View */}
          <div className="block md:hidden space-y-3">
            {candidates.filter(c => c.stage === activeStageTab).map((can) => (
              <Card key={can.id} onClick={() => setSelectedCandidate(can)} className="space-y-2 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#2c2738]">{can.name}</h4>
                  <span className="px-2 py-0.5 bg-[#f2f8e8] text-[#59781b] text-xs font-bold rounded-md">
                    {can.matchScore}% Match
                  </span>
                </div>
                <p className="text-xs text-[#534675] font-semibold">{can.position}</p>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>{can.email}</span>
                  <Button onClick={(e) => { e.stopPropagation(); handleMoveStage(can.id, can.stage, 'next'); }} variant="ghost" size="sm" icon={ArrowRight}>
                    Advance Stage
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          title={`Candidate Profile: ${selectedCandidate.name}`}
          subtitle={`${selectedCandidate.position} • AI Match Score: ${selectedCandidate.matchScore}%`}
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2">
                <Button onClick={() => handleMoveStage(selectedCandidate.id, selectedCandidate.stage, 'prev')} variant="outline" size="sm">
                  ← Previous Stage
                </Button>
                <Button onClick={() => handleMoveStage(selectedCandidate.id, selectedCandidate.stage, 'next')} variant="primary" size="sm">
                  Advance Stage →
                </Button>
              </div>
              <Button onClick={() => setSelectedCandidate(null)} variant="ghost" size="sm">Close</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-[#2c2738]">
              <p><span className="text-slate-500 font-medium">Email:</span> {selectedCandidate.email}</p>
              <p><span className="text-slate-500 font-medium">Phone:</span> {selectedCandidate.phone}</p>
              <p><span className="text-slate-500 font-medium">Experience:</span> {selectedCandidate.experience}</p>
              <p><span className="text-slate-500 font-medium">Current Stage:</span> <strong className="text-[#534675]">{selectedCandidate.stage}</strong></p>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 1: POST JOB OPENING */}
      <Modal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        title="Post New Job Opening"
        subtitle="Publish a new job requisition to attract candidate applications."
        footer={
          <>
            <Button onClick={() => setIsAddJobOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateJob} variant="primary">Publish Job Opening</Button>
          </>
        }
      >
        <form onSubmit={handleCreateJob} className="space-y-4">
          <Input
            label="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            placeholder="e.g. Lead Machine Learning Engineer"
            required
          />
          <Select
            label="Department"
            value={newJob.department}
            onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
            options={[
              { label: 'Engineering', value: 'Engineering' },
              { label: 'Human Resources', value: 'Human Resources' },
              { label: 'Product & Design', value: 'Product & Design' },
              { label: 'Sales & Marketing', value: 'Sales & Marketing' }
            ]}
          />
          <Input
            label="Job Location"
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            placeholder="e.g. Remote / New York"
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Job Description</label>
            <textarea
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="Responsibilities and qualifications..."
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD CANDIDATE */}
      <Modal
        isOpen={isAddCandidateOpen}
        onClose={() => setIsAddCandidateOpen(false)}
        title="Add New Candidate"
        subtitle="Manually add a candidate to the ATS recruitment funnel."
        footer={
          <>
            <Button onClick={() => setIsAddCandidateOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateCandidate} variant="primary">Add Candidate</Button>
          </>
        }
      >
        <form onSubmit={handleCreateCandidate} className="space-y-4">
          <Input
            label="Candidate Full Name"
            value={newCandidate.name}
            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
            placeholder="e.g. Amanda Hayes"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={newCandidate.email}
            onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
            placeholder="e.g. amanda.h@example.com"
            required
          />
          <Select
            label="Applied Position"
            value={newCandidate.position}
            onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
            options={jobs.map(j => ({ label: j.title, value: j.title }))}
          />
          <Input
            label="Years of Experience"
            value={newCandidate.experience}
            onChange={(e) => setNewCandidate({ ...newCandidate, experience: e.target.value })}
            placeholder="e.g. 5 Years"
          />
        </form>
      </Modal>
    </div>
  );
};
