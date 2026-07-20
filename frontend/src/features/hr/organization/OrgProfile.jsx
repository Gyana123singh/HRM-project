import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Input, Select } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { organizationProfile, branches as initialBranches, departments as initialDepartments, designations as initialDesignations } from '../../../data/mockData';
import {
  Building, Save, Globe, Phone, Mail, MapPin, Plus, Search,
  Briefcase, Users, Layers, Award, CheckCircle2, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export const OrgProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(organizationProfile);
  const [branchesList, setBranchesList] = useState(initialBranches);
  const [deptsList, setDeptsList] = useState(initialDepartments);
  const [designationsList, setDesignationsList] = useState(initialDesignations);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
  const [isAddDesigOpen, setIsAddDesigOpen] = useState(false);

  // New Item Form State
  const [newBranch, setNewBranch] = useState({ name: '', location: '', head: '' });
  const [newDept, setNewDept] = useState({ name: '', head: '', description: '' });
  const [newDesig, setNewDesig] = useState({ name: '', department: 'Engineering', level: 'L4' });

  // Map route to active tab
  const getActiveTab = () => {
    if (location.pathname.includes('/branches')) return 'branches';
    if (location.pathname.includes('/departments')) return 'departments';
    if (location.pathname.includes('/designations')) return 'designations';
    return 'profile';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabId) => {
    if (tabId === 'branches') navigate('/hr/organization/branches');
    else if (tabId === 'departments') navigate('/hr/organization/departments');
    else if (tabId === 'designations') navigate('/hr/organization/designations');
    else navigate('/hr/organization/profile');
  };

  const orgTabs = [
    { id: 'profile', label: 'Organization Profile' },
    { id: 'branches', label: `Branches (${branchesList.length})` },
    { id: 'departments', label: `Departments (${deptsList.length})` },
    { id: 'designations', label: `Designations (${designationsList.length})` }
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Organization profile updated successfully');
  };

  const handleAddBranch = (e) => {
    e.preventDefault();
    const created = {
      id: `BR-0${branchesList.length + 1}`,
      name: newBranch.name,
      location: newBranch.location,
      head: newBranch.head || 'Unassigned',
      employeeCount: 0,
      status: 'Active'
    };
    setBranchesList([...branchesList, created]);
    toast.success(`Branch ${newBranch.name} created!`);
    setIsAddBranchOpen(false);
    setNewBranch({ name: '', location: '', head: '' });
  };

  const handleAddDept = (e) => {
    e.preventDefault();
    const created = {
      id: `DEP-0${deptsList.length + 1}`,
      name: newDept.name,
      head: newDept.head || 'Unassigned',
      description: newDept.description,
      employeeCount: 0,
      status: 'Active'
    };
    setDeptsList([...deptsList, created]);
    toast.success(`Department ${newDept.name} added!`);
    setIsAddDeptOpen(false);
    setNewDept({ name: '', head: '', description: '' });
  };

  const handleAddDesig = (e) => {
    e.preventDefault();
    const created = {
      id: `DES-0${designationsList.length + 1}`,
      name: newDesig.name,
      department: newDesig.department,
      level: newDesig.level,
      employeeCount: 0
    };
    setDesignationsList([...designationsList, created]);
    toast.success(`Designation ${newDesig.name} created!`);
    setIsAddDesigOpen(false);
    setNewDesig({ name: '', department: 'Engineering', level: 'L4' });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      {/* Header */}
      <PageHeader
        title="Organization Management"
        subtitle="Manage company information, branches, departments, and job titles."
        breadcrumbs={['Organization', activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]}
        actions={
          activeTab === 'branches' ? (
            <Button onClick={() => setIsAddBranchOpen(true)} variant="primary" icon={Plus}>
              Add Branch
            </Button>
          ) : activeTab === 'departments' ? (
            <Button onClick={() => setIsAddDeptOpen(true)} variant="primary" icon={Plus}>
              Add Department
            </Button>
          ) : activeTab === 'designations' ? (
            <Button onClick={() => setIsAddDesigOpen(true)} variant="primary" icon={Plus}>
              Add Designation
            </Button>
          ) : null
        }
      />

      {/* Tabs */}
      <Tabs tabs={orgTabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* SEARCH BAR FOR LIST TABS */}
      {activeTab !== 'profile' && (
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

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card className="space-y-6 bg-white border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              <img src={profile.logo} alt="Company Logo" className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-xs" />
              <div>
                <h3 className="text-xl font-bold text-[#2c2738]">{profile.name}</h3>
                <p className="text-xs text-slate-500">Tax Registration ID: {profile.taxId}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#f0edf7] text-[#534675] text-xs rounded-lg font-bold border border-[#dcd6e8]">
                    {profile.fiscalYear} Fiscal
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-semibold border border-slate-200">
                    {profile.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Organization Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                icon={Building}
              />
              <Input
                label="Tax Registration ID"
                value={profile.taxId}
                onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
              />
              <Input
                label="Primary HR Email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                icon={Mail}
              />
              <Input
                label="Phone Contact"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                icon={Phone}
              />
              <Input
                label="Official Website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                icon={Globe}
              />
              <Select
                label="Default Currency"
                value={profile.currency}
                onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                options={[
                  { label: 'USD ($)', value: 'USD ($)' },
                  { label: 'EUR (€)', value: 'EUR (€)' },
                  { label: 'GBP (£)', value: 'GBP (£)' },
                  { label: 'INR (₹)', value: 'INR (₹)' }
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Headquarters Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows={3}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="submit" variant="primary" icon={Save}>
                Save Profile Changes
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 2: BRANCHES */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {branchesList
            .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.location.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((b) => (
              <Card key={b.id} className="space-y-4 bg-white border border-slate-200 shadow-xs hover:border-[#534675]/40 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#f0edf7] text-[#534675] rounded-xl border border-[#dcd6e8]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#2c2738]">{b.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{b.location}</p>
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Branch Head</p>
                    <p className="font-bold text-[#2c2738] truncate">{b.head}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Workforce</p>
                    <p className="font-bold text-[#534675]">{b.employeeCount} Employees</p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* TAB 3: DEPARTMENTS */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deptsList
            .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.description.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((d) => (
              <Card key={d.id} className="space-y-4 bg-white border border-slate-200 shadow-xs hover:border-[#534675]/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-[#f0edf7] text-[#534675] rounded-xl border border-[#dcd6e8]">
                        <Building className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-[#2c2738]">{d.name}</h4>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{d.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Head: <strong className="text-[#2c2738]">{d.head}</strong></span>
                  <span className="px-2.5 py-1 bg-[#f0edf7] text-[#534675] font-bold rounded-lg border border-[#dcd6e8] text-[11px]">
                    {d.employeeCount} Members
                  </span>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* TAB 4: DESIGNATIONS */}
      {activeTab === 'designations' && (
        <Card className="bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2c2738]">
              <thead className="bg-slate-50 uppercase font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">DESIGNATION TITLE</th>
                  <th className="px-4 py-3">DEPARTMENT</th>
                  <th className="px-4 py-3">PAY BAND / LEVEL</th>
                  <th className="px-4 py-3">ACTIVE EMPLOYEES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {designationsList
                  .filter(des => des.name.toLowerCase().includes(searchQuery.toLowerCase()) || des.department.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((des) => (
                    <tr key={des.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-slate-400">{des.id}</td>
                      <td className="px-4 py-3.5 font-bold text-[#2c2738]">{des.name}</td>
                      <td className="px-4 py-3.5 font-medium text-[#534675]">{des.department}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 bg-[#f0edf7] text-[#534675] font-bold rounded-md border border-[#dcd6e8] text-[11px]">
                          {des.level}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-700">{des.employeeCount} Members</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL 1: ADD BRANCH */}
      <Modal
        isOpen={isAddBranchOpen}
        onClose={() => setIsAddBranchOpen(false)}
        title="Add New Branch Office"
        subtitle="Expand organizational office footprints across geographic regions."
        footer={
          <>
            <Button onClick={() => setIsAddBranchOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleAddBranch} variant="primary">Create Branch</Button>
          </>
        }
      >
        <form onSubmit={handleAddBranch} className="space-y-4">
          <Input
            label="Branch Name"
            value={newBranch.name}
            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
            placeholder="e.g. Austin Tech Center"
            required
          />
          <Input
            label="Location / City"
            value={newBranch.location}
            onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
            placeholder="e.g. Austin, Texas, USA"
            required
          />
          <Input
            label="Branch Head / Manager"
            value={newBranch.head}
            onChange={(e) => setNewBranch({ ...newBranch, head: e.target.value })}
            placeholder="e.g. Alex Vance"
          />
        </form>
      </Modal>

      {/* MODAL 2: ADD DEPARTMENT */}
      <Modal
        isOpen={isAddDeptOpen}
        onClose={() => setIsAddDeptOpen(false)}
        title="Create Department"
        subtitle="Establish a new business unit and leadership manager."
        footer={
          <>
            <Button onClick={() => setIsAddDeptOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleAddDept} variant="primary">Create Department</Button>
          </>
        }
      >
        <form onSubmit={handleAddDept} className="space-y-4">
          <Input
            label="Department Name"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            placeholder="e.g. Cyber Security & DevOps"
            required
          />
          <Input
            label="Department Head"
            value={newDept.head}
            onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
            placeholder="e.g. Sarah Jenkins"
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Description</label>
            <textarea
              value={newDept.description}
              onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              placeholder="Responsibilities of this department..."
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 3: ADD DESIGNATION */}
      <Modal
        isOpen={isAddDesigOpen}
        onClose={() => setIsAddDesigOpen(false)}
        title="Add Designation Role"
        subtitle="Define new job roles, pay band level, and department assignment."
        footer={
          <>
            <Button onClick={() => setIsAddDesigOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleAddDesig} variant="primary">Create Designation</Button>
          </>
        }
      >
        <form onSubmit={handleAddDesig} className="space-y-4">
          <Input
            label="Designation Title"
            value={newDesig.name}
            onChange={(e) => setNewDesig({ ...newDesig, name: e.target.value })}
            placeholder="e.g. Lead Machine Learning Engineer"
            required
          />
          <Select
            label="Department"
            value={newDesig.department}
            onChange={(e) => setNewDesig({ ...newDesig, department: e.target.value })}
            options={[
              { label: 'Engineering', value: 'Engineering' },
              { label: 'Human Resources', value: 'Human Resources' },
              { label: 'Product & Design', value: 'Product & Design' },
              { label: 'Sales & Marketing', value: 'Sales & Marketing' }
            ]}
          />
          <Select
            label="Pay Band / Level"
            value={newDesig.level}
            onChange={(e) => setNewDesig({ ...newDesig, level: e.target.value })}
            options={[
              { label: 'L1 - Entry Level', value: 'L1' },
              { label: 'L2 - Junior', value: 'L2' },
              { label: 'L3 - Mid Level', value: 'L3' },
              { label: 'L4 - Senior', value: 'L4' },
              { label: 'L5 - Staff / Lead', value: 'L5' },
              { label: 'L6 - Principal', value: 'L6' },
              { label: 'L7 - Executive / VP', value: 'L7' }
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};
