import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { goalsList as initialGoals, onboardingTasks as initialOnboarding, employeesList } from '../../../data/mockData';
import { lifecycleApi } from '../../../api/lifecycleApi';
import { employeeApi } from '../../../api/employeeApi';
import {
  Target, Plus, Calendar, Award, Star, Heart, CheckCircle2, UserCheck,
  TrendingUp, Sparkles, MessageSquare, ThumbsUp, ShieldCheck, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const initialReviews = [
  { id: 'REV-01', employee: 'Rahul Sharma', reviewer: 'Alex Vance (VP Eng)', period: 'Q2 2026 Appraisal', rating: '4.8 / 5.0', status: 'Completed', remarks: 'Outstanding delivery on frontend design system and performance.' },
  { id: 'REV-02', employee: 'Sarah Jenkins', reviewer: 'Executive Board', period: 'Annual Leadership 2026', rating: '4.9 / 5.0', status: 'Completed', remarks: 'Superb talent retention and organizational culture scaling.' },
  { id: 'REV-03', employee: 'Michael Chang', reviewer: 'Alex Vance (VP Eng)', period: 'Probation Confirmation', rating: '4.5 / 5.0', status: 'Pending', remarks: 'Strong DevOps technical skills, finalizing 6-month review.' }
];

const initialKudos = [
  { id: 'KUD-01', recipient: 'Rahul Sharma', sender: 'Sarah Jenkins', badge: 'Innovation Star Award', points: '+500 Pts', message: 'Exceptional work re-architecting the enterprise HRM design system!', time: '2 hours ago' },
  { id: 'KUD-02', recipient: 'Sophia Martinez', sender: 'Elena Rostova', badge: 'Team Player Badge', points: '+250 Pts', message: 'Fantastic UX research insights that shaped our Q3 product roadmap.', time: '1 day ago' },
  { id: 'KUD-03', recipient: 'Michael Chang', sender: 'Alex Vance', badge: 'Customer Champion', points: '+300 Pts', message: 'Resolved high-priority production infrastructure emergency in record time!', time: '2 days ago' }
];

export const GoalsOKRs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [goals, setGoals] = useState(initialGoals);
  const [onboarding, setOnboarding] = useState(initialOnboarding);
  const [reviews, setReviews] = useState(initialReviews);
  const [kudos, setKudos] = useState(initialKudos);
  const [dbEmployees, setDbEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isGiveKudosOpen, setIsGiveKudosOpen] = useState(false);

  // New Item States
  const [newGoal, setNewGoal] = useState({ title: '', target: '100%', weight: '30%', owner: '', deadline: '2026-09-30' });
  const [newReview, setNewReview] = useState({ employee: '', reviewer: 'Alex Vance', period: 'Q3 2026 Appraisal', rating: '4.8 / 5.0', remarks: '' });
  const [newKudos, setNewKudos] = useState({ recipient: '', badge: 'Innovation Star Award', points: '+300 Pts', message: '' });

  // Map route to active tab
  const getActiveTab = () => {
    if (location.pathname.includes('/onboarding')) return 'onboarding';
    if (location.pathname.includes('/performance')) return 'performance';
    if (location.pathname.includes('/recognition')) return 'recognition';
    return 'goals';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabId) => {
    if (tabId === 'onboarding') navigate('/hr/lifecycle/onboarding');
    else if (tabId === 'performance') navigate('/hr/lifecycle/performance');
    else if (tabId === 'recognition') navigate('/hr/lifecycle/recognition');
    else navigate('/hr/lifecycle/goals');
  };

  // Fetch Lifecycle API Data
  const fetchLifecycleData = async () => {
    setLoading(true);
    try {
      const [onbRes, revRes, goalRes, kudRes, empRes] = await Promise.allSettled([
        lifecycleApi.getOnboarding(),
        lifecycleApi.getReviews(),
        lifecycleApi.getGoals(),
        lifecycleApi.getKudos(),
        employeeApi.getAllEmployees()
      ]);

      if (onbRes.status === 'fulfilled' && Array.isArray(onbRes.value?.data)) {
        setOnboarding(onbRes.value.data);
      }
      if (revRes.status === 'fulfilled' && Array.isArray(revRes.value?.data)) {
        setReviews(revRes.value.data);
      }
      if (goalRes.status === 'fulfilled' && Array.isArray(goalRes.value?.data)) {
        setGoals(goalRes.value.data);
      }
      if (kudRes.status === 'fulfilled' && Array.isArray(kudRes.value?.data)) {
        setKudos(kudRes.value.data);
      }
      if (empRes.status === 'fulfilled' && Array.isArray(empRes.value?.data)) {
        setDbEmployees(empRes.value.data);
        if (empRes.value.data.length > 0) {
          const firstEmpName = `${empRes.value.data[0].firstName} ${empRes.value.data[0].lastName}`;
          setNewGoal((prev) => ({ ...prev, owner: prev.owner || firstEmpName }));
          setNewReview((prev) => ({ ...prev, employee: prev.employee || firstEmpName }));
          setNewKudos((prev) => ({ ...prev, recipient: prev.recipient || firstEmpName }));
        }
      }
    } catch (err) {
      console.error('Failed to load lifecycle data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLifecycleData();
  }, []);

  const lifecycleTabs = [
    { id: 'onboarding', label: `Onboarding (${onboarding.length})` },
    { id: 'performance', label: `Performance Reviews (${reviews.length})` },
    { id: 'goals', label: `Goals & OKRs (${goals.length})` },
    { id: 'recognition', label: `Kudos & Recognition (${kudos.length})` }
  ];

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title) {
      toast.error('Please enter an objective title');
      return;
    }
    try {
      const res = await lifecycleApi.createGoal(newGoal);
      if (res?.success || res?.data) {
        toast.success(`OKR Objective "${newGoal.title}" created successfully!`);
        fetchLifecycleData();
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      toast.error(err.message || 'Failed to create objective');
    } finally {
      setIsAddGoalOpen(false);
      setNewGoal({ title: '', target: '100%', weight: '30%', owner: '', deadline: '2026-09-30' });
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!newReview.employee) {
      toast.error('Please select an employee for the review');
      return;
    }
    try {
      const res = await lifecycleApi.createReview(newReview);
      if (res?.success || res?.data) {
        toast.success(`Performance appraisal cycle initiated for ${newReview.employee}!`);
        fetchLifecycleData();
      }
    } catch (err) {
      console.error('Error creating review:', err);
      toast.error(err.message || 'Failed to initiate performance review');
    } finally {
      setIsAddReviewOpen(false);
      setNewReview({ employee: '', reviewer: 'Alex Vance', period: 'Q3 2026 Appraisal', rating: '4.8 / 5.0', remarks: '' });
    }
  };

  const handleGiveKudos = async (e) => {
    e.preventDefault();
    if (!newKudos.recipient || !newKudos.message) {
      toast.error('Please select a recipient and enter a message');
      return;
    }
    try {
      const res = await lifecycleApi.giveKudos(newKudos);
      if (res?.success || res?.data) {
        toast.success(`Kudos awarded to ${newKudos.recipient}! 🎉`);
        fetchLifecycleData();
      }
    } catch (err) {
      console.error('Error giving kudos:', err);
      toast.error(err.message || 'Failed to send kudos');
    } finally {
      setIsGiveKudosOpen(false);
      setNewKudos({ recipient: '', badge: 'Innovation Star Award', points: '+300 Pts', message: '' });
    }
  };

  const employeeOptions = dbEmployees.length > 0
    ? dbEmployees.map((e) => ({ label: `${e.firstName} ${e.lastName} (${e.employeeCode})`, value: `${e.firstName} ${e.lastName}` }))
    : employeesList.map((e) => ({ label: e.name, value: e.name }));

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      {/* Page Header */}
      <PageHeader
        title="Employee Lifecycle & Performance Management"
        subtitle="Track onboarding progress, performance appraisals, OKRs, and employee recognition."
        breadcrumbs={['Employee Lifecycle', activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]}
        actions={
          activeTab === 'goals' ? (
            <Button onClick={() => setIsAddGoalOpen(true)} variant="primary" icon={Plus}>
              New Objective
            </Button>
          ) : activeTab === 'performance' ? (
            <Button onClick={() => setIsAddReviewOpen(true)} variant="primary" icon={Plus}>
              Initiate Review
            </Button>
          ) : activeTab === 'recognition' ? (
            <Button onClick={() => setIsGiveKudosOpen(true)} variant="primary" icon={Award}>
              Give Kudos
            </Button>
          ) : null
        }
      />

      {/* Tabs */}
      <Tabs tabs={lifecycleTabs} activeTab={activeTab} onChange={handleTabChange} />

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#534675] animate-spin" />
          <span className="ml-3 text-sm font-medium text-slate-600">Loading Lifecycle & Performance Data...</span>
        </div>
      )}

      {/* TAB 1: ONBOARDING */}
      {!loading && activeTab === 'onboarding' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {onboarding.map((item, idx) => (
            <Card key={item._id || item.id || idx} className="space-y-4 bg-white border border-slate-200 shadow-xs hover:border-[#534675]/40 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold text-[#2c2738]">{item.employee}</h4>
                  <p className="text-xs text-slate-500 font-medium">Assigned Mentor: <strong className="text-[#534675]">{item.mentor}</strong></p>
                </div>
                <StatusBadge status={item.status || 'In Progress'} />
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Progress ({item.completed || 0} / {item.total || 8} Tasks)</span>
                  <span className="font-bold text-[#534675]">{item.progress || 0}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#534675] to-[#9ec64c] rounded-full transition-all duration-500"
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: PERFORMANCE REVIEWS */}
      {!loading && activeTab === 'performance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Active Review Cycle" value="Q2 2026" description="88% Completed" icon={Calendar} iconBg="bg-[#f0edf7] text-[#534675]" />
            <StatCard title="Average Performance Rating" value="4.7 / 5.0" description="High Performers" icon={Star} iconBg="bg-[#f2f8e8] text-[#59781b]" />
            <StatCard title="Pending Appraisals" value={reviews.filter(r => r.status === 'Pending').length} description="Requires Manager Sign-off" icon={CheckCircle2} iconBg="bg-amber-50 text-amber-600 border border-amber-200" />
          </div>

          <div className="space-y-3">
            {reviews.map((rev, idx) => (
              <Card key={rev._id || rev.id || idx} className="space-y-3 bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-bold text-[#2c2738]">{rev.employee}</h4>
                    <span className="px-2.5 py-0.5 bg-[#f2f8e8] text-[#59781b] text-[11px] font-bold rounded-md border border-[#9ec64c]/30">
                      Rating: {rev.rating}
                    </span>
                    <StatusBadge status={rev.status || 'Pending'} />
                  </div>
                  <p className="text-xs text-[#534675] font-semibold">{rev.period} • Evaluator: {rev.reviewer}</p>
                  <p className="text-xs text-[#2c2738] bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-2">
                    "{rev.remarks}"
                  </p>
                </div>

                <Button onClick={() => toast.success(`Viewed complete review document for ${rev.employee}`)} variant="outline" size="sm">
                  View Assessment
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GOALS & OKRS */}
      {!loading && activeTab === 'goals' && (
        <div className="space-y-4">
          {goals.map((goal, idx) => (
            <Card key={goal._id || goal.id || idx} className="space-y-3 bg-white border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-[#2c2738] flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#534675]" />
                    {goal.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Owner: <strong className="text-[#2c2738]">{goal.owner}</strong> • Weight: {goal.weight} • Deadline: {goal.deadline}</p>
                </div>
                <StatusBadge status={goal.status || 'In Progress'} />
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Target: {goal.target}</span>
                  <span className="text-[#534675] font-bold">{goal.progress || 0}% Completed</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#534675] via-[#7b6d9e] to-[#9ec64c] rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 4: KUDOS & RECOGNITION */}
      {!loading && activeTab === 'recognition' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kudos.map((kud, idx) => (
              <Card key={kud._id || kud.id || idx} className="space-y-3 bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#e95f87]/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-rose-50 text-[#e95f87] text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      {kud.badge}
                    </span>
                    <span className="text-xs font-bold text-[#59781b]">{kud.points || '+300 Pts'}</span>
                  </div>

                  <h4 className="text-base font-bold text-[#2c2738]">{kud.recipient}</h4>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
                    "{kud.message}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Awarded by: <strong className="text-[#534675]">{kud.sender}</strong></span>
                  <span>{kud.time || 'Just now'}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: NEW OBJECTIVE */}
      <Modal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        title="Create OKR Objective"
        subtitle="Establish strategic quarterly goals and key results."
        footer={
          <>
            <Button onClick={() => setIsAddGoalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateGoal} variant="primary">Create Objective</Button>
          </>
        }
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Objective Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="e.g. Optimize CI/CD Pipeline Build Speed by 40%"
            required
          />
          <Select
            label="Objective Owner"
            value={newGoal.owner}
            onChange={(e) => setNewGoal({ ...newGoal, owner: e.target.value })}
            options={employeeOptions}
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Target Metric"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              placeholder="e.g. 100%"
              required
            />
            <Input
              label="Weight (%)"
              value={newGoal.weight}
              onChange={(e) => setNewGoal({ ...newGoal, weight: e.target.value })}
              placeholder="e.g. 30%"
              required
            />
            <Input
              label="Target Deadline"
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 2: INITIATE REVIEW */}
      <Modal
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        title="Initiate Performance Review"
        subtitle="Schedule a formal appraisal cycle for team members."
        footer={
          <>
            <Button onClick={() => setIsAddReviewOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateReview} variant="primary">Initiate Review</Button>
          </>
        }
      >
        <form onSubmit={handleCreateReview} className="space-y-4">
          <Select
            label="Select Employee"
            value={newReview.employee}
            onChange={(e) => setNewReview({ ...newReview, employee: e.target.value })}
            options={employeeOptions}
          />
          <Input
            label="Review Cycle Period"
            value={newReview.period}
            onChange={(e) => setNewReview({ ...newReview, period: e.target.value })}
            placeholder="e.g. Q3 2026 Appraisal"
            required
          />
          <Input
            label="Lead Evaluator / Reviewer"
            value={newReview.reviewer}
            onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })}
            placeholder="e.g. Alex Vance (VP Eng)"
            required
          />
          <Input
            label="Rating Target"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
            placeholder="e.g. 4.8 / 5.0"
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Review Notes / Remarks</label>
            <textarea
              value={newReview.remarks || ''}
              onChange={(e) => setNewReview({ ...newReview, remarks: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="Enter appraisal instructions or initial performance notes..."
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 3: GIVE KUDOS */}
      <Modal
        isOpen={isGiveKudosOpen}
        onClose={() => setIsGiveKudosOpen(false)}
        title="Award Kudos & Recognition"
        subtitle="Recognize outstanding teamwork and achievements."
        footer={
          <>
            <Button onClick={() => setIsGiveKudosOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleGiveKudos} variant="primary">Send Kudos 🎉</Button>
          </>
        }
      >
        <form onSubmit={handleGiveKudos} className="space-y-4">
          <Select
            label="Select Recipient"
            value={newKudos.recipient}
            onChange={(e) => setNewKudos({ ...newKudos, recipient: e.target.value })}
            options={employeeOptions}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Award Badge"
              value={newKudos.badge}
              onChange={(e) => setNewKudos({ ...newKudos, badge: e.target.value })}
              options={[
                { label: 'Innovation Star Award', value: 'Innovation Star Award' },
                { label: 'Team Player Badge', value: 'Team Player Badge' },
                { label: 'Customer Champion', value: 'Customer Champion' },
                { label: 'Above & Beyond Award', value: 'Above & Beyond Award' },
                { label: 'Leadership Excellence', value: 'Leadership Excellence' }
              ]}
            />
            <Input
              label="Reward Points"
              value={newKudos.points || '+300 Pts'}
              onChange={(e) => setNewKudos({ ...newKudos, points: e.target.value })}
              placeholder="e.g. +500 Pts"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Personal Message</label>
            <textarea
              value={newKudos.message}
              onChange={(e) => setNewKudos({ ...newKudos, message: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="Write a message of appreciation..."
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
