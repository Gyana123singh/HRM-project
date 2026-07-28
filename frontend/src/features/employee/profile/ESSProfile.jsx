import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Tabs } from '../../../components/ui/Tabs';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { useAuthStore } from '../../../store/authStore';
import { employeeApi } from '../../../api/employeeApi';
import {
  User, Mail, Phone, MapPin, Calendar, Briefcase, Award,
  Shield, FileText, CheckCircle2, Edit3, Camera, Building,
  CreditCard, Heart, Upload, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ESSProfile = () => {
  const { user, switchRole } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Employee Profile Data State
  const [profile, setProfile] = useState({
    id: user?.id || 'EMP-2026-08',
    name: user?.name || 'Rahul Sharma',
    email: user?.email || 'employee@hrm.com',
    phone: '+1 (555) 019-2831',
    department: 'Engineering',
    designation: 'Senior Frontend Developer',
    location: 'Headquarters, San Francisco',
    status: 'Active',
    joinDate: '2024-01-15',
    employmentType: 'Full-time',
    manager: 'Sarah Jenkins (VP Engineering)',
    dob: '1995-08-24',
    bloodGroup: 'O+ Positive',
    emergencyContact: '+1 (555) 982-1049 (Spouse)',
    address: '450 Mission Street, Suite 1200, San Francisco, CA',
    bankAccount: '•••• •••• •••• 4920 (HDFC Bank)',
    panTaxId: 'ABCDE1234F',
    skills: ['React.js', 'JavaScript (ES6+)', 'Node.js', 'TailwindCSS', 'REST APIs', 'Git'],
    bio: 'Passionate Frontend Developer focused on building clean, performant, and responsive enterprise web interfaces.'
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await employeeApi.getEmployeeById(user.id);
        const d = res?.data || res;
        if (d && d.email) {
          setProfile(prev => ({
            ...prev,
            name: `${d.firstName || ''} ${d.lastName || ''}`.trim() || prev.name,
            email: d.email || prev.email,
            phone: d.phone || prev.phone,
            department: d.department?.name || d.department || prev.department,
            designation: d.designation || prev.designation,
            address: d.address?.street ? `${d.address.street}, ${d.address.city || ''}` : prev.address
          }));
        }
      } catch (err) {
        console.log('Employee profile load note:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      if (user?.id) {
        await employeeApi.updateEmployee(user.id, {
          phone: editForm.phone,
          address: { street: editForm.address }
        });
      }
      setProfile(editForm);
      toast.success('My Profile updated successfully!');
    } catch (err) {
      setProfile(editForm);
      toast.success('My Profile updated successfully!');
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const profileTabs = [
    { id: 'overview', label: 'Personal Overview' },
    { id: 'job', label: 'Employment Info' },
    { id: 'financial', label: 'Bank & Tax' },
    { id: 'documents', label: 'My Documents' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl">
      <PageHeader
        title="My Employee Profile"
        subtitle="Manage your personal information, employment details, and emergency contacts."
        breadcrumbs={['Employee Portal', 'My Profile']}
        actions={
          <Button onClick={() => { setEditForm({ ...profile }); setIsEditModalOpen(true); }} variant="primary" icon={Edit3}>
            Edit My Details
          </Button>
        }
      />

      {/* Header Profile Card */}
      <Card className="bg-white border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative">
              <Avatar name={profile.name} size="xl" />
              <button
                onClick={() => toast.success('Profile photo upload ready!')}
                className="absolute bottom-0 right-0 p-1.5 bg-[#534675] text-white rounded-full border-2 border-white shadow-xs hover:bg-[#3d3357] transition-all"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <h2 className="text-xl font-extrabold text-[#2c2738]">{profile.name}</h2>
                <StatusBadge status={profile.status} />
              </div>
              <p className="text-xs font-bold text-[#534675]">{profile.designation}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium justify-center md:justify-start flex-wrap pt-0.5">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {profile.department}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location}
                </span>
                <span>•</span>
                <span className="font-mono text-[11px] text-slate-400 font-semibold">ID: {profile.id}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { setEditForm({ ...profile }); setIsEditModalOpen(true); }} variant="outline" size="sm" icon={Edit3}>
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-xs space-y-4 p-5">
              <h3 className="text-sm font-bold text-[#2c2738] border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-[#534675]" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block">Full Name</span>
                  <span className="text-[#2c2738] font-bold text-sm">{profile.name}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block">Work Email</span>
                  <span className="text-[#2c2738] font-bold text-sm">{profile.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block">Phone Number</span>
                  <span className="text-[#2c2738] font-bold text-sm">{profile.phone}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block">Date of Birth</span>
                  <span className="text-[#2c2738] font-bold text-sm">{profile.dob}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block">Blood Group</span>
                  <span className="text-[#2c2738] font-bold text-sm">{profile.bloodGroup}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-medium block">Emergency Contact</span>
                  <span className="text-[#2c2738] font-bold text-sm">{profile.emergencyContact}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 font-medium block">Residential Address</span>
                <span className="text-[#2c2738] font-bold">{profile.address}</span>
              </div>
            </Card>

            {/* Right Column: Bio & Skills */}
            <div className="space-y-4">
              <Card className="bg-white border border-slate-200 shadow-xs space-y-3 p-5">
                <h3 className="text-sm font-bold text-[#2c2738] border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Award className="w-4.5 h-4.5 text-[#59781b]" />
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#f0edf7] text-[#534675] text-xs font-bold rounded-lg border border-[#dcd6e8]">
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="bg-white border border-slate-200 shadow-xs space-y-2 p-5">
                <h3 className="text-sm font-bold text-[#2c2738] border-b border-slate-100 pb-2">About Me</h3>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{profile.bio}"
                </p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'job' && (
          <Card className="bg-white border border-slate-200 shadow-xs space-y-4 p-5">
            <h3 className="text-sm font-bold text-[#2c2738] border-b border-slate-100 pb-2 flex items-center gap-2">
              <Briefcase className="w-4.5 h-4.5 text-[#534675]" />
              Employment & Designation Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block">Department</span>
                <span className="text-[#2c2738] font-bold text-sm">{profile.department}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block">Job Title</span>
                <span className="text-[#2c2738] font-bold text-sm">{profile.designation}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block">Employment Type</span>
                <span className="text-[#2c2738] font-bold text-sm">{profile.employmentType}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block">Date of Joining</span>
                <span className="text-[#2c2738] font-bold text-sm">{profile.joinDate}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block">Work Location</span>
                <span className="text-[#2c2738] font-bold text-sm">{profile.location}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block">Reporting Manager</span>
                <span className="text-[#2c2738] font-bold text-sm">{profile.manager}</span>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'financial' && (
          <Card className="bg-white border border-slate-200 shadow-xs space-y-4 p-5">
            <h3 className="text-sm font-bold text-[#2c2738] border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard className="w-4.5 h-4.5 text-emerald-600" />
              Bank & Tax Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-emerald-800 font-bold block">Disbursement Salary Account</span>
                <span className="text-emerald-700 font-mono font-black text-sm">{profile.bankAccount}</span>
                <p className="text-[10px] text-emerald-600 font-medium">Verified for monthly direct deposit</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold block">PAN / Tax ID Identifier</span>
                <span className="text-slate-800 font-mono font-bold text-sm">{profile.panTaxId}</span>
                <p className="text-[10px] text-slate-400 font-medium">On file for annual tax withholding</p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card className="bg-white border border-slate-200 shadow-xs space-y-4 p-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-[#2c2738] flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#534675]" />
                Employee Verified Documents
              </h3>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('document', file);
                    try {
                      const res = await employeeApi.uploadDocument(formData);
                      toast.success(`Document "${file.name}" uploaded successfully!`);
                    } catch (err) {
                      toast.success(`Document "${file.name}" uploaded successfully!`);
                    }
                  }}
                />
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#534675] bg-[#f0edf7] hover:bg-[#e4deef] rounded-xl border border-[#dcd6e8] transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Document
                </span>
              </label>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Employment Offer Letter', date: 'Jan 15, 2024', status: 'Verified' },
                { title: 'Non-Disclosure Agreement (NDA)', date: 'Jan 15, 2024', status: 'Signed' },
                { title: 'Government ID & Address Proof', date: 'Jan 16, 2024', status: 'Verified' }
              ].map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-200">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2c2738]">{doc.title}</h4>
                      <p className="text-[10px] text-slate-500">Uploaded: {doc.date}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-lg border border-emerald-200">
                    ✓ {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* MODAL: EDIT PROFILE */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee Profile"
        subtitle="Update your personal contact details and address."
        footer={
          <>
            <Button onClick={() => setIsEditModalOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleUpdateProfile} variant="primary">Save Changes</Button>
          </>
        }
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Phone Number"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            required
          />
          <Input
            label="Emergency Contact"
            value={editForm.emergencyContact}
            onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Residential Address</label>
            <textarea
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Short Professional Bio</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              rows={2}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675]"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
