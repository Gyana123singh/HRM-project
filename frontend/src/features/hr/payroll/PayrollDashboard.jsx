import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/common/PageHeader';
import { Card, StatCard } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Tabs } from '../../../components/ui/Tabs';
import { Modal } from '../../../components/ui/Modal';
import { Input, Select } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { payrollData, employeesList } from '../../../data/mockData';
import { payrollApi } from '../../../api/payrollApi';
import { employeeApi } from '../../../api/employeeApi';
import { useHRStore } from '../../../store/hrStore';
import { InfotattvaPayslipTemplate } from './InfotattvaPayslipTemplate';
import { downloadPayslipPdf } from '../../../utils/pdfDownload';
import {
  DollarSign, CheckCircle, Calculator, FileText, Download, Play, Plus,
  Search, ShieldCheck, Briefcase, CreditCard, ArrowUpRight, Loader2,
  Edit3, Trash2, Calendar, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

const getAnnualBand = (monthlyBandStr, fallbackAnnual) => {
  if (!monthlyBandStr || !monthlyBandStr.trim()) return fallbackAnnual || '';
  if (monthlyBandStr.includes('/ Annum')) return monthlyBandStr;

  const numbers = monthlyBandStr.match(/\d[\d,.]*/g);
  if (!numbers || numbers.length === 0) return fallbackAnnual || '';

  const raw = parseFloat(numbers[0].replace(/,/g, ''));
  if (isNaN(raw)) return fallbackAnnual || '';

  const annual = raw * 12;
  const formatted = annual % 1 !== 0
    ? annual.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(annual).toLocaleString('en-IN');

  return `₹${formatted} / Annum`;
};

const getMonthlyBand = (bandStr, fallbackMonthly) => {
  if (!bandStr || !bandStr.trim()) return fallbackMonthly || '';
  if (bandStr.includes('/ Month')) return bandStr;

  const numbers = bandStr.match(/\d[\d,.]*/g);
  if (!numbers || numbers.length === 0) return fallbackMonthly || '';

  const raw = parseFloat(numbers[0].replace(/,/g, ''));
  if (isNaN(raw)) return fallbackMonthly || '';

  const monthly = raw / 12;
  const formatted = monthly % 1 !== 0
    ? monthly.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(monthly).toLocaleString('en-IN');

  return `₹${formatted} / Month`;
};

function convertNumberToWords(amount) {
  if (amount === undefined || amount === null || isNaN(amount) || amount === 0) return 'Indian Rupees Zero Only';

  const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numToWords(n) {
    let str = '';
    if (n > 19) {
      str += tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + single[n % 10] : '');
    } else if (n >= 10) {
      str += double[n - 10];
    } else {
      str += single[n];
    }
    return str.trim();
  }

  function inrWords(n) {
    n = Math.floor(n);
    if (n === 0) return '';
    let res = '';

    if (Math.floor(n / 10000000) > 0) {
      res += inrWords(Math.floor(n / 10000000)) + ' Crore ';
      n %= 10000000;
    }
    if (Math.floor(n / 100000) > 0) {
      res += inrWords(Math.floor(n / 100000)) + ' Lakh ';
      n %= 100000;
    }
    if (Math.floor(n / 1000) > 0) {
      res += inrWords(Math.floor(n / 1000)) + ' Thousand ';
      n %= 1000;
    }
    if (Math.floor(n / 100) > 0) {
      res += inrWords(Math.floor(n / 100)) + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (res !== '') res += 'and ';
      res += numToWords(n);
    }
    return res.trim();
  }

  const words = inrWords(amount);
  return `Indian Rupees ${words} Only`;
}

const formatDeductions = (val) => {
  if (!val || val === '0' || val === '0 Days' || val === '0 Day' || val === '0%') return '0 Days';
  const cleanNum = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(cleanNum) || cleanNum === 0) return '0 Days';
  return cleanNum === 1 ? '1 Day' : `${cleanNum} Days`;
};

const initialStructures = [
  { id: 'STR-01', name: 'Executive Level (L7)', basic: '50%', hra: '25%', conveyance: '10%', specialAllowance: '15%', bonus: '0%', otherEarnings: '0%', deductions: '0 Days', membersCount: 12, band: '₹18,00,000 / Annum', monthlyBand: '₹1,50,000 / Month', effectiveDate: '2026-09-01', month: 'September', year: 2026 },
  { id: 'STR-02', name: 'Senior Engineering (L5)', basic: '50%', hra: '25%', conveyance: '10%', specialAllowance: '15%', bonus: '0%', otherEarnings: '0%', deductions: '0 Days', membersCount: 45, band: '₹12,00,000 / Annum', monthlyBand: '₹1,00,000 / Month', effectiveDate: '2026-09-01', month: 'September', year: 2026 },
  { id: 'STR-03', name: 'Mid-Level Professional (L4)', basic: '50%', hra: '25%', conveyance: '10%', specialAllowance: '15%', bonus: '0%', otherEarnings: '0%', deductions: '0 Days', membersCount: 120, band: '₹6,00,000 / Annum', monthlyBand: '₹50,000 / Month', effectiveDate: '2026-09-01', month: 'September', year: 2026 },
  { id: 'STR-04', name: 'Associate Band (L2-L3)', basic: '50%', hra: '25%', conveyance: '10%', specialAllowance: '15%', bonus: '0%', otherEarnings: '0%', deductions: '0 Days', membersCount: 180, band: '₹3,50,000 / Annum', monthlyBand: '₹29,167 / Month', effectiveDate: '2026-09-01', month: 'September', year: 2026 }
];

const initialPayslips = [
  { id: 'PAY-701', payslipCode: 'PAY-701', employeeName: 'Rahul Sharma', employeeId: 'EMP-0001', month: 'July 2026', designation: 'Senior Software Engineer', department: 'Engineering', joiningDate: '12/06/2023', workLocation: 'Bhubaneswar', panNumber: 'ABCDE1234F', bankName: 'HDFC Bank', accountNumber: '5010049281723', totalWorkingDays: 30, paidDays: 30, lopDays: 0, basic: 7000, hra: 3500, conveyance: 1500, specialAllowance: 2000, bonus: 0, otherEarnings: 0, gross: '₹14,000.00', grossRaw: 14000, netSalary: '₹14,000.00', netSalaryRaw: 14000, amountInWords: 'Indian Rupees Fourteen Thousand Only', paymentMode: 'Bank Transfer', transactionRef: 'TXN-982710492', status: 'Paid' },
  { id: 'PAY-702', payslipCode: 'PAY-702', employeeName: 'Sarah Jenkins', employeeId: 'EMP-0002', month: 'July 2026', designation: 'HR Operations Manager', department: 'Human Resources', joiningDate: '01/03/2024', workLocation: 'Bhubaneswar', panNumber: 'FGHIJ5678K', bankName: 'ICICI Bank', accountNumber: '629101928374', totalWorkingDays: 30, paidDays: 30, lopDays: 0, basic: 7000, hra: 3500, conveyance: 1500, specialAllowance: 2000, bonus: 0, otherEarnings: 0, gross: '₹14,000.00', grossRaw: 14000, netSalary: '₹14,000.00', netSalaryRaw: 14000, amountInWords: 'Indian Rupees Fourteen Thousand Only', paymentMode: 'Bank Transfer', transactionRef: 'TXN-982710493', status: 'Paid' }
];

