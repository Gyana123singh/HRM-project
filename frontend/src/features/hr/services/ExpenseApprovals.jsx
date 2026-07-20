import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { DataTable } from '../../../components/common/DataTable';
import { useHRStore } from '../../../store/hrStore';
import { assetInventory as initialAssets, helpDeskTickets as initialTickets, employeesList } from '../../../data/mockData';
import {
  Check, X, FileText, Plus, Search, Download, Laptop, Folder, HelpCircle,
  Clock, AlertCircle, FileCheck, ShieldCheck, DollarSign, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

const initialDocs = [
  { id: 'DOC-101', name: '2026 Employee Handbook & Code of Conduct', category: 'Company Policy', size: '4.2 MB', updated: '2026-06-01', fileType: 'PDF' },
  { id: 'DOC-102', name: 'Standard Non-Disclosure Agreement (NDA)', category: 'Legal & Compliance', size: '1.1 MB', updated: '2026-05-15', fileType: 'DOCX' },
  { id: 'DOC-103', name: 'Remote & Hybrid Work Security Policy', category: 'IT & Security', size: '2.8 MB', updated: '2026-07-10', fileType: 'PDF' },
  { id: 'DOC-104', name: 'Health Insurance Benefits Guide 2026', category: 'Benefits & Perks', size: '5.5 MB', updated: '2026-01-01', fileType: 'PDF' }
];

export const ExpenseApprovals = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { expenses, approveExpense, rejectExpense, addExpense } = useHRStore();
  const [assets, setAssets] = useState(initialAssets);
  const [documents, setDocuments] = useState(initialDocs);
  const [tickets, setTickets] = useState(initialTickets);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);

  // New Item States
  const [newExpense, setNewExpense] = useState({ employeeName: 'Rahul Sharma', category: 'Client Transport', amount: '$120.00', description: '' });
  const [newAsset, setNewAsset] = useState({ name: '', category: 'Laptop', assetId: 'AST-1028', assignedTo: 'Rahul Sharma' });
  const [newDoc, setNewDoc] = useState({ name: '', category: 'Company Policy' });
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'IT Support', priority: 'Medium', employee: 'Rahul Sharma' });

  // Map route to active tab
  const getActiveTab = () => {
    if (location.pathname.includes('/assets')) return 'assets';
    if (location.pathname.includes('/documents')) return 'documents';
    if (location.pathname.includes('/helpdesk')) return 'helpdesk';
    return 'expenses';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabId) => {
    if (tabId === 'assets') navigate('/hr/services/assets');
    else if (tabId === 'documents') navigate('/hr/services/documents');
    else if (tabId === 'helpdesk') navigate('/hr/services/helpdesk');
    else navigate('/hr/services/expenses');
  };

  const servicesTabs = [
    { id: 'expenses', label: `Expense Claims (${expenses.filter(e => e.status === 'Pending').length} Pending)` },
    { id: 'assets', label: `Asset Inventory (${assets.length})` },
    { id: 'documents', label: `Document Center (${documents.length})` },
    { id: 'helpdesk', label: `HR Help Desk (${tickets.filter(t => t.status === 'Open').length} Open)` }
  ];

  const handleCreateExpense = (e) => {
    e.preventDefault();
    addExpense({
      employeeName: newExpense.employeeName,
      category: newExpense.category,
      amount: newExpense.amount,
      date: new Date().toISOString().split('T')[0],
      receipt: 'receipt_vouch.pdf',
      status: 'Pending',
      description: newExpense.description
    });
    toast.success('Expense claim submitted for approval!');
    setIsAddExpenseOpen(false);
    setNewExpense({ employeeName: 'Rahul Sharma', category: 'Client Transport', amount: '$120.00', description: '' });
  };

  const handleCreateAsset = (e) => {
    e.preventDefault();
    const created = {
      id: newAsset.assetId,
      assetId: newAsset.assetId,
      name: newAsset.name,
      category: newAsset.category,
      assignedTo: newAsset.assignedTo,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Assigned'
    };
    setAssets([...assets, created]);
    toast.success(`Asset ${newAsset.name} registered and assigned!`);
    setIsAddAssetOpen(false);
    setNewAsset({ name: '', category: 'Laptop', assetId: `AST-${1020 + assets.length}`, assignedTo: 'Rahul Sharma' });
  };

  const handleUploadDoc = (e) => {
    e.preventDefault();
    const created = {
      id: `DOC-10${documents.length + 1}`,
      name: newDoc.name,
      category: newDoc.category,
      size: '2.4 MB',
      updated: new Date().toISOString().split('T')[0],
      fileType: 'PDF'
    };
    setDocuments([...documents, created]);
    toast.success(`Document "${newDoc.name}" uploaded to Document Center!`);
    setIsUploadDocOpen(false);
    setNewDoc({ name: '', category: 'Company Policy' });
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const created = {
      id: `TCK-90${tickets.length + 1}`,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      employee: newTicket.employee,
      date: new Date().toISOString().split('T')[0],
      status: 'Open',
      assignedHR: 'Tech Ops Team'
    };
    setTickets([created, ...tickets]);
    toast.success(`Support ticket ${created.id} created!`);
    setIsAddTicketOpen(false);
    setNewTicket({ subject: '', category: 'IT Support', priority: 'Medium', employee: 'Rahul Sharma' });
  };

  const assetColumns = [
    { header: 'Asset ID', accessorKey: 'assetId' },
    { header: 'Equipment Name', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Assigned To', accessorKey: 'assignedTo' },
    { header: 'Assigned Date', accessorKey: 'assignedDate' },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button onClick={() => toast.info(`Managing asset ${row.assetId}`)} variant="outline" size="sm">
          Re-Assign / Return
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      {/* Page Header */}
      <PageHeader
        title="Employee Services & Operations"
        subtitle="Manage business expense claims, hardware assets, policy documents, and helpdesk tickets."
        breadcrumbs={['Employee Services', activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]}
        actions={
          activeTab === 'expenses' ? (
            <Button onClick={() => setIsAddExpenseOpen(true)} variant="primary" icon={Plus}>
              Submit Claim
            </Button>
          ) : activeTab === 'assets' ? (
            <Button onClick={() => setIsAddAssetOpen(true)} variant="primary" icon={Plus}>
              Add Hardware Asset
            </Button>
          ) : activeTab === 'documents' ? (
            <Button onClick={() => setIsUploadDocOpen(true)} variant="primary" icon={Upload}>
              Upload Document
            </Button>
          ) : activeTab === 'helpdesk' ? (
            <Button onClick={() => setIsAddTicketOpen(true)} variant="primary" icon={Plus}>
              Create Support Ticket
            </Button>
          ) : null
        }
      />

      {/* Navigation Tabs */}
      <Tabs tabs={servicesTabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* SEARCH BAR FOR TABS */}
      {['documents', 'helpdesk', 'assets'].includes(activeTab) && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675] shadow-xs"
          />
        </div>
      )}

      {/* TAB 1: EXPENSE CLAIMS */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {expenses.map((exp) => (
            <Card key={exp.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 shadow-xs">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-bold text-[#2c2738]">{exp.employeeName}</h4>
                  <StatusBadge status={exp.status} />
                </div>
                <p className="text-xs font-semibold text-[#534675]">{exp.category} • <strong className="text-[#59781b]">{exp.amount}</strong> ({exp.date})</p>
                <p className="text-xs text-[#2c2738] bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-2">
                  "{exp.description}"
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <FileText className="w-3.5 h-3.5 text-[#534675]" />
                  Receipt: {exp.receipt}
                </p>
              </div>

              {exp.status === 'Pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button onClick={() => { approveExpense(exp.id); toast.success('Expense claim approved'); }} variant="accent" icon={Check}>
                    Approve Claim
                  </Button>
                  <Button onClick={() => { rejectExpense(exp.id); toast.error('Expense claim rejected'); }} variant="danger" icon={X}>
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: ASSET MANAGEMENT */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <DataTable columns={assetColumns} data={assets.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()))} />
        </div>
      )}

      {/* TAB 3: DOCUMENT CENTER */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents
            .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.category.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((doc) => (
              <Card key={doc.id} className="space-y-3 bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4 hover:border-[#534675]/40 transition-all">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className="p-3 bg-[#f0edf7] text-[#534675] rounded-2xl border border-[#dcd6e8] shrink-0">
                    <Folder className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5 truncate">
                    <h4 className="text-sm font-bold text-[#2c2738] truncate">{doc.name}</h4>
                    <p className="text-xs text-[#534675] font-semibold">{doc.category} • {doc.size}</p>
                    <p className="text-[10px] text-slate-400">Updated: {doc.updated}</p>
                  </div>
                </div>

                <Button
                  onClick={() => toast.success(`Downloading ${doc.name}`)}
                  variant="outline"
                  size="sm"
                  icon={Download}
                  className="shrink-0"
                >
                  Download
                </Button>
              </Card>
            ))}
        </div>
      )}

      {/* TAB 4: HR HELP DESK */}
      {activeTab === 'helpdesk' && (
        <div className="space-y-4">
          {tickets
            .filter(t => t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.employee.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((tck) => (
              <Card key={tck.id} className="space-y-3 bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400">{tck.id}</span>
                    <h4 className="text-base font-bold text-[#2c2738]">{tck.subject}</h4>
                    <StatusBadge status={tck.status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Category: <strong className="text-[#534675]">{tck.category}</strong> • Priority: <strong className="text-amber-600">{tck.priority}</strong> • Submitted by: {tck.employee}
                  </p>
                  <p className="text-[11px] text-slate-400">Assigned Team: {tck.assignedHR} • Date: {tck.date}</p>
                </div>

                <Button onClick={() => toast.info(`Viewing support ticket ${tck.id}`)} variant="outline" size="sm">
                  View Ticket
                </Button>
              </Card>
            ))}
        </div>
      )}

      {/* MODAL 1: SUBMIT EXPENSE */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        title="Submit Expense Claim"
        subtitle="Request reimbursement for business expenses and travel."
        footer={
          <>
            <Button onClick={() => setIsAddExpenseOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateExpense} variant="primary">Submit Claim</Button>
          </>
        }
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <Select
            label="Claimant Employee"
            value={newExpense.employeeName}
            onChange={(e) => setNewExpense({ ...newExpense, employeeName: e.target.value })}
            options={employeesList.map(e => ({ label: e.name, value: e.name }))}
          />
          <Select
            label="Expense Category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            options={[
              { label: 'Client Transport & Travel', value: 'Client Transport & Travel' },
              { label: 'Client Meals & Entertainment', value: 'Client Meals & Entertainment' },
              { label: 'Software & Tools Subscription', value: 'Software Subscription' },
              { label: 'Office Supplies & Stationaries', value: 'Office Supplies' }
            ]}
          />
          <Input
            label="Claim Amount ($)"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Claim Description</label>
            <textarea
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="Provide business justification..."
              required
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD ASSET */}
      <Modal
        isOpen={isAddAssetOpen}
        onClose={() => setIsAddAssetOpen(false)}
        title="Register Hardware Asset"
        subtitle="Add a new hardware device to company inventory."
        footer={
          <>
            <Button onClick={() => setIsAddAssetOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateAsset} variant="primary">Register Asset</Button>
          </>
        }
      >
        <form onSubmit={handleCreateAsset} className="space-y-4">
          <Input
            label="Equipment Name"
            value={newAsset.name}
            onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
            placeholder="e.g. Lenovo ThinkPad P16 Workstation"
            required
          />
          <Select
            label="Category"
            value={newAsset.category}
            onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
            options={[
              { label: 'Laptop', value: 'Laptop' },
              { label: 'Monitor', value: 'Monitor' },
              { label: 'Mobile Phone', value: 'Mobile' },
              { label: 'Security Key / Token', value: 'Security' }
            ]}
          />
          <Select
            label="Assign To Employee"
            value={newAsset.assignedTo}
            onChange={(e) => setNewAsset({ ...newAsset, assignedTo: e.target.value })}
            options={employeesList.map(e => ({ label: e.name, value: e.name }))}
          />
        </form>
      </Modal>

      {/* MODAL 3: UPLOAD DOCUMENT */}
      <Modal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        title="Upload Company Document"
        subtitle="Publish policy files or handbook templates to Document Center."
        footer={
          <>
            <Button onClick={() => setIsUploadDocOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleUploadDoc} variant="primary">Upload File</Button>
          </>
        }
      >
        <form onSubmit={handleUploadDoc} className="space-y-4">
          <Input
            label="Document Title"
            value={newDoc.name}
            onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
            placeholder="e.g. Annual Leave & Absence Policy 2026"
            required
          />
          <Select
            label="Category"
            value={newDoc.category}
            onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
            options={[
              { label: 'Company Policy', value: 'Company Policy' },
              { label: 'Legal & Compliance', value: 'Legal & Compliance' },
              { label: 'IT & Security', value: 'IT & Security' },
              { label: 'Benefits & Perks', value: 'Benefits & Perks' }
            ]}
          />
        </form>
      </Modal>

      {/* MODAL 4: CREATE HELP DESK TICKET */}
      <Modal
        isOpen={isAddTicketOpen}
        onClose={() => setIsAddTicketOpen(false)}
        title="Create HR Support Ticket"
        subtitle="File a ticket for IT support, payroll queries, or workplace issues."
        footer={
          <>
            <Button onClick={() => setIsAddTicketOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateTicket} variant="primary">Create Ticket</Button>
          </>
        }
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Ticket Subject"
            value={newTicket.subject}
            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
            placeholder="e.g. Request for Docking Station & Dual Monitors"
            required
          />
          <Select
            label="Category"
            value={newTicket.category}
            onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
            options={[
              { label: 'IT Support & Hardware', value: 'IT Support' },
              { label: 'Payroll & Tax Query', value: 'Payroll' },
              { label: 'Workplace Facilities', value: 'Workplace Facilities' },
              { label: 'Benefits & Leave', value: 'Benefits & Leave' }
            ]}
          />
          <Select
            label="Priority Level"
            value={newTicket.priority}
            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
            options={[
              { label: 'Low', value: 'Low' },
              { label: 'Medium', value: 'Medium' },
              { label: 'High', value: 'High' },
              { label: 'Urgent', value: 'Urgent' }
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};
