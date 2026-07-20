import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Tabs } from '../../../components/ui/Tabs';
import { Button } from '../../../components/ui/Button';
import { employeesList } from '../../../data/mockData';
import { Mail, Phone, MapPin, Calendar, Briefcase, Award, Shield, FileText, CheckCircle } from 'lucide-react';

export const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const employee = employeesList.find((e) => e.id === id) || employeesList[0];
  const [activeTab, setActiveTab] = useState('overview');

  const profileTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'job', label: 'Job Details' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leave', label: 'Leave History' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'documents', label: 'Documents' },
    { id: 'performance', label: 'Performance' },
    { id: 'goals', label: 'Goals & OKRs' },
    { id: 'assets', label: 'Assigned Assets' },
    { id: 'training', label: 'Training' },
    { id: 'timeline', label: 'Career Timeline' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`${employee.name} Profile`}
        subtitle={`ID: ${employee.id} • ${employee.designation}`}
        breadcrumbs={['Employees', 'Profile', employee.id]}
      />

      {/* Profile Header Card */}
      <Card className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <Avatar src={employee.avatar} name={employee.name} size="xl" />
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h2 className="text-xl font-extrabold text-[#2c2738]">{employee.name}</h2>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-xs font-bold text-[#534675]">{employee.designation}</p>
            <p className="text-xs text-slate-500">{employee.department} • {employee.branch}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm">Edit Profile</Button>
          <Button variant="outline" size="sm">Message</Button>
          <Button variant="ghost" size="sm">Actions ▾</Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content Panels */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <Card className="space-y-3 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-[#2c2738] border-b border-slate-100 pb-2">Contact Details</h3>
              <div className="space-y-2 text-xs text-slate-700">
                <p><span className="text-slate-500 font-medium">Work Email:</span> {employee.email}</p>
                <p><span className="text-slate-500 font-medium">Phone:</span> {employee.phone}</p>
                <p><span className="text-slate-500 font-medium">Location:</span> {employee.branch}</p>
                <p><span className="text-slate-500 font-medium">Reporting Manager:</span> {employee.manager}</p>
              </div>
            </Card>

            <Card className="space-y-3 bg-white border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-[#2c2738] border-b border-slate-100 pb-2">Performance & Compensation</h3>
              <div className="space-y-2 text-xs text-slate-700">
                <p><span className="text-slate-500 font-medium">Annual Package:</span> {employee.salary}</p>
                <p><span className="text-slate-500 font-medium">Performance Rating:</span> {employee.performanceRating}</p>
                <p><span className="text-slate-500 font-medium">Employment Type:</span> {employee.employmentType}</p>
                <p><span className="text-slate-500 font-medium">Joining Date:</span> {employee.joinDate}</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'timeline' && (
          <Card className="space-y-6 animate-fade-in bg-white border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-[#2c2738]">Employee Lifecycle Timeline</h3>
            <div className="relative pl-6 border-l-2 border-[#534675]/40 space-y-6">
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#9ec64c] border-2 border-white" />
                <h4 className="text-sm font-bold text-[#2c2738]">Joined Organization</h4>
                <p className="text-xs text-slate-500">{employee.joinDate} • Onboarded as {employee.designation}</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#534675] border-2 border-white" />
                <h4 className="text-sm font-bold text-[#2c2738]">Probation Completion</h4>
                <p className="text-xs text-slate-500">Successfully confirmed with rating 4.8/5</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#e95f87] border-2 border-white" />
                <h4 className="text-sm font-bold text-[#2c2738]">Salary & Designation Revision</h4>
                <p className="text-xs text-slate-500">Promoted to Senior level with +15% compensation bump</p>
              </div>
            </div>
          </Card>
        )}

        {!['overview', 'timeline'].includes(activeTab) && (
          <Card className="p-8 text-center text-slate-500 animate-fade-in bg-white border border-slate-200 shadow-sm">
            <p className="text-sm font-bold text-[#2c2738] uppercase tracking-wider mb-1">{activeTab} Records</p>
            <p className="text-xs">Displaying verified operational records for employee ID {employee.id}.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