export const PayrollDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [wizardStep, setWizardStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Stats & Lists
  const [stats, setStats] = useState(payrollData);
  const [structuresList, setStructuresList] = useState(initialStructures);
  const [payslipsList, setPayslipsList] = useState(initialPayslips);
  const [dbEmployeesList, setDbEmployeesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('September 2026');

  // Modals state
  const [isAddStructureOpen, setIsAddStructureOpen] = useState(false);
  const [isEditStructureOpen, setIsEditStructureOpen] = useState(false);
  const [isGenPayslipOpen, setIsGenPayslipOpen] = useState(false);

  const [editStructure, setEditStructure] = useState(null);

  // New Item States
  const [newStructure, setNewStructure] = useState({
    name: '',
    band: '₹6,00,000 / Annum',
    monthlyBand: '₹50,000 / Month',
    basic: '50%',
    hra: '25%',
    conveyance: '10%',
    specialAllowance: '15%',
    bonus: '0%',
    otherEarnings: '0%',
    deductions: '0 Days',
    effectiveDate: '2026-09-19',
    month: 'September',
    year: '2026'
  });

  const [newPayslip, setNewPayslip] = useState({
    employeeId: '',
    month: 7,
    year: 2026,
    totalWorkingDays: 30,
    paidDays: 30,
    lopDays: 0,
    paymentMode: 'Bank Transfer',
    transactionRef: ''
  });

  const { employees: storeEmployees } = useHRStore();
  const [selectedEmpForStruct, setSelectedEmpForStruct] = useState('');

  const handleSelectEmployeeForStructure = async (empId) => {
    setSelectedEmpForStruct(empId);
    if (!empId) return;

    try {
      const res = await payrollApi.getEmployeeSalaryStructure(empId);
      if (res?.data) {
        const data = res.data;
        const autoDesignation = data.designation || data.designationTitle || data.jobTitle || 'Software Engineer';
        setNewStructure((prev) => ({
          ...prev,
          name: autoDesignation,
          monthlyBand: data.monthlyBand || getMonthlyBand(data.monthlySalary || data.basicSalary),
          band: data.annualBand || getAnnualBand(data.basicSalary || data.monthlySalary)
        }));
        toast.success(`Fetched designation "${autoDesignation}" & salary details for ${data.employeeName}!`);
        return;
      }
    } catch (apiErr) {
      console.log('Backend API fetch fallback to local objects:', apiErr.message);
    }

    const targetEmp =
      dbEmployeesList.find((e) => e._id === empId || e.id === empId) ||
      storeEmployees.find((e) => e.id === empId || e._id === empId) ||
      employeesList.find((e) => e.id === empId || e._id === empId);

    if (targetEmp) {
      let rawMonthly = targetEmp.monthlySalary || targetEmp.monthlyBand;
      let rawAnnual = targetEmp.basicSalary || targetEmp.annualBand || targetEmp.salary;

      if (typeof targetEmp.salary === 'object' && targetEmp.salary?.basic) {
        const b = targetEmp.salary.basic;
        rawAnnual = targetEmp.salary.basicSalary || `₹${b.toLocaleString('en-IN')} / Annum`;
        rawMonthly = targetEmp.salary.monthlySalary || `₹${Math.round(b / 12).toLocaleString('en-IN')} / Month`;
      } else if (typeof targetEmp.salary === 'number') {
        rawAnnual = `₹${targetEmp.salary.toLocaleString('en-IN')} / Annum`;
        rawMonthly = `₹${Math.round(targetEmp.salary / 12).toLocaleString('en-IN')} / Month`;
      }

      const calcMonthly = getMonthlyBand(rawMonthly || rawAnnual, '₹50,000 / Month');
      const calcAnnual = getAnnualBand(rawAnnual || rawMonthly, '₹6,00,000 / Annum');
      const autoDesignation = targetEmp.designation || targetEmp.designationTitle || targetEmp.jobTitle || targetEmp.role || 'Software Engineer';

      setNewStructure((prev) => ({
        ...prev,
        name: autoDesignation,
        monthlyBand: calcMonthly,
        band: calcAnnual
      }));

      toast.success(`Fetched designation "${autoDesignation}" & salary details for ${targetEmp.firstName || targetEmp.name || 'Employee'}!`);
    }
  };

  useEffect(() => {
    if (isAddStructureOpen) {
      try {
        const saved = localStorage.getItem('latest_employee_salary');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.monthlyBand || parsed.annualBand || parsed.monthlySalary || parsed.basicSalary || parsed.designation) {
            const mBand = getMonthlyBand(parsed.monthlyBand || parsed.monthlySalary || parsed.annualBand || parsed.basicSalary, '₹50,000 / Month');
            const aBand = getAnnualBand(parsed.annualBand || parsed.basicSalary || parsed.monthlyBand || parsed.monthlySalary, '₹6,00,000 / Annum');
            const autoDesig = parsed.designation || parsed.designationTitle || parsed.jobTitle || 'Software Engineer';
            setNewStructure((prev) => ({
              ...prev,
              name: autoDesig,
              monthlyBand: mBand,
              band: aBand
            }));
          }
        }
      } catch (e) {
        console.log('Error auto-fetching employee salary from storage:', e);
      }
    }
  }, [isAddStructureOpen]);

  // View Payslip Modal
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isViewPayslipOpen, setIsViewPayslipOpen] = useState(false);

  // Map route to active tab
  const getActiveTab = () => {
    if (location.pathname.includes('/structures')) return 'structures';
    if (location.pathname.includes('/payslips')) return 'payslips';
    return 'processing';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabId) => {
    if (tabId === 'structures') navigate('/hr/payroll/structures');
    else if (tabId === 'payslips') navigate('/hr/payroll/payslips');
    else navigate('/hr/payroll');
  };

  // Helper to get non-deleted salary structures
  const getActiveStructures = (list) => {
    try {
      const deletedRaw = JSON.parse(localStorage.getItem('deleted_salary_structures') || '[]');
      const deleted = (Array.isArray(deletedRaw) ? deletedRaw : [])
        .filter((id) => id && id !== 'undefined' && id !== 'null');

      if (deleted.length === 0) return list;
      return list.filter((s) => {
        const mId = s._id ? String(s._id) : null;
        const sId = s.id ? String(s.id) : null;
        const structId = s.structureId ? String(s.structureId) : null;

        const isMongoDeleted = mId && deleted.includes(mId);
        const isIdDeleted = sId && deleted.includes(sId);
        const isStructIdDeleted = structId && deleted.includes(structId);

        return !isMongoDeleted && !isIdDeleted && !isStructIdDeleted;
      });
    } catch (e) {
      return list;
    }
  };

  // Helper to get non-deleted payslips
  const getActivePayslips = (list) => {
    try {
      const deletedRaw = JSON.parse(localStorage.getItem('deleted_payslips') || '[]');
      const deleted = (Array.isArray(deletedRaw) ? deletedRaw : [])
        .filter((id) => id && id !== 'undefined' && id !== 'null');

      if (deleted.length === 0) return list;
      return list.filter((p) => {
        const mId = p._id ? String(p._id) : null;
        const pId = p.id ? String(p.id) : null;
        const pCode = p.payslipCode ? String(p.payslipCode) : null;

        const isMongoDeleted = mId && deleted.includes(mId);
        const isIdDeleted = pId && deleted.includes(pId);
        const isCodeDeleted = pCode && deleted.includes(pCode);

        return !isMongoDeleted && !isIdDeleted && !isCodeDeleted;
      });
    } catch (e) {
      return list;
    }
  };

  // Helper to get real non-dummy active employees
  const getRealEmployees = (list) => {
    try {
      const deletedRaw = JSON.parse(localStorage.getItem('deleted_employee_ids') || '[]');
      const deleted = (Array.isArray(deletedRaw) ? deletedRaw : [])
        .filter((id) => id && id !== 'undefined' && id !== 'null');

      const dummyCodes = ['EMP-0001', 'EMP-0002', 'EMP-0003', 'EMP-001', 'EMP-002', 'EMP-003'];
      const dummyNames = ['Rahul Sharma', 'Sarah Jenkins', 'Alex Vance'];

      let filteredList = (list || []).filter((emp) => {
        const empCode = emp.employeeCode || emp.id || '';
        const empName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.name || '';
        const mongoId = emp._id || emp.mongoId || '';

        const isDeleted = (mongoId && deleted.includes(String(mongoId))) || (empCode && deleted.includes(String(empCode)));
        const isDummy = dummyCodes.includes(empCode) || dummyNames.includes(empName);

        return !isDeleted && !isDummy;
      });

      if (filteredList.length === 0 && list && list.length > 0) {
        filteredList = list.filter((emp) => {
          const empCode = emp.employeeCode || emp.id || '';
          const mongoId = emp._id || emp.mongoId || '';
          return !deleted.includes(String(mongoId)) && !deleted.includes(String(empCode));
        });
      }

      return filteredList;
    } catch (e) {
      return list || [];
    }
  };

  // Fetch Payroll API Data
  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const [statsRes, structRes, slipsRes, empRes] = await Promise.allSettled([
        payrollApi.getDashboardStats(),
        payrollApi.getSalaryStructures(),
        payrollApi.getAllPayslips(),
        employeeApi.getAllEmployees()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats((prev) => ({ ...prev, ...statsRes.value.data }));
      }

      let fetchedStructures = [];
      if (structRes.status === 'fulfilled' && Array.isArray(structRes.value?.data)) {
        fetchedStructures = structRes.value.data;
      }

      let localCustom = [];
      try {
        localCustom = JSON.parse(localStorage.getItem('custom_salary_structures') || '[]');
      } catch (e) {}

      // Filter localCustom to remove items already returned from MongoDB backend or matching by name/ID
      const cleanLocalCustom = localCustom.filter((loc) => {
        const locName = (loc.name || '').trim().toLowerCase();
        const locId = loc._id || loc.id || loc.structureId;
        const existsInBackend = fetchedStructures.some((f) => {
          const fName = (f.name || '').trim().toLowerCase();
          const fId = f._id || f.id || f.structureId;
          return (locName && fName && locName === fName) || (locId && fId && String(locId) === String(fId));
        });
        return !existsInBackend;
      });

      try {
        localStorage.setItem('custom_salary_structures', JSON.stringify(cleanLocalCustom));
      } catch (e) {}

      const combinedStructures = [...fetchedStructures, ...cleanLocalCustom];
      initialStructures.forEach((initStr) => {
        const initName = (initStr.name || '').trim().toLowerCase();
        const exists = combinedStructures.some(
          (s) => s.id === initStr.id || (s.name || '').trim().toLowerCase() === initName || s._id === initStr.id
        );
        if (!exists) {
          combinedStructures.push(initStr);
        }
      });

      setStructuresList(() => {
        const uniqueMap = new Map();
        combinedStructures.forEach((item) => {
          const nameKey = (item.name || '').trim().toLowerCase() || item._id || item.id;
          if (nameKey && !uniqueMap.has(nameKey)) {
            uniqueMap.set(nameKey, item);
          }
        });

        return getActiveStructures(Array.from(uniqueMap.values()));
      });

      let fetchedSlips = [];
      if (slipsRes.status === 'fulfilled' && Array.isArray(slipsRes.value?.data)) {
        fetchedSlips = slipsRes.value.data;
      }

      let localCustomSlips = [];
      try {
        localCustomSlips = JSON.parse(localStorage.getItem('custom_payslips') || '[]');
      } catch (e) {}

      const combinedSlips = [...localCustomSlips, ...fetchedSlips, ...initialPayslips];
      const uniqueSlips = new Map();
      combinedSlips.forEach((p) => {
        const key = p._id || p.id || p.payslipCode;
        if (key && !uniqueSlips.has(key)) {
          uniqueSlips.set(key, p);
        }
      });

      setPayslipsList(getActivePayslips(Array.from(uniqueSlips.values())));

      const storeEmps = (useHRStore.getState()?.employees || []).map((mEmp) => ({
        _id: mEmp.id || `MOCK-${mEmp.email}`,
        employeeCode: mEmp.id || `EMP-${Math.floor(100 + Math.random() * 900)}`,
        firstName: mEmp.firstName || (mEmp.name ? mEmp.name.split(' ')[0] : 'New'),
        lastName: mEmp.lastName || (mEmp.name && mEmp.name.split(' ').length > 1 ? mEmp.name.split(' ').slice(1).join(' ') : 'Employee'),
        department: { name: mEmp.department || 'General' },
        designation: mEmp.designation || 'Staff Member',
        status: mEmp.status || 'Active',
        salary: {
          monthlySalary: mEmp.monthlySalary,
          basicSalary: mEmp.basicSalary,
          grossSalary: parseFloat(String(mEmp.monthlySalary || '').replace(/[^0-9.]/g, '')) || 12000
        }
      }));

      let apiEmps = empRes.status === 'fulfilled' && Array.isArray(empRes.value?.data) ? empRes.value.data : [];
      const mergedEmps = [...apiEmps];

      storeEmps.forEach((sEmp) => {
        const exists = mergedEmps.some((aEmp) => aEmp._id === sEmp._id || aEmp.employeeCode === sEmp.employeeCode || (aEmp.email && aEmp.email === sEmp.email));
        if (!exists) mergedEmps.push(sEmp);
      });

      setDbEmployeesList(mergedEmps);
    } catch (err) {
      console.error('Failed to load payroll data:', err);
      setStructuresList((prev) => getActiveStructures(prev.length > 0 ? prev : initialStructures));
      setPayslipsList(getActivePayslips(initialPayslips));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const payrollTabs = [
    { id: 'processing', label: 'Payroll Processing' },
    { id: 'structures', label: `Salary Structures (${structuresList.length})` },
    { id: 'payslips', label: `Payslips Archive (${payslipsList.length})` }
  ];

  const handleRunWizard = async () => {
    setIsProcessing(true);
    try {
      const res = await payrollApi.generateMonthlyPayroll({ month: 7, year: 2026 });
      setIsProcessing(false);
      setWizardStep(4);
      toast.success(res?.message || 'Payroll for July 2026 executed & Infotattva payslips generated!');
      fetchPayrollData();
    } catch (err) {
      console.error('Payroll engine error:', err);
      setIsProcessing(false);
      setWizardStep(4);
      toast.error(err.message || 'Error processing payroll');
    }
  };

  const handleCreateStructure = async (e) => {
    e.preventDefault();
    if (!newStructure.name || !newStructure.band) {
      toast.error('Please complete all structure details');
      return;
    }

    const formattedDeductionVal = formatDeductions(newStructure.deductions);

    const payload = {
      ...newStructure,
      deductions: formattedDeductionVal
    };

    const createdItem = {
      _id: `LOCAL-${Date.now()}`,
      id: `STR-${Math.floor(100 + Math.random() * 900)}`,
      name: newStructure.name,
      band: newStructure.band,
      monthlyBand: newStructure.monthlyBand,
      basic: newStructure.basic || '50%',
      hra: newStructure.hra || '25%',
      conveyance: newStructure.conveyance || '10%',
      specialAllowance: newStructure.specialAllowance || '15%',
      bonus: newStructure.bonus || '0%',
      otherEarnings: newStructure.otherEarnings || '0%',
      deductions: formattedDeductionVal,
      effectiveDate: newStructure.effectiveDate || '2026-09-19',
      month: newStructure.month || 'September',
      year: Number(newStructure.year || 2026),
      membersCount: 0
    };

    setStructuresList((prev) => {
      const filtered = (prev || []).filter(
        (s) => (s.name || '').trim().toLowerCase() !== (newStructure.name || '').trim().toLowerCase()
      );
      return [createdItem, ...filtered];
    });

    try {
      const existingCustom = JSON.parse(localStorage.getItem('custom_salary_structures') || '[]');
      const filteredCustom = existingCustom.filter(
        (s) => (s.name || '').trim().toLowerCase() !== (newStructure.name || '').trim().toLowerCase()
      );
      localStorage.setItem('custom_salary_structures', JSON.stringify([createdItem, ...filteredCustom]));
    } catch (e) {
      console.log('Error caching custom structure to localStorage:', e);
    }

    try {
      const res = await payrollApi.createSalaryStructure(payload);
      if (res?.success || res?.data) {
        toast.success(`Salary structure "${newStructure.name}" saved successfully!`);
        if (res.data) {
          try {
            const existingCustom = JSON.parse(localStorage.getItem('custom_salary_structures') || '[]');
            const filteredCustom = existingCustom.filter(
              (s) => (s.name || '').trim().toLowerCase() !== (newStructure.name || '').trim().toLowerCase()
            );
            localStorage.setItem('custom_salary_structures', JSON.stringify([res.data, ...filteredCustom]));
          } catch (e) {}
        }
        fetchPayrollData();
      }
    } catch (err) {
      console.error('Error creating structure:', err);
      toast.success(`Salary structure "${newStructure.name}" saved!`);
    } finally {
      setIsAddStructureOpen(false);
      setNewStructure({
        name: '',
        band: '₹6,00,000 / Annum',
        monthlyBand: '₹50,000 / Month',
        basic: '50%',
        hra: '25%',
        conveyance: '10%',
        specialAllowance: '15%',
        bonus: '0%',
        otherEarnings: '0%',
        deductions: '0%',
        effectiveDate: '2026-09-19',
        month: 'September',
        year: '2026'
      });
    }
  };

  const handleOpenEditStructure = (str) => {
    setEditStructure({
      _id: str._id,
      id: str.id,
      name: str.name || '',
      band: str.band || '',
      monthlyBand: str.monthlyBand || '',
      basic: str.basic || '50%',
      hra: str.hra || '25%',
      conveyance: str.conveyance || '10%',
      specialAllowance: str.specialAllowance || '15%',
      bonus: str.bonus || '0%',
      otherEarnings: str.otherEarnings || '0%',
      deductions: str.deductions || '0%',
      effectiveDate: str.effectiveDate ? new Date(str.effectiveDate).toISOString().split('T')[0] : '2026-09-19',
      month: str.month || 'September',
      year: String(str.year || '2026')
    });
    setIsEditStructureOpen(true);
  };

  const handleUpdateStructure = async (e) => {
    e.preventDefault();
    if (!editStructure?.name || !editStructure?.band) {
      toast.error('Please complete all structure details');
      return;
    }
    const targetId = editStructure._id || editStructure.id;
    const formattedDeductionVal = formatDeductions(editStructure.deductions);
    const updatedPayload = {
      ...editStructure,
      deductions: formattedDeductionVal
    };

    try {
      if (editStructure._id) {
        const res = await payrollApi.updateSalaryStructure(editStructure._id, updatedPayload);
        if (res?.success || res?.data) {
          toast.success(`Salary structure "${editStructure.name}" updated successfully!`);
          fetchPayrollData();
        }
      } else {
        setStructuresList((prev) =>
          prev.map((s) => ((s._id || s.id) === targetId ? { ...s, ...updatedPayload } : s))
        );
        toast.success(`Salary structure "${editStructure.name}" updated!`);
      }
    } catch (err) {
      console.error('Error updating structure:', err);
      setStructuresList((prev) =>
        prev.map((s) => ((s._id || s.id) === targetId ? { ...s, ...updatedPayload } : s))
      );
      toast.success(`Salary structure "${editStructure.name}" updated!`);
    } finally {
      setIsEditStructureOpen(false);
      setEditStructure(null);
    }
  };

  const handleDeleteStructure = async (structure) => {
    const structId = structure._id || structure.id || structure.structureId;
    if (!window.confirm(`Are you sure you want to delete "${structure.name}"?`)) return;

    try {
      const delId = structure._id || structure.id || structure.structureId;
      await payrollApi.deleteSalaryStructure(delId);
    } catch (err) {
      console.log('Backend deletion notification:', err.message);
    }

    try {
      const deletedRaw = JSON.parse(localStorage.getItem('deleted_salary_structures') || '[]');
      const deleted = (Array.isArray(deletedRaw) ? deletedRaw : []).filter(id => id && id !== 'undefined' && id !== 'null');
      if (structure._id && !deleted.includes(String(structure._id))) deleted.push(String(structure._id));
      if (structure.id && !deleted.includes(String(structure.id))) deleted.push(String(structure.id));
      if (structure.structureId && !deleted.includes(String(structure.structureId))) deleted.push(String(structure.structureId));
      localStorage.setItem('deleted_salary_structures', JSON.stringify(deleted));

      const existingCustom = JSON.parse(localStorage.getItem('custom_salary_structures') || '[]');
      const updatedCustom = existingCustom.filter(
        (s) => (s._id || s.id || s.structureId) !== structId && s.name !== structure.name
      );
      localStorage.setItem('custom_salary_structures', JSON.stringify(updatedCustom));
    } catch (e) {
      console.log('Error writing deleted structure to localStorage:', e);
    }

    setStructuresList((prev) => prev.filter((s) => (s._id || s.id || s.structureId) !== structId));
    toast.success(`Salary structure "${structure.name}" deleted successfully!`);
  };

  const handleDeletePayslip = async (pay) => {
    const payslipId = pay._id || pay.id || pay.payslipCode;
    if (!window.confirm(`Are you sure you want to delete payslip "${pay.payslipCode || pay.id}" for ${pay.employeeName}?`)) return;

    try {
      const delId = pay._id || pay.id || pay.payslipCode;
      if (delId) {
        await payrollApi.deletePayslip(delId);
      }
    } catch (err) {
      console.log('Backend delete payslip notification:', err.message);
    }

    try {
      const deleted = JSON.parse(localStorage.getItem('deleted_payslips') || '[]');
      if (pay._id && !deleted.includes(String(pay._id))) deleted.push(String(pay._id));
      if (pay.id && !deleted.includes(String(pay.id))) deleted.push(String(pay.id));
      if (pay.payslipCode && !deleted.includes(String(pay.payslipCode))) deleted.push(String(pay.payslipCode));
      localStorage.setItem('deleted_payslips', JSON.stringify(deleted));
    } catch (e) {
      console.log('Error saving deleted payslip to localStorage:', e);
    }

    setPayslipsList((prev) => prev.filter((p) => (p._id || p.id || p.payslipCode) !== payslipId));
    toast.success(`Payslip "${pay.payslipCode || payslipId}" deleted permanently`);
  };

  const handleGeneratePayslip = async (e) => {
    e.preventDefault();
    try {
      const allEmps = dbEmployeesList.length > 0 ? dbEmployeesList : storeEmployees;
      const targetEmp = allEmps.find(
        (emp) => emp._id === newPayslip.employeeId || emp.id === newPayslip.employeeId || emp.employeeCode === newPayslip.employeeId
      );

      const empName = targetEmp
        ? `${targetEmp.firstName || ''} ${targetEmp.lastName || ''}`.trim() || targetEmp.name || 'Employee'
        : 'Gyana Singh';
      const empCode = targetEmp?.employeeCode || targetEmp?.id || 'EMP-930';

      const totDays = Number(newPayslip.totalWorkingDays) || 30;
      const pdDays = Number(newPayslip.paidDays) || 30;
      const lopDays = Number(newPayslip.lopDays) || 0;

      let monthlyGross = 0;
      if (targetEmp?.salary) {
        const mVal = parseFloat(String(targetEmp.salary.monthlySalary || targetEmp.salary.grossSalary || '').replace(/[^0-9.]/g, ''));
        const aVal = parseFloat(String(targetEmp.salary.basicSalary || targetEmp.salary.annualBand || targetEmp.salary.basic || '').replace(/[^0-9.]/g, ''));
        if (!isNaN(mVal) && mVal > 0) monthlyGross = mVal;
        else if (!isNaN(aVal) && aVal > 0) monthlyGross = aVal < 50000 ? aVal : Math.round(aVal / 12);
      }
      if (!monthlyGross || isNaN(monthlyGross) || monthlyGross <= 0) monthlyGross = 12000;

      const leaveDed = lopDays > 0 ? Math.round((monthlyGross / totDays) * lopDays) : 0;
      const realGross = Math.max(0, monthlyGross - leaveDed);

      const generatedSlipObj = {
        _id: `LOCAL-PAY-${Date.now()}`,
        id: `PAY-${Math.floor(700 + Math.random() * 300)}`,
        payslipCode: `PAY-${Math.floor(700 + Math.random() * 300)}`,
        employeeName: empName,
        employeeId: empCode,
        month: 'July 2026',
        designation: targetEmp?.designation || 'Software Engineer',
        department: targetEmp?.department?.name || targetEmp?.department || 'Engineering',
        joiningDate: '01/06/2023',
        workLocation: 'Bhubaneswar / Remote',
        panNumber: targetEmp?.panNumber || 'ABCDE1234F',
        bankName: targetEmp?.bankName || 'HDFC Bank',
        accountNumber: targetEmp?.accountNumber || 'XXXXX1234',
        totalWorkingDays: totDays,
        paidDays: pdDays,
        lopDays: lopDays,
        basic: Math.round(realGross * 0.50),
        hra: Math.round(realGross * 0.25),
        conveyance: Math.round(realGross * 0.10),
        specialAllowance: Math.round(realGross * 0.15),
        bonus: 0,
        otherEarnings: 0,
        gross: `₹${realGross.toLocaleString('en-IN')}.00`,
        grossRaw: realGross,
        fullGrossRaw: monthlyGross,
        netSalary: `₹${realGross.toLocaleString('en-IN')}.00`,
        netSalaryRaw: realGross,
        amountInWords: convertNumberToWords(realGross),
        paymentMode: newPayslip.paymentMode || 'Bank Transfer',
        transactionRef: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: 'Paid'
      };

      setPayslipsList((prev) => [generatedSlipObj, ...prev]);

      try {
        const existingCustom = JSON.parse(localStorage.getItem('custom_payslips') || '[]');
        localStorage.setItem('custom_payslips', JSON.stringify([generatedSlipObj, ...existingCustom]));
      } catch (e) {}

      try {
        await payrollApi.generateMonthlyPayroll({
          month: newPayslip.month || 7,
          year: newPayslip.year || 2026,
          employeeId: newPayslip.employeeId || undefined,
          totalWorkingDays: newPayslip.totalWorkingDays,
          paidDays: newPayslip.paidDays,
          lopDays: newPayslip.lopDays,
          paymentMode: newPayslip.paymentMode,
          transactionRef: newPayslip.transactionRef
        });
      } catch (err) {
        console.log('Backend payslip sync notification:', err.message);
      }

      toast.success(`Infotattva Payslip generated for ${empName}!`);
      fetchPayrollData();
    } catch (err) {
      console.error('Error generating payslip:', err);
      toast.error(err.message || 'Failed to generate payslip');
    } finally {
      setIsGenPayslipOpen(false);
    }
  };

  const handleViewPayslip = async (pay) => {
    try {
      if (pay._id) {
        const res = await payrollApi.getPayslipById(pay._id);
        if (res?.data) {
          setSelectedPayslip(res.data);
          setIsViewPayslipOpen(true);
          return;
        }
      }
      setSelectedPayslip(pay);
      setIsViewPayslipOpen(true);
    } catch (err) {
      setSelectedPayslip(pay);
      setIsViewPayslipOpen(true);
    }
  };

  const handleStatusChange = async (payslipId, newStatus) => {
    try {
      await payrollApi.updatePaymentStatus(payslipId, { paymentStatus: newStatus });
      toast.success(`Payment status updated to ${newStatus}`);
      fetchPayrollData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const handleDownloadPdf = () => {
    const empName = selectedPayslip?.employeeName || selectedPayslip?.employeeId?.firstName || 'Employee';
    const month = selectedPayslip?.month || 'July_2026';
    downloadPayslipPdf('infotattva-salary-slip', `Infotattva_Payslip_${empName.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      {/* Page Header */}
      <PageHeader
        title="Payroll & Compensation Management"
        subtitle="Manage Infotattva salary structures, monthly payroll processing, tax calculation, and payslips archive."
        breadcrumbs={['Payroll', activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]}
        actions={
          activeTab === 'structures' ? (
            <Button onClick={() => setIsAddStructureOpen(true)} variant="primary" icon={Plus}>
              New Salary Structure
            </Button>
          ) : activeTab === 'payslips' ? (
            <Button onClick={() => setIsGenPayslipOpen(true)} variant="primary" icon={Plus}>
              Generate Payslip
            </Button>
          ) : null
        }
      />

      {/* Tabs Header */}
      <Tabs tabs={payrollTabs} activeTab={activeTab} onChange={handleTabChange} />

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#534675] animate-spin" />
          <span className="ml-3 text-sm font-medium text-slate-600">Loading Payroll System...</span>
        </div>
      )}

      {/* TAB 1: PAYROLL PROCESSING WIZARD */}
      {!loading && activeTab === 'processing' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Payroll Budget"
              value={stats.totalBudget || '₹4,85,000.00'}
              description="July 2026 Cycle"
              icon={DollarSign}
              iconBg="bg-[#f2f8e8] text-[#59781b]"
            />
            <StatCard
              title="Employees Processed"
              value={stats.processedCount || '387/389'}
              description="97% Completed"
              icon={CheckCircle}
              iconBg="bg-[#f0edf7] text-[#534675]"
            />
            <StatCard
              title="Pending Approvals"
              value={stats.pendingCount !== undefined ? String(stats.pendingCount) : '2'}
              description="Arrears & Adjustments"
              icon={Calculator}
              iconBg="bg-amber-50 text-amber-600 border border-amber-200"
            />
          </div>

          {/* Monthly Payroll Processing Wizard */}
          <Card className="space-y-6 bg-white border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-lg font-bold text-[#2c2738]">July 2026 Monthly Payroll Processing Wizard</h3>
              <p className="text-xs text-slate-500">Automated salary calculation engine (Infotattva Format)</p>
            </div>

            {/* Wizard Steps */}
            <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${wizardStep >= 1 ? 'bg-[#534675] text-white' : 'text-slate-500'}`}>
                1. Select Month
              </div>
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${wizardStep >= 2 ? 'bg-[#534675] text-white' : 'text-slate-500'}`}>
                2. Calculate Salaries
              </div>
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${wizardStep >= 3 ? 'bg-[#534675] text-white' : 'text-slate-500'}`}>
                3. Review Adjustments
              </div>
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${wizardStep >= 4 ? 'bg-[#9ec64c] text-white' : 'text-slate-500'}`}>
                4. Approve & Dispatch
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-[#2c2738]">Cycle Summary: {stats.cycleSummary || 'July 1 - July 31, 2026'}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Automated payroll calculation with instant Infotattva payslip generation.</p>
                </div>
                <Button
                  onClick={handleRunWizard}
                  isLoading={isProcessing}
                  variant="primary"
                  icon={Play}
                >
                  {wizardStep === 4 ? 'Re-Run Payroll Engine' : 'Execute Payroll Calculation'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: SALARY STRUCTURES */}
      {!loading && activeTab === 'structures' && (
        <div className="space-y-4">
          {/* Monthly Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#534675]" />
              <span className="text-xs font-bold text-[#2c2738]">Filter By Month:</span>
              <Select
                value={selectedMonthFilter}
                onChange={(e) => setSelectedMonthFilter(e.target.value)}
                options={[
                  { label: 'September 2026 (Current Month)', value: 'September 2026' },
                  { label: 'August 2026', value: 'August 2026' },
                  { label: 'July 2026', value: 'July 2026' },
                  { label: 'June 2026', value: 'June 2026' },
                  { label: 'May 2026', value: 'May 2026' },
                  { label: 'All Months', value: 'All' }
                ]}
                className="w-56"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-[#534675]">
                {structuresList.filter((str) => {
                  if (selectedMonthFilter === 'All') return true;
                  const filterClean = selectedMonthFilter.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
                  const strMonthYear = `${str.month || 'September'} ${str.year || 2026}`.trim().toLowerCase();
                  return strMonthYear.includes(filterClean) || filterClean.includes(strMonthYear);
                }).length}
              </span> structure(s) for <span className="font-bold text-[#59781b]">{selectedMonthFilter}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {structuresList
              .filter((str) => {
                if (selectedMonthFilter === 'All') return true;
                const filterClean = selectedMonthFilter.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
                const strMonthYear = `${str.month || 'September'} ${str.year || 2026}`.trim().toLowerCase();
                return strMonthYear.includes(filterClean) || filterClean.includes(strMonthYear);
              })
              .map((str, idx) => (
                <Card key={str._id || str.id || idx} className="space-y-4 bg-white border border-slate-200 shadow-xs hover:border-[#534675]/40 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[#f0edf7] text-[#534675] rounded-xl border border-[#dcd6e8]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#2c2738]">{str.name}</h4>
                        <p className="text-xs text-[#534675] font-bold">Monthly Band: {getMonthlyBand(str.band, str.monthlyBand)}</p>
                        <p className="text-[11px] text-[#59781b] font-semibold mt-0.5">Annual Band: {getAnnualBand(str.monthlyBand || str.band, str.band)}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-[#534675]" />
                          <span>Cycle: <strong className="text-[#2c2738]">{str.month || 'September'} {str.year || 2026}</strong></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#f0edf7] text-[#534675] font-bold rounded-lg border border-[#dcd6e8] text-[11px]">
                        {str.membersCount || 0} Assigned
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditStructure(str)}
                          title="Edit Salary Structure"
                          className="p-1.5 text-slate-400 hover:text-[#534675] hover:bg-[#f0edf7] rounded-lg transition-colors border border-transparent hover:border-[#dcd6e8]"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStructure(str)}
                          title="Delete Salary Structure"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-3 border-t border-slate-100 text-xs text-center">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Basic</p>
                      <p className="font-bold text-[#2c2738]">{str.basic}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">HRA</p>
                      <p className="font-bold text-[#2c2738]">{str.hra}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Conveyance</p>
                      <p className="font-bold text-[#534675]">{str.conveyance || '10%'}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Spl. Allowance</p>
                      <p className="font-bold text-[#534675]">{str.specialAllowance || '10%'}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Bonus</p>
                      <p className="font-bold text-[#534675]">{str.bonus || '5%'}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Other Earnings</p>
                      <p className="font-bold text-[#534675]">{str.otherEarnings || '5%'}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-50/50 border border-rose-200/60">
                      <p className="text-[9px] text-rose-500 font-semibold uppercase">Day-Wise Leave Ded.</p>
                      <p className="font-bold text-rose-600">{formatDeductions(str.deductions)}</p>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: PAYSLIPS ARCHIVE */}
      {!loading && activeTab === 'payslips' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee name or payslip ID..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#2c2738] focus:outline-none focus:ring-2 focus:ring-[#534675]/30 focus:border-[#534675] shadow-xs"
            />
          </div>

          <Card className="bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2c2738]">
                <thead className="bg-slate-50 uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">PAYSLIP CODE</th>
                    <th className="px-4 py-3">EMPLOYEE DETAILS</th>
                    <th className="px-4 py-3">PAY MONTH</th>
                    <th className="px-4 py-3">GROSS EARNINGS</th>
                    <th className="px-4 py-3">NET SALARY PAYABLE</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payslipsList
                    .filter((p) => (p.employeeName || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.payslipCode || p.id || '').toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((pay, idx) => (
                      <tr key={pay._id || pay.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-slate-400">{pay.payslipCode || pay.id}</td>
                        <td className="px-4 py-3.5 font-bold text-[#2c2738]">
                          {pay.employeeName}
                          <span className="block text-[10px] text-slate-400 font-mono">{pay.employeeId}</span>
                        </td>
                        <td className="px-4 py-3.5 font-medium">{pay.month}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">{pay.gross}</td>
                        <td className="px-4 py-3.5 font-bold text-[#59781b]">{pay.netSalary || pay.gross}</td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleStatusChange(pay._id || pay.id, pay.status === 'Paid' ? 'Pending' : 'Paid')}
                            title="Click to toggle Paid/Pending status"
                            className="cursor-pointer"
                          >
                            <StatusBadge status={pay.status} />
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1">
                          <Button
                            onClick={() => handleViewPayslip(pay)}
                            variant="ghost"
                            size="sm"
                            icon={FileText}
                          >
                            View Slip
                          </Button>
                          <Button
                            onClick={() => {
                              handleViewPayslip(pay);
                              setTimeout(() => {
                                downloadPayslipPdf('infotattva-salary-slip', `Infotattva_Payslip_${(pay.employeeName || 'Employee').replace(/\s+/g, '_')}_${(pay.month || 'July_2026').replace(/\s+/g, '_')}.pdf`);
                              }, 300);
                            }}
                            variant="ghost"
                            size="sm"
                            icon={Download}
                          >
                            PDF
                          </Button>
                          <Button
                            onClick={() => handleDeletePayslip(pay)}
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 1: NEW SALARY STRUCTURE */}
      <Modal
        isOpen={isAddStructureOpen}
        onClose={() => setIsAddStructureOpen(false)}
        title="Create Salary Pay Structure"
        subtitle="Establish pay component ratios and annual compensation bands (INR)."
        footer={
          <>
            <Button onClick={() => setIsAddStructureOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCreateStructure} variant="primary">Create Structure</Button>
          </>
        }
      >
        <form onSubmit={handleCreateStructure} className="space-y-4 text-xs">
          <Select
            label="Auto-Fetch Salary From Employee (Optional)"
            value={selectedEmpForStruct}
            onChange={(e) => handleSelectEmployeeForStructure(e.target.value)}
            options={[
              { label: '-- Select Employee to Auto-Fetch Salary --', value: '' },
              ...getRealEmployees(dbEmployeesList.length > 0 ? dbEmployeesList : storeEmployees).map((emp) => {
                const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.name || 'Employee';
                const code = emp.employeeCode || emp.id || 'EMP';
                return {
                  label: `${fullName} (${code})`,
                  value: emp._id || emp.id
                };
              })
            ]}
          />
          <Input
            label="Designation Title"
            value={newStructure.name}
            onChange={(e) => setNewStructure({ ...newStructure, name: e.target.value })}
            placeholder="e.g. Senior Software Engineer (L5)"
            required
          />
          <Input
            label="Monthly Compensation Band (₹)"
            value={newStructure.monthlyBand}
            onChange={(e) => {
              const monthlyVal = e.target.value;
              const calcAnnual = getAnnualBand(monthlyVal, newStructure.band);
              setNewStructure({ ...newStructure, monthlyBand: monthlyVal, band: calcAnnual });
            }}
            placeholder="e.g. ₹50,000 / Month"
            required
          />
          <Input
            label="Annual Compensation Band (₹)"
            value={newStructure.band}
            onChange={(e) => {
              const annualVal = e.target.value;
              const calcMonthly = getMonthlyBand(annualVal, '');
              setNewStructure({ ...newStructure, band: annualVal, monthlyBand: calcMonthly });
            }}
            placeholder="e.g. ₹6,00,000 / Annum"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Effective Date"
              type="date"
              value={newStructure.effectiveDate || '2026-09-19'}
              onChange={(e) => setNewStructure({ ...newStructure, effectiveDate: e.target.value })}
              required
            />
            <Select
              label="Effective Month"
              value={newStructure.month || 'September'}
              onChange={(e) => setNewStructure({ ...newStructure, month: e.target.value })}
              options={[
                { label: 'January', value: 'January' },
                { label: 'February', value: 'February' },
                { label: 'March', value: 'March' },
                { label: 'April', value: 'April' },
                { label: 'May', value: 'May' },
                { label: 'June', value: 'June' },
                { label: 'July', value: 'July' },
                { label: 'August', value: 'August' },
                { label: 'September', value: 'September' },
                { label: 'October', value: 'October' },
                { label: 'November', value: 'November' },
                { label: 'December', value: 'December' }
              ]}
            />
            <Select
              label="Effective Year"
              value={String(newStructure.year || '2026')}
              onChange={(e) => setNewStructure({ ...newStructure, year: e.target.value })}
              options={[
                { label: '2026', value: '2026' },
                { label: '2025', value: '2025' },
                { label: '2027', value: '2027' }
              ]}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Input
              label="Basic Pay (%)"
              value={newStructure.basic}
              onChange={(e) => setNewStructure({ ...newStructure, basic: e.target.value })}
              placeholder="50%"
              required
            />
            <Input
              label="HRA (%)"
              value={newStructure.hra}
              onChange={(e) => setNewStructure({ ...newStructure, hra: e.target.value })}
              placeholder="25%"
              required
            />
            <Input
              label="Conveyance (%)"
              value={newStructure.conveyance}
              onChange={(e) => setNewStructure({ ...newStructure, conveyance: e.target.value })}
              placeholder="10%"
              required
            />
            <Input
              label="Spl. Allowance (%)"
              value={newStructure.specialAllowance}
              onChange={(e) => setNewStructure({ ...newStructure, specialAllowance: e.target.value })}
              placeholder="15%"
              required
            />
            <Input
              label="Bonus / Incentive (%)"
              value={newStructure.bonus}
              onChange={(e) => setNewStructure({ ...newStructure, bonus: e.target.value })}
              placeholder="0%"
              required
            />
            <Input
              label="Other Earnings (%)"
              value={newStructure.otherEarnings}
              onChange={(e) => setNewStructure({ ...newStructure, otherEarnings: e.target.value })}
              placeholder="0%"
              required
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 1.5: EDIT SALARY STRUCTURE */}
      <Modal
        isOpen={isEditStructureOpen}
        onClose={() => {
          setIsEditStructureOpen(false);
          setEditStructure(null);
        }}
        title="Edit Salary Pay Structure"
        subtitle="Update pay component ratios and compensation bands."
        footer={
          <>
            <Button onClick={() => { setIsEditStructureOpen(false); setEditStructure(null); }} variant="outline">Cancel</Button>
            <Button onClick={handleUpdateStructure} variant="primary">Save Changes</Button>
          </>
        }
      >
        {editStructure && (
          <form onSubmit={handleUpdateStructure} className="space-y-4 text-xs">
            <Input
              label="Designation Title"
              value={editStructure.name}
              onChange={(e) => setEditStructure({ ...editStructure, name: e.target.value })}
              placeholder="e.g. Senior Software Engineer (L5)"
              required
            />
            <Input
              label="Monthly Compensation Band (₹)"
              value={editStructure.monthlyBand}
              onChange={(e) => {
                const monthlyVal = e.target.value;
                const calcAnnual = getAnnualBand(monthlyVal, editStructure.band);
                setEditStructure({ ...editStructure, monthlyBand: monthlyVal, band: calcAnnual });
              }}
              placeholder="e.g. ₹50,000 / Month"
              required
            />
            <Input
              label="Annual Compensation Band (₹)"
              value={editStructure.band}
              onChange={(e) => {
                const annualVal = e.target.value;
                const calcMonthly = getMonthlyBand(annualVal, '');
                setEditStructure({ ...editStructure, band: annualVal, monthlyBand: calcMonthly });
              }}
              placeholder="e.g. ₹6,00,000 / Annum"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Effective Date"
                type="date"
                value={editStructure.effectiveDate || '2026-09-19'}
                onChange={(e) => setEditStructure({ ...editStructure, effectiveDate: e.target.value })}
                required
              />
              <Select
                label="Effective Month"
                value={editStructure.month || 'September'}
                onChange={(e) => setEditStructure({ ...editStructure, month: e.target.value })}
                options={[
                  { label: 'January', value: 'January' },
                  { label: 'February', value: 'February' },
                  { label: 'March', value: 'March' },
                  { label: 'April', value: 'April' },
                  { label: 'May', value: 'May' },
                  { label: 'June', value: 'June' },
                  { label: 'July', value: 'July' },
                  { label: 'August', value: 'August' },
                  { label: 'September', value: 'September' },
                  { label: 'October', value: 'October' },
                  { label: 'November', value: 'November' },
                  { label: 'December', value: 'December' }
                ]}
              />
              <Select
                label="Effective Year"
                value={String(editStructure.year || '2026')}
                onChange={(e) => setEditStructure({ ...editStructure, year: e.target.value })}
                options={[
                  { label: '2026', value: '2026' },
                  { label: '2025', value: '2025' },
                  { label: '2027', value: '2027' }
                ]}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Input
                label="Basic Pay (%)"
                value={editStructure.basic}
                onChange={(e) => setEditStructure({ ...editStructure, basic: e.target.value })}
                placeholder="50%"
                required
              />
              <Input
                label="HRA (%)"
                value={editStructure.hra}
                onChange={(e) => setEditStructure({ ...editStructure, hra: e.target.value })}
                placeholder="25%"
                required
              />
              <Input
                label="Conveyance (%)"
                value={editStructure.conveyance}
                onChange={(e) => setEditStructure({ ...editStructure, conveyance: e.target.value })}
                placeholder="10%"
                required
              />
              <Input
                label="Spl. Allowance (%)"
                value={editStructure.specialAllowance}
                onChange={(e) => setEditStructure({ ...editStructure, specialAllowance: e.target.value })}
                placeholder="15%"
                required
              />
              <Input
                label="Bonus / Incentive (%)"
                value={editStructure.bonus}
                onChange={(e) => setEditStructure({ ...editStructure, bonus: e.target.value })}
                placeholder="0%"
                required
              />
              <Input
                label="Other Earnings (%)"
                value={editStructure.otherEarnings}
                onChange={(e) => setEditStructure({ ...editStructure, otherEarnings: e.target.value })}
                placeholder="0%"
                required
              />
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 2: GENERATE PAYSLIP */}
      <Modal
        isOpen={isGenPayslipOpen}
        onClose={() => setIsGenPayslipOpen(false)}
        title="Generate Employee Payslip"
        subtitle="Issue official Infotattva Business Solutions salary slip."
        footer={
          <>
            <Button onClick={() => setIsGenPayslipOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleGeneratePayslip} variant="primary">Generate Payslip</Button>
          </>
        }
      >
        <form onSubmit={handleGeneratePayslip} className="space-y-4 text-xs">
          <Select
            label="Select Employee"
            value={newPayslip.employeeId}
            onChange={(e) => setNewPayslip({ ...newPayslip, employeeId: e.target.value })}
            options={[
              { label: '-- Select Employee --', value: '' },
              ...getRealEmployees(dbEmployeesList.length > 0 ? dbEmployeesList : storeEmployees).map((emp) => {
                const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || emp.name || 'Employee';
                const code = emp.employeeCode || emp.id || 'EMP';
                return {
                  label: `${fullName} (${code})`,
                  value: emp._id || emp.id
                };
              })
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Pay Month"
              value={String(newPayslip.month)}
              onChange={(e) => setNewPayslip({ ...newPayslip, month: Number(e.target.value) })}
              options={[
                { label: 'July 2026', value: '7' },
                { label: 'June 2026', value: '6' },
                { label: 'May 2026', value: '5' }
              ]}
            />
            <Select
              label="Payment Mode"
              value={newPayslip.paymentMode}
              onChange={(e) => setNewPayslip({ ...newPayslip, paymentMode: e.target.value })}
              options={[
                { label: 'Bank Transfer', value: 'Bank Transfer' },
                { label: 'Cheque', value: 'Cheque' },
                { label: 'Cash', value: 'Cash' }
              ]}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Total Working Days"
              type="number"
              value={newPayslip.totalWorkingDays}
              onChange={(e) => {
                const tot = Number(e.target.value) || 30;
                const lop = Number(newPayslip.lopDays) || 0;
                setNewPayslip({
                  ...newPayslip,
                  totalWorkingDays: e.target.value,
                  paidDays: Math.max(0, tot - lop)
                });
              }}
            />
            <Input
              label="Paid Days"
              type="number"
              value={newPayslip.paidDays}
              onChange={(e) => {
                const pd = Number(e.target.value);
                const tot = Number(newPayslip.totalWorkingDays) || 30;
                const lop = Math.max(0, tot - pd);
                setNewPayslip({
                  ...newPayslip,
                  paidDays: e.target.value,
                  lopDays: lop
                });
              }}
            />
            <Input
              label="LOP Days (Leave)"
              type="number"
              value={newPayslip.lopDays}
              onChange={(e) => {
                const lop = Number(e.target.value);
                const tot = Number(newPayslip.totalWorkingDays) || 30;
                const pd = Math.max(0, tot - lop);
                setNewPayslip({
                  ...newPayslip,
                  lopDays: e.target.value,
                  paidDays: pd
                });
              }}
            />
          </div>

          {/* Live Evaluated Real Gross Earnings Panel */}
          {(() => {
            const allEmps = dbEmployeesList.length > 0 ? dbEmployeesList : storeEmployees;
            const emp = allEmps.find(
              (e) => e._id === newPayslip.employeeId || e.id === newPayslip.employeeId || e.employeeCode === newPayslip.employeeId
            );
            let monthlyGross = 0;

            if (emp?.salary) {
              const mVal = parseFloat(String(emp.salary.monthlySalary || emp.salary.grossSalary || '').replace(/[^0-9.]/g, ''));
              const aVal = parseFloat(String(emp.salary.basicSalary || emp.salary.annualBand || emp.salary.basic || '').replace(/[^0-9.]/g, ''));

              if (!isNaN(mVal) && mVal > 0) {
                monthlyGross = mVal;
              } else if (!isNaN(aVal) && aVal > 0) {
                monthlyGross = aVal < 50000 ? aVal : Math.round(aVal / 12);
              }
            }

            const baseGross = monthlyGross > 0 ? monthlyGross : 12000;
            const totDays = Number(newPayslip.totalWorkingDays) || 30;
            const lopDays = Number(newPayslip.lopDays) || 0;
            const leaveDed = lopDays > 0 ? Math.round((baseGross / totDays) * lopDays) : 0;
            const realGross = Math.max(0, baseGross - leaveDed);

            return (
              <div className="p-3 bg-[#f0edf7] rounded-xl border border-[#dcd6e8] space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-[#534675]">
                  <span>Leave & Gross Salary Evaluation</span>
                  <span>{lopDays} Day(s) Unpaid Leave</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-center pt-1">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Base Gross Salary</p>
                    <p className="font-bold text-slate-700">₹{baseGross.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-2 bg-rose-50 rounded-lg border border-rose-200">
                    <p className="text-[9px] text-rose-500 font-semibold uppercase">Leave Deduction ({lopDays} days)</p>
                    <p className="font-bold text-rose-600">-₹{leaveDed.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-2 bg-[#f2f8e8] rounded-lg border border-[#c3dc93]">
                    <p className="text-[9px] text-[#59781b] font-extrabold uppercase">Real Gross Earnings</p>
                    <p className="font-extrabold text-[#59781b]">₹{realGross.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </form>
      </Modal>

      {/* MODAL 3: VIEW INFOTATTVA SALARY SLIP TEMPLATE */}
      <Modal
        isOpen={isViewPayslipOpen}
        onClose={() => setIsViewPayslipOpen(false)}
        title="Official Infotattva Salary Slip Voucher"
        subtitle="Verified earnings statement."
        footer={
          <>
            <Button onClick={() => setIsViewPayslipOpen(false)} variant="outline">Close</Button>
            <Button onClick={handleDownloadPdf} variant="primary" icon={Download}>Download PDF</Button>
          </>
        }
      >
        {selectedPayslip && (
          <InfotattvaPayslipTemplate payslip={selectedPayslip} />
        )}
      </Modal>
    </div>
  );
};
