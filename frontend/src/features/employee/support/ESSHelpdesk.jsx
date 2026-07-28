import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { ticketApi } from '../../../api/ticketApi';
import { HelpCircle, Plus, MessageSquare, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ESSHelpdesk = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([
    {
      id: 'TICK-1001',
      ticketId: 'TICK-1001',
      category: 'Payroll & Salary Query',
      subject: 'July Payslip Tax Withholding Inquiry',
      description: 'Requesting breakdown of federal tax deduction on July salary disbursement.',
      priority: 'Medium',
      status: 'In Progress',
      createdAt: '2026-07-28'
    },
    {
      id: 'TICK-1002',
      ticketId: 'TICK-1002',
      category: 'IT Hardware & Access Issue',
      subject: 'VPN Access Certificate Renewal',
      description: 'Need certificate update for secure internal staging server access.',
      priority: 'High',
      status: 'Open',
      createdAt: '2026-07-27'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('Payroll & Salary Query');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');

  const fetchMyTickets = async () => {
    setLoading(true);
    try {
      const res = await ticketApi.getMyTickets();
      const list = res?.data || res;
      if (Array.isArray(list) && list.length > 0) {
        setTickets(list);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handleTicketSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!ticketSubject || !ticketDescription) {
      toast.error('Please enter both subject and description');
      return;
    }
    try {
      const res = await ticketApi.createTicket({
        category: ticketCategory,
        subject: ticketSubject,
        description: ticketDescription,
        priority: 'Medium'
      });
      if (res?.success || res?.data || res) {
        toast.success(`Support ticket "${ticketSubject}" created!`);
        await fetchMyTickets();
      }
    } catch (err) {
      console.error('Error submitting ticket:', err);
      toast.error(err.message || 'Failed to submit support ticket');
    } finally {
      setIsCreateModalOpen(false);
      setTicketSubject('');
      setTicketDescription('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl">
      <PageHeader
        title="HR Help Desk & Support"
        subtitle="Lodge inquiries regarding payroll, health insurance, workplace policies, or IT hardware."
        breadcrumbs={['Employee Portal', 'HR Help Desk']}
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" icon={Plus}>
            New Support Ticket
          </Button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Tickets"
          value={tickets.length.toString()}
          description="Submitted Inquiries"
          icon={HelpCircle}
          variant="cyan"
        />
        <StatCard
          title="Open / Active"
          value={tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length.toString()}
          description="In Review by HR"
          icon={Clock}
          variant="mint"
        />
        <StatCard
          title="Resolved"
          value={tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length.toString()}
          description="Completed Tickets"
          icon={CheckCircle2}
          variant="peach"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#534675] animate-spin" />
          <span className="ml-3 text-sm font-medium text-slate-600">Loading Support Tickets...</span>
        </div>
      )}

      {/* Tickets List */}
      {!loading && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#2c2738] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#534675]" />
            My Ticket History
          </h3>

          <div className="space-y-3">
            {tickets.map((t) => (
              <Card key={t._id || t.id} className="bg-white border border-slate-200 shadow-xs space-y-3 p-4 hover:border-[#534675]/40 transition-all">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#f0edf7] text-[#534675] rounded-xl border border-[#dcd6e8]">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400">{t.ticketId || t.id}</span>
                        <h4 className="text-sm font-bold text-[#2c2738]">{t.subject}</h4>
                      </div>
                      <p className="text-xs text-[#534675] font-semibold">{t.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md ${
                      t.priority === 'High'
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {t.priority || 'Medium'} Priority
                    </span>
                    <StatusBadge status={t.status || 'Open'} />
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {t.description}
                </p>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1">
                  <span>Logged On: {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Today'}</span>
                  <span className="text-[#534675]">Assigned to HR Support Team</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE TICKET */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create HR Support Ticket"
        subtitle="Submit inquiries regarding payroll, benefits, or workplace queries."
        footer={
          <>
            <Button onClick={() => setIsCreateModalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleTicketSubmit} variant="primary">Submit Ticket</Button>
          </>
        }
      >
        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <Select
            label="Inquiry Category"
            value={ticketCategory}
            onChange={(e) => setTicketCategory(e.target.value)}
            options={[
              { label: 'Payroll & Salary Query', value: 'Payroll & Salary Query' },
              { label: 'Leave & Attendance Policy', value: 'Leave & Attendance Policy' },
              { label: 'Health Insurance & Benefits', value: 'Health Insurance & Benefits' },
              { label: 'IT Hardware & Access Issue', value: 'IT Hardware & Access Issue' }
            ]}
          />
          <Input
            label="Ticket Subject"
            value={ticketSubject}
            onChange={(e) => setTicketSubject(e.target.value)}
            placeholder="e.g. July Payslip Tax Withholding Inquiry"
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Detailed Description</label>
            <textarea
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="Provide complete details regarding your inquiry..."
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
