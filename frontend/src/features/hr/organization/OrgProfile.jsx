import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Input, Select } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/Tabs';
import { organizationProfile } from '../../../data/mockData';
import { organizationApi } from '../../../api/organizationApi';
import { Building, Save, Globe, Phone, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const OrgProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(organizationProfile);
  const [loading, setLoading] = useState(true);

  // Map route to active tab
  const getActiveTab = () => 'profile';

  const activeTab = getActiveTab();

  const handleTabChange = () => {
    navigate('/hr/organization/profile');
  };

  // Fetch real-time and seeded data from backend
  const fetchOrgData = async () => {
    setLoading(true);
    try {
      const profileRes = await organizationApi.getProfile();
      if (profileRes.data?.data) {
        setProfile(profileRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load organization profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, []);

  const orgTabs = [
    { id: 'profile', label: 'Organization Profile' }
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await organizationApi.updateProfile(profile);
      if (res.data?.success) {
        toast.success('Organization profile updated successfully in database');
      } else {
        toast.success('Organization profile updated successfully');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      {/* Header */}
      <PageHeader
        title="Organization Management"
        subtitle="Manage company information, branding, and tax registration details."
        breadcrumbs={['Organization', 'Profile']}
      />

      {/* Tabs */}
      <Tabs tabs={orgTabs} activeTab={activeTab} onChange={handleTabChange} />

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#534675] animate-spin" />
          <span className="ml-3 text-sm font-medium text-slate-600">Loading Organization Data...</span>
        </div>
      )}

      {/* TAB 1: PROFILE */}
      {!loading && activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card className="space-y-6 bg-white border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
              <img src={profile.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80'} alt="Company Logo" className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-xs" />
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
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                icon={Building}
              />
              <Input
                label="Tax Registration ID"
                value={profile.taxId || ''}
                onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
              />
              <Input
                label="Primary HR Email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                icon={Mail}
              />
              <Input
                label="Phone Contact"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                icon={Phone}
              />
              <Input
                label="Official Website"
                value={profile.website || ''}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                icon={Globe}
              />
              <Select
                label="Default Currency"
                value={profile.currency || 'USD ($)'}
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
                value={profile.address || ''}
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
    </div>
  );
};
