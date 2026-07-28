import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { taskApi } from '../../../api/taskApi';
import {
  CheckSquare, Plus, Clock, AlertCircle, CheckCircle2,
  Calendar, Layers, Filter, Search, User, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ESSTasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([
    {
      id: 'TASK-101',
      taskId: 'TASK-101',
      title: 'Refactor Auth Token Refresh Middleware',
      project: 'SmartHRM Core Portal',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2026-07-28',
      progress: 75,
      description: 'Optimize JWT token validation latency and add fallback handler for session expiration.'
    },
    {
      id: 'TASK-102',
      taskId: 'TASK-102',
      title: 'Complete Q3 Frontend Performance Audit',
      project: 'SmartHRM Mobile & Web',
      priority: 'Medium',
      status: 'In Progress',
      dueDate: '2026-07-30',
      progress: 40,
      description: 'Audit bundle size, lazy load routes, and fix component re-render bottlenecks.'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // New Task State
  const [newTask, setNewTask] = useState({
    title: '',
    project: 'SmartHRM Core Portal',
    priority: 'Medium',
    dueDate: '2026-08-01',
    description: ''
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getMyTasks();
      const list = res?.data || res;
      if (Array.isArray(list)) {
        setTasks(list);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTask.title) {
      toast.error('Please enter a task title');
      return;
    }
    try {
      const res = await taskApi.createTask({
        title: newTask.title,
        project: newTask.project,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        description: newTask.description
      });
      if (res?.success || res?.data || res) {
        toast.success(`Task "${newTask.title}" created successfully!`);
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error(err.message || 'Failed to create task');
    } finally {
      setIsAddTaskOpen(false);
      setNewTask({ title: '', project: 'SmartHRM Core Portal', priority: 'Medium', dueDate: '2026-08-01', description: '' });
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    const nextProgress = nextStatus === 'Completed' ? 100 : 50;

    try {
      await taskApi.updateTaskStatus(id, { status: nextStatus, progress: nextProgress });
      toast.success(`Task status changed to ${nextStatus}`);
      fetchTasks();
    } catch (err) {
      setTasks(prev =>
        prev.map(t => {
          if ((t._id || t.id) === id) {
            return { ...t, status: nextStatus, progress: nextProgress };
          }
          return t;
        })
      );
      toast.success(`Task status changed to ${nextStatus}`);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl">
      <PageHeader
        title="My Projects & Tasks"
        subtitle="Manage your sprint deliverables, assigned project tasks, and progress updates."
        breadcrumbs={['Employee Portal', 'Projects & Tasks']}
        actions={
          <Button onClick={() => setIsAddTaskOpen(true)} variant="primary" icon={Plus}>
            New Personal Task
          </Button>
        }
      />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or task title..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'In Progress', 'Completed', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-[#534675] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <Card key={t._id || t.id} className="bg-white border border-slate-200 shadow-xs hover:border-[#534675]/40 transition-all p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleTaskStatus(t._id || t.id, t.status)}
                  className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                    t.status === 'Completed' ? 'bg-[#59781b] border-[#59781b] text-white' : 'border-slate-300 bg-white hover:border-[#534675]'
                  }`}
                >
                  {t.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{t.taskId || t.id}</span>
                    <h4 className={`text-sm font-bold ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-[#2c2738]'}`}>
                      {t.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500">{t.description}</p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-[#534675]">
                      <Layers className="w-3.5 h-3.5" />
                      {t.project}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {t.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress & Priority */}
              <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg ${
                  t.priority === 'High'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : t.priority === 'Medium'
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {t.priority} Priority
                </span>

                <div className="w-32 space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-[#534675]">{t.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-[#534675] transition-all" style={{ width: `${t.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL: ADD TASK */}
      <Modal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        title="Add New Personal Task"
        subtitle="Create a task item in your employee workspace."
        footer={
          <>
            <Button onClick={() => setIsAddTaskOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleAddTask} variant="primary">Create Task</Button>
          </>
        }
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <Input
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="e.g. Implement API validation schema"
            required
          />
          <Input
            label="Project Name"
            value={newTask.project}
            onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
            placeholder="e.g. SmartHRM Core Portal"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority Level"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              options={[
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' }
              ]}
            />
            <Input
              label="Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Task Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="Brief details about what needs to be accomplished..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
