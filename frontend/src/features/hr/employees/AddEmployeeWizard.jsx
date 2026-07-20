import React, { useState } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Input, Select } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useHRStore } from '../../../store/hrStore';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export const AddEmployeeWizard = () => {
  const [step, setStep] = useState(1);
  const { addEmployee } = useHRStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    department: 'Engineering',
    designation: 'Frontend Developer',
    branch: 'Headquarters',
    joinDate: '2026-08-01',
    employmentType: 'Full-Time',
    basicSalary: '$95,000',
    bankName: 'Chase Bank',
    accountNumber: '8849-201-4421'
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = addEmployee({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      branch: formData.branch,
      joinDate: formData.joinDate,
      employmentType: formData.employmentType,
      salary: formData.basicSalary
    });
    toast.success(`Employee ${created.name} (${created.id}) created successfully!`);
    navigate('/hr/employees');
  };

  const steps = [
    { num: 1, title: 'Personal Details' },
    { num: 2, title: 'Employment Info' },
    { num: 3, title: 'Education & Exp' },
    { num: 4, title: 'Bank & Salary' },
    { num: 5, title: 'Documents' }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <PageHeader
        title="Add New Employee"
        subtitle="Complete multi-step onboarding wizard for new organizational joiners."
        breadcrumbs={['Employees', 'Add Employee']}
      />

      {/* Stepper Header */}
      <div className="grid grid-cols-5 gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all ${step === s.num
                ? 'bg-[#534675] text-white shadow-md shadow-[#534675]/20'
                : step > s.num
                  ? 'bg-[#f2f8e8] text-[#59781b] border border-[#9ec64c]/40'
                  : 'text-slate-500'
              }`}
          >
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] shrink-0 border border-slate-200">
              {step > s.num ? <Check className="w-3 h-3 text-[#59781b]" /> : s.num}
            </span>
            <span className="hidden sm:inline truncate">{s.title}</span>
          </div>
        ))}
      </div>

      <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-[#2c2738] border-b border-slate-100 pb-2">
                Step 1: Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
                <Input
                  label="Personal Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone Contact"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  options={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Other', value: 'Other' }
                  ]}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-[#2c2738] border-b border-slate-100 pb-2">
                Step 2: Employment Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  options={[
                    { label: 'Engineering', value: 'Engineering' },
                    { label: 'Human Resources', value: 'Human Resources' },
                    { label: 'Product & Design', value: 'Product & Design' },
                    { label: 'Sales & Marketing', value: 'Sales & Marketing' }
                  ]}
                />
                <Input
                  label="Designation Title"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
                <Select
                  label="Branch Office"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  options={[
                    { label: 'Headquarters (New York)', value: 'Headquarters' },
                    { label: 'Silicon Valley Hub', value: 'Silicon Valley Hub' },
                    { label: 'European Ops (London)', value: 'European Ops' }
                  ]}
                />
                <Input
                  label="Joining Date"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-[#2c2738] border-b border-slate-100 pb-2">
                Step 3: Education & Past Experience
              </h3>
              <Input label="Highest Degree / Education" placeholder="M.S. Computer Science - NYU" />
              <Input label="Previous Employer" placeholder="Acme Technologies Inc." />
              <Input label="Years of Experience" placeholder="5 Years" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-[#2c2738] border-b border-slate-100 pb-2">
                Step 4: Bank & Salary Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Annual Salary ($)"
                  value={formData.basicSalary}
                  onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                />
                <Input
                  label="Bank Name"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
                <Input
                  label="Account Number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
                <Input label="Routing / IFSC Code" placeholder="CHAS000981" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-fade-in text-center">
              <h3 className="text-base font-bold text-[#2c2738] border-b border-slate-100 pb-2 text-left">
                Step 5: Document Uploads & Final Submission
              </h3>
              <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 space-y-3">
                <Upload className="w-10 h-10 text-[#534675] mx-auto" />
                <p className="text-sm font-bold text-[#2c2738]">Drag & Drop Identity Proof, Resume & Certificates</p>
                <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB each</p>
                <Button variant="outline" size="sm">Choose Files</Button>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <Button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              variant="outline"
              icon={ArrowLeft}
            >
              Previous
            </Button>

            {step < 5 ? (
              <Button type="button" onClick={handleNext} variant="primary" icon={ArrowRight}>
                Next Step
              </Button>
            ) : (
              <Button type="submit" variant="accent" icon={Save}>
                Submit & Create Employee
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
