import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card } from '../../../components/ui/Card';
import { Input, Select } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useHRStore } from '../../../store/hrStore';
import { employeeApi, authApi, organizationApi } from '../../../api';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const AddEmployeeWizard = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deptOptions, setDeptOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const { addEmployee: addStoreEmp } = useHRStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeCode: '',
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
    monthlySalary: '7,083.33',
    basicSalary: '85,000.00',
    role: 'Employee',
    bankName: 'Chase Bank',
    accountNumber: '8849-201-4421',
    ifscCode: 'CHAS000981',
    education: '',
    previousEmployer: '',
    experienceYears: ''
  });

  const handleMonthlySalaryChange = (val) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if (cleanVal === '') {
      setFormData((prev) => ({ ...prev, monthlySalary: '', basicSalary: '' }));
      return;
    }

    const parts = cleanVal.split('.');
    const integerPart = parts[0] ? parseFloat(parts[0]).toLocaleString('en-US') : '';
    const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';
    const formattedMonthlyInput = integerPart ? `${integerPart}${decimalPart}` : val;

    const num = parseFloat(cleanVal);
    if (!isNaN(num)) {
      const annual = num * 12;
      const formattedAnnual = annual.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setFormData((prev) => ({
        ...prev,
        monthlySalary: formattedMonthlyInput,
        basicSalary: formattedAnnual
      }));
    } else {
      setFormData((prev) => ({ ...prev, monthlySalary: val }));
    }
  };

  const handleAnnualSalaryChange = (val) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if (cleanVal === '') {
      setFormData((prev) => ({ ...prev, basicSalary: '', monthlySalary: '' }));
      return;
    }

    const parts = cleanVal.split('.');
    const integerPart = parts[0] ? parseFloat(parts[0]).toLocaleString('en-US') : '';
    const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';
    const formattedAnnualInput = integerPart ? `${integerPart}${decimalPart}` : val;

    const num = parseFloat(cleanVal);
    if (!isNaN(num)) {
      const monthly = num / 12;
      const formattedMonthly = monthly.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setFormData((prev) => ({
        ...prev,
        basicSalary: formattedAnnualInput,
        monthlySalary: formattedMonthly
      }));
    } else {
      setFormData((prev) => ({ ...prev, basicSalary: val }));
    }
  };

  const handleMonthlyBlur = () => {
    if (formData.monthlySalary) {
      const clean = String(formData.monthlySalary).replace(/[^0-9.]/g, '');
      const num = parseFloat(clean);
      if (!isNaN(num)) {
        setFormData((prev) => ({
          ...prev,
          monthlySalary: num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        }));
      }
    }
  };

  const handleAnnualBlur = () => {
    if (formData.basicSalary) {
      const clean = String(formData.basicSalary).replace(/[^0-9.]/g, '');
      const num = parseFloat(clean);
      if (!isNaN(num)) {
        setFormData((prev) => ({
          ...prev,
          basicSalary: num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        }));
      }
    }
  };

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

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    if (step !== 4) return;

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please complete all required personal details');
      return;
    }

    setIsSubmitting(true);
    const userDefinedCode = formData.employeeCode?.trim();
    const empCode = userDefinedCode || `EMP-${Math.floor(100 + Math.random() * 900)}`;
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
      bankName: formData.bankName ? formData.bankName.trim() : 'Union Bank of India',
      accountNumber: formData.accountNumber ? formData.accountNumber.trim() : '88492014421',
      salary: {
        basic: numericSalary,
        monthlySalary: formData.monthlySalary,
        basicSalary: formData.basicSalary,
        monthlyBand: formData.monthlySalary ? `₹${formData.monthlySalary} / Month` : `₹${Math.round(numericSalary / 12).toLocaleString('en-IN')} / Month`,
        annualBand: formData.basicSalary ? `₹${formData.basicSalary} / Annum` : `₹${numericSalary.toLocaleString('en-IN')} / Annum`,
        allowances: {
          hra: Math.round(numericSalary * 0.2),
          medical: 2000,
          transport: 1500
        },
        deductions: 0
      }
    };

    try {
      const res = await employeeApi.createEmployee(payload);
      const createdData = res?.data || payload;

      const salaryObj = {
        employeeName: `${formData.firstName} ${formData.lastName}`,
        designation: formData.designation || 'Software Engineer',
        monthlySalary: formData.monthlySalary || `${(numericSalary / 12).toFixed(2)}`,
        basicSalary: formData.basicSalary || `${numericSalary}`,
        monthlyBand: formData.monthlySalary ? `₹${formData.monthlySalary} / Month` : `₹${(numericSalary / 12).toLocaleString('en-IN')} / Month`,
        annualBand: formData.basicSalary ? `₹${formData.basicSalary} / Annum` : `₹${numericSalary.toLocaleString('en-IN')} / Annum`
      };
      localStorage.setItem('latest_employee_salary', JSON.stringify(salaryObj));

      addStoreEmp({
        id: createdData.employeeCode || empCode,
        employeeCode: createdData.employeeCode || empCode,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        branch: formData.branch,
        joinDate: formData.joinDate,
        employmentType: formData.employmentType,
        bankName: formData.bankName || 'Union Bank of India',
        accountNumber: formData.accountNumber || '88492014421',
        monthlySalary: formData.monthlySalary,
        basicSalary: formData.basicSalary,
        monthlyBand: salaryObj.monthlyBand,
        annualBand: salaryObj.annualBand,
        salary: `$${numericSalary.toLocaleString()}`
      });

      toast.success(`Employee ${formData.firstName} ${formData.lastName} (${createdData.employeeCode || empCode}) created successfully!`);
      navigate('/hr/employees');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`Error creating employee: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Personal Details' },
    { num: 2, title: 'Employment Info' },
    { num: 3, title: 'Education & Exp' },
    { num: 4, title: 'Bank & Salary' }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <PageHeader
        title="Add New Employee"
        subtitle="Complete onboarding wizard for new organizational joiners."
        breadcrumbs={['Employees', 'Add Employee']}
      />

      {/* Stepper Header */}
      <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
        {steps.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setStep(s.num);
            }}
            className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${step === s.num
                ? 'bg-[#534675] text-white shadow-md shadow-[#534675]/20'
                : step > s.num
                  ? 'bg-[#f2f8e8] text-[#59781b] border border-[#9ec64c]/40'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
          >
            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] shrink-0 border border-slate-200">
              {step > s.num ? <Check className="w-3 h-3 text-[#59781b]" /> : s.num}
            </span>
            <span className="hidden sm:inline truncate">{s.title}</span>
          </button>
        ))}
      </div>

      <Card className="space-y-6 bg-white border border-slate-200 shadow-sm">
        <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-6">
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
                <Input
                  label="Employee ID / Code"
                  placeholder="e.g. EMP-1025 (Auto-generated if blank)"
                  value={formData.employeeCode}
                  onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                />
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
              <Input
                label="Highest Degree / Education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="M.S. Computer Science - NYU"
              />
              <Input
                label="Previous Employer"
                value={formData.previousEmployer}
                onChange={(e) => setFormData({ ...formData, previousEmployer: e.target.value })}
                placeholder="Acme Technologies Inc."
              />
              <Input
                label="Years of Experience"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                placeholder="5 Years"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-base font-bold text-[#2c2738] border-b border-slate-100 pb-2">
                Step 4: Bank & Salary Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Monthly Salary (₹)"
                  value={formData.monthlySalary}
                  onChange={(e) => handleMonthlySalaryChange(e.target.value)}
                  onBlur={handleMonthlyBlur}
                  placeholder="7,083.33"
                />
                <Input
                  label="Annual Salary (₹)"
                  value={formData.basicSalary}
                  onChange={(e) => handleAnnualSalaryChange(e.target.value)}
                  onBlur={handleAnnualBlur}
                  placeholder="85,000.00"
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
                <Input
                  label="Routing / IFSC Code"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  placeholder="CHAS000981"
                />
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

            {step < 4 ? (
              <Button type="button" onClick={handleNext} variant="primary" icon={ArrowRight}>
                Next Step
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinalSubmit}
                variant="accent"
                icon={Save}
                isLoading={isSubmitting}
              >
                Submit & Create Employee
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

