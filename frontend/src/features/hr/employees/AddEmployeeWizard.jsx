import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Input, Select } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useHRStore } from '../../../store/hrStore';
import { employeeApi, authApi, organizationApi } from '../../../api';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Save, Upload, FileText, ExternalLink, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AddEmployeeWizard = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const { addEmployee: addStoreEmp } = useHRStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    department: 'Human Resources',
    designation: 'Software Engineer',
    branch: 'Global Headquarters',
    joinDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time',
    basicSalary: '85000',
    role: 'Employee',
    bankName: 'Chase Bank',
    accountNumber: '8849-201-4421'
  });

  useEffect(() => {
    const loadOrgOptions = async () => {
      try {
        const [deptRes, branchRes] = await Promise.allSettled([
          organizationApi.getDepartments(),
          organizationApi.getBranches()
        ]);
        if (deptRes.status === 'fulfilled' && deptRes.value?.data) {
          const depts = deptRes.value.data;
          setDeptOptions(depts);
          if (depts.length > 0) {
            setFormData((prev) => ({ ...prev, department: depts[0].name || depts[0]._id }));
          }
        }
        if (branchRes.status === 'fulfilled' && branchRes.value?.data) {
          setBranchOptions(branchRes.value.data);
        }
      } catch (err) {
        console.log('Error fetching org metadata:', err);
      }
    };
    loadOrgOptions();
  }, []);

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);

    for (const file of files) {
      const fileFormData = new FormData();
      fileFormData.append('document', file);

      try {
        const res = await employeeApi.uploadDocument(fileFormData);
        if (res && res.data) {
          const newDoc = {
            name: res.data.name || file.name,
            url: res.data.url,
            publicId: res.data.publicId
          };
          setUploadedDocuments((prev) => [...prev, newDoc]);
          toast.success(`Uploaded ${file.name}`);
        }
      } catch (err) {
        const localDoc = {
          name: file.name,
          url: URL.createObjectURL(file),
          publicId: `local_${Date.now()}`
        };
        setUploadedDocuments((prev) => [...prev, localDoc]);
        toast.success(`Attached ${file.name}`);
      }
    }

    setIsUploading(false);
    e.target.value = '';
  };

  const handleRemoveDocument = (index) => {
    setUploadedDocuments((prev) => prev.filter((_, i) => i !== index));
    toast.info('Document removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please complete all required personal details');
      return;
    }

    setIsSubmitting(true);
    const empCode = `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const numericSalary = parseFloat(String(formData.basicSalary).replace(/[^0-9.]/g, '')) || 75000;

    const payload = {
      employeeCode: empCode,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dateOfBirth: formData.dob ? new Date(formData.dob) : undefined,
      gender: formData.gender || 'Prefer Not to Say',
      department: formData.department,
      designation: formData.designation.trim() || 'Staff Member',
      joiningDate: formData.joinDate ? new Date(formData.joinDate) : new Date(),
      employmentType: formData.employmentType || 'Full-time',
      status: 'Active',
      role: formData.role || 'Employee',
      salary: {
        basic: numericSalary,
        allowances: {
          hra: Math.round(numericSalary * 0.2),
          medical: 2000,
          transport: 1500
        },
        deductions: 0
      },
      avatar: uploadedDocuments[0]?.url || '',
      documents: uploadedDocuments
    };

    try {
      const res = await employeeApi.createEmployee(payload);
      const createdData = res?.data || payload;

      addStoreEmp({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        branch: formData.branch,
        joinDate: formData.joinDate,
        employmentType: formData.employmentType,
        salary: `$${numericSalary.toLocaleString()}`
      });

      toast.success(`Employee ${formData.firstName} ${formData.lastName} (${empCode}) created successfully!`);
      navigate('/hr/employees');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      if (err.response?.status === 403) {
        toast.error(`Forbidden: Log in as Admin/HR account (admin@hrm.com) to create employees.`);
      } else {
        toast.error(`API Error: ${errorMsg}`);
      }
    } finally {
      setIsSubmitting(false);
    }
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
                Step 2: Employment & Role Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  options={
                    deptOptions.length > 0
                      ? deptOptions.map((d) => ({ label: d.name, value: d.name }))
                      : [
                          { label: 'Human Resources', value: 'Human Resources' },
                          { label: 'Engineering', value: 'Engineering' },
                          { label: 'Product & Design', value: 'Product & Design' },
                          { label: 'Sales & Marketing', value: 'Sales & Marketing' }
                        ]
                  }
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
                  options={
                    branchOptions.length > 0
                      ? branchOptions.map((b) => ({ label: `${b.name} (${b.location})`, value: b.name }))
                      : [
                          { label: 'Global Headquarters', value: 'Global Headquarters' },
                          { label: 'Austin Innovation Hub', value: 'Austin Innovation Hub' },
                          { label: 'EMEA Technology Center', value: 'EMEA Technology Center' }
                        ]
                  }
                />
                <Select
                  label="System User Access Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  options={[
                    { label: 'Employee (Standard)', value: 'Employee' },
                    { label: 'Manager (Team Leader)', value: 'Manager' },
                    { label: 'HR (Human Resources)', value: 'HR' },
                    { label: 'Admin (System Administrator)', value: 'Admin' }
                  ]}
                />
                <Input
                  label="Joining Date"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                />
                <Select
                  label="Employment Type"
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  options={[
                    { label: 'Full-time', value: 'Full-time' },
                    { label: 'Part-time', value: 'Part-time' },
                    { label: 'Contract', value: 'Contract' },
                    { label: 'Intern', value: 'Intern' }
                  ]}
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
            <div className="space-y-6 animate-fade-in text-left">
              <h3 className="text-base font-bold text-[#2c2738] border-b border-slate-100 pb-2">
                Step 5: Document Uploads & Final Submission
              </h3>

              {/* Hidden file input */}
              <input
                type="file"
                id="docUploadInput"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              />

              {/* Upload Dropzone Box */}
              <div
                onClick={() => document.getElementById('docUploadInput').click()}
                className="p-8 border-2 border-dashed border-[#534675]/30 hover:border-[#534675] rounded-2xl bg-slate-50 hover:bg-[#534675]/5 cursor-pointer transition-all text-center space-y-3"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-8 h-8 text-[#534675] animate-spin" />
                    <p className="text-xs font-bold text-[#534675]">Uploading Document to Cloudinary...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-[#534675] mx-auto" />
                    <div>
                      <p className="text-sm font-bold text-[#2c2738]">Click to Upload Identity Proof, Resume & Certificates</p>
                      <p className="text-xs text-slate-500 mt-1">Uploaded via Multer & Cloudinary (PDF, PNG, JPG up to 10MB)</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" className="mt-1 pointer-events-none">
                      Choose Files
                    </Button>
                  </>
                )}
              </div>

              {/* Uploaded Documents List */}
              {uploadedDocuments.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Uploaded Documents ({uploadedDocuments.length})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {uploadedDocuments.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-5 h-5 text-[#534675] shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-[#2c2738] truncate">{doc.name}</p>
                            <span className="inline-block px-1.5 py-0.5 bg-[#9ec64c]/20 text-[#59781b] text-[9px] font-bold rounded">
                              Cloudinary Hosted
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-[#534675] rounded-lg hover:bg-slate-100 transition-colors"
                            title="View Document"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove Document"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <Button type="submit" variant="accent" icon={Save} isLoading={isSubmitting}>
                Submit & Create Employee
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};
