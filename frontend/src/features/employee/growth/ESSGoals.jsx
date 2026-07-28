import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { lifecycleApi } from '../../../api/lifecycleApi';
import { Target, Award, Plus, CheckCircle2, Trophy, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ESSGoals = () => {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([
    {
      id: 'OKR-001',
      title: 'Migrate Micro-frontends to Vite Builder',
      category: 'Technical Excellence',
      period: 'Q3 2026',
      progress: 85,
      targetDate: '2026-09-30',
      keyResults: [
        'Reduce HMR reload time under 200ms',
        'Achieve 95%+ Lighthouse performance score'
      ]
    },
    {
      id: 'OKR-002',
      title: 'Enhance API Response Time under 150ms',
      category: 'Backend Optimization',
      period: 'Q3 2026',
      progress: 60,
      targetDate: '2026-09-15',
      keyResults: [
        'Add Redis caching layer for MongoDB queries',
        'Optimize pagination indexes on Employee collections'
      ]
    }
  ]);

  const [kudosList, setKudosList] = useState([
    { id: 1, title: 'Innovation Star Award', points: 500, from: 'Sarah Jenkins', reason: 'Outstanding design system implementation.' },
    { id: 2, title: 'Team Player Badge', points: 300, from: 'Alex Vance', reason: 'Superb sprint planning and code reviews.' }
  ]);

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'Engineering',
    period: 'Q3 2026',
    targetDate: '2026-09-30',
    keyResultsStr: ''
  });

  const fetchGoalsAndKudos = async () => {
    setLoading(true);
    try {
      const [goalsRes, kudosRes] = await Promise.allSettled([
        lifecycleApi.getGoals(),
        lifecycleApi.getKudos()
      ]);

      if (goalsRes.status === 'fulfilled') {
        const gList = goalsRes.value?.data || goalsRes.value;
        if (Array.isArray(gList) && gList.length > 0) {
          setGoals(gList);
        }
      }
      if (kudosRes.status === 'fulfilled') {
        const kList = kudosRes.value?.data || kudosRes.value;
        if (Array.isArray(kList) && kList.length > 0) {
          setKudosList(kList);
        }
      }
    } catch (err) {
      console.error('Error loading goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsAndKudos();
  }, []);

  const handleAddGoal = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newGoal.title) {
      toast.error('Please enter a goal title');
      return;
    }
    try {
      const krArray = newGoal.keyResultsStr.split('\n').filter(Boolean);
      const res = await lifecycleApi.createGoal({
        title: newGoal.title,
        category: newGoal.category,
        period: newGoal.period,
        targetDate: newGoal.targetDate,
        keyResults: krArray
      });

      if (res?.success || res?.data || res) {
        toast.success(`Goal "${newGoal.title}" created successfully!`);
        await fetchGoalsAndKudos();
      }
    } catch (err) {
      console.error('Error creating goal:', err);
      toast.error(err.message || 'Failed to create goal');
    } finally {
      setIsAddGoalOpen(false);
      setNewGoal({ title: '', category: 'Engineering', period: 'Q3 2026', targetDate: '2026-09-30', keyResultsStr: '' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl">
      <PageHeader
        title="My Goals & OKRs"
        subtitle="Track personal performance objectives, key results, and peer kudos recognition."
        breadcrumbs={['Employee Portal', 'Goals & OKRs']}
        actions={
          <Button onClick={() => setIsAddGoalOpen(true)} variant="primary" icon={Plus}>
            Create OKR Goal
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Goals"
          value={goals.length.toString()}
          description="In Progress"
          icon={Target}
          variant="cyan"
        />
        <StatCard
          title="Avg Completion"
          value="72.5%"
          description="Q3 Performance Target"
          icon={Sparkles}
          variant="mint"
        />
        <StatCard
          title="Kudos Points"
          value="800 Pts"
          description="Badges Earned"
          icon={Trophy}
          variant="peach"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#534675] animate-spin" />
          <span className="ml-3 text-sm font-medium text-slate-600">Loading Goals & Kudos...</span>
        </div>
      )}

      {/* Content Row: Objectives & Kudos */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-[#2c2738] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#534675]" />
              Quarterly OKR Objectives
            </h3>

            {goals.map((g) => (
              <Card key={g._id || g.id} className="bg-white border border-slate-200 shadow-xs space-y-4 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 bg-[#f0edf7] text-[#534675] text-[11px] font-bold rounded-md border border-[#dcd6e8]">
                      {g.period || 'Q3 2026'}
                    </span>
                    <h4 className="text-base font-bold text-[#2c2738] mt-1">{g.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{g.category} • Target Date: {g.targetDate || '2026-09-30'}</p>
                  </div>
                  <span className="text-sm font-black text-[#534675] bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
                    {g.progress || 50}%
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-[#534675] transition-all" style={{ width: `${g.progress || 50}%` }} />
                  </div>
                </div>

                {g.keyResults && g.keyResults.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Key Results:</p>
                    {g.keyResults.map((kr, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#59781b] shrink-0" />
                        <span>{typeof kr === 'string' ? kr : kr.title || 'Key deliverable milestone'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Kudos Showcase Feed */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#2c2738] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#e95f87]" />
              Kudos & Recognition
            </h3>

            <Card className="bg-white border border-slate-200 shadow-xs space-y-3 p-4">
              {kudosList.map((kud, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 bg-rose-50 text-[#e95f87] text-[11px] font-bold rounded-lg border border-rose-200">
                      🏆 {kud.title || kud.badge || 'Excellence Award'}
                    </span>
                    <span className="text-xs font-bold text-[#59781b]">+{kud.points || 500} Pts</span>
                  </div>
                  <p className="text-xs text-[#2c2738] italic">"{kud.reason || kud.message}"</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Awarded by: {kud.from || kud.givenBy || 'HR Admin'}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* MODAL: ADD OKR GOAL */}
      <Modal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        title="Create OKR Goal Objective"
        subtitle="Define new quarter objectives and measurable key results."
        footer={
          <>
            <Button onClick={() => setIsAddGoalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleAddGoal} variant="primary">Create Objective</Button>
          </>
        }
      >
        <form onSubmit={handleAddGoal} className="space-y-4">
          <Input
            label="Objective Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="e.g. Implement real-time WebSocket notifications"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Quarter Period"
              value={newGoal.period}
              onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value })}
              options={[
                { label: 'Q3 2026', value: 'Q3 2026' },
                { label: 'Q4 2026', value: 'Q4 2026' },
                { label: 'Q1 2027', value: 'Q1 2027' }
              ]}
            />
            <Input
              label="Target Completion Date"
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Key Results (One per line)</label>
            <textarea
              value={newGoal.keyResultsStr}
              onChange={(e) => setNewGoal({ ...newGoal, keyResultsStr: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="e.g. Achieve sub-100ms response time&#10;Write 100% automated integration unit tests"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
