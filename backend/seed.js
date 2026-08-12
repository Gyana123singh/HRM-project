const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/User');
const Employee = require('./src/models/Employee');
const Department = require('./src/models/Department');
const Attendance = require('./src/models/Attendance');
const Leave = require('./src/models/Leave');
const Payroll = require('./src/models/Payroll');
const JobPosting = require('./src/models/JobPosting');
const Candidate = require('./src/models/Candidate');
const Organization = require('./src/models/Organization');
const Branch = require('./src/models/Branch');
const Designation = require('./src/models/Designation');
const SalaryStructure = require('./src/models/SalaryStructure');
const PerformanceReview = require('./src/models/PerformanceReview');
const Goal = require('./src/models/Goal');
const Kudos = require('./src/models/Kudos');
const Onboarding = require('./src/models/Onboarding');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hrm_db');
    console.log('[Seeder] Connected to MongoDB...');
  } catch (err) {
    console.error(`[Seeder Error] Connection failed: ${err.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Cleaning existing database collections...');
    await User.deleteMany();
    await Employee.deleteMany();
    await Department.deleteMany();
    await Attendance.deleteMany();
    await Leave.deleteMany();
    await Payroll.deleteMany();
    await JobPosting.deleteMany();
    await Candidate.deleteMany();
    await Organization.deleteMany();
    await Branch.deleteMany();
    await Designation.deleteMany();
    await SalaryStructure.deleteMany();
    await PerformanceReview.deleteMany();
    await Goal.deleteMany();
    await Kudos.deleteMany();
    await Onboarding.deleteMany();

    console.log('[Seeder] Seeding Company Organization Profile...');
    await Organization.create({
      name: 'INFOTATTVA BUSINESS SOLUTIONS (OPC) PRIVATE LIMITED',
      taxId: 'CIN: U62099OD2026OPC052146',
      email: 'contact@infotattvabusinesssolutions.com',
      phone: '+91 (674) 258-9900',
      website: 'www.infotattvabusinesssolutions.com',
      currency: 'INR (₹)',
      address: '1010, 4th Floor, Sabarsahi Lane, Rasulgarh, Bhubaneswar - 751010',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80',
      fiscalYear: '2026-2027'
    });

    console.log('[Seeder] Seeding Salary Structures...');
    await SalaryStructure.create([
      { structureId: 'STR-01', name: 'Executive Level (L7)', band: '₹18,00,000 - ₹30,00,000 / Annum', basic: '50%', hra: '20%', conveyance: '10%', specialAllowance: '10%', bonus: '5%', otherEarnings: '5%', deductions: '10%', membersCount: 5, status: 'Active' },
      { structureId: 'STR-02', name: 'Senior Engineering (L5)', band: '₹12,00,000 - ₹18,00,000 / Annum', basic: '50%', hra: '20%', conveyance: '10%', specialAllowance: '10%', bonus: '5%', otherEarnings: '5%', deductions: '10%', membersCount: 18, status: 'Active' },
      { structureId: 'STR-03', name: 'Mid-Level Professional (L4)', band: '₹6,00,000 - ₹12,00,000 / Annum', basic: '50%', hra: '20%', conveyance: '10%', specialAllowance: '10%', bonus: '5%', otherEarnings: '5%', deductions: '10%', membersCount: 42, status: 'Active' },
      { structureId: 'STR-04', name: 'Associate Band (L2-L3)', band: '₹3,50,000 - ₹6,00,000 / Annum', basic: '50%', hra: '20%', conveyance: '10%', specialAllowance: '10%', bonus: '5%', otherEarnings: '5%', deductions: '10%', membersCount: 25, status: 'Active' }
    ]);

    console.log('[Seeder] Seeding Branch Offices...');
    await Branch.create([
      { branchId: 'BR-01', name: 'Bhubaneswar HQ', location: 'Rasulgarh, Bhubaneswar, Odisha', head: 'J. P. Tripathy', employeeCount: 140, status: 'Active' },
      { branchId: 'BR-02', name: 'Bengaluru Tech Hub', location: 'Koramangala, Bengaluru, KA', head: 'Sarah Jenkins', employeeCount: 85, status: 'Active' }
    ]);

    console.log('[Seeder] Seeding Departments...');
    const hrDept = await Department.create({
      name: 'Human Resources',
      code: 'HR',
      head: 'Sarah Jenkins',
      description: 'Manages employee relations, talent acquisition, performance, and payroll.',
      employeeCount: 12,
      status: 'Active'
    });

    const engDept = await Department.create({
      name: 'Engineering',
      code: 'ENG',
      head: 'Marcus Vance',
      description: 'Software development, cloud architecture, machine learning, and DevOps.',
      employeeCount: 84,
      status: 'Active'
    });

    console.log('[Seeder] Creating Employees and Users...');

    // 1. Admin Account
    const adminEmp = await Employee.create({
      employeeCode: 'EMP-0001',
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: process.env.ADMIN_EMAIL || 'admin@hrm.com',
      phone: '+91 98765 43210',
      department: engDept._id,
      designation: 'Senior Software Engineer',
      joiningDate: new Date('2023-06-12'),
      employmentType: 'Full-time',
      status: 'Active',
      panNumber: 'ABCDE1234F',
      workLocation: 'Bhubaneswar',
      bankName: 'HDFC Bank',
      accountNumber: '5010049281723',
      salary: {
        basic: 35000,
        hra: 14000,
        conveyance: 3000,
        specialAllowance: 5000,
        bonus: 2000,
        otherEarnings: 1000,
        deductions: 4000
      }
    });

    const adminUser = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@hrm.com',
      password: process.env.ADMIN_PASSWORD || 'AdminPass123!',
      role: 'Admin',
      isActive: true,
      employeeId: adminEmp._id
    });

    adminEmp.userId = adminUser._id;
    await adminEmp.save();

    // 2. HR Manager Account
    const hrEmp = await Employee.create({
      employeeCode: 'EMP-0002',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: process.env.HR_EMAIL || 'hr@hrm.com',
      phone: '+91 98765 12345',
      department: hrDept._id,
      designation: 'HR Operations Manager',
      joiningDate: new Date('2024-03-01'),
      employmentType: 'Full-time',
      status: 'Active',
      panNumber: 'FGHIJ5678K',
      workLocation: 'Bhubaneswar',
      bankName: 'ICICI Bank',
      accountNumber: '629101928374',
      salary: {
        basic: 40000,
        hra: 16000,
        conveyance: 3500,
        specialAllowance: 6000,
        bonus: 2500,
        otherEarnings: 1500,
        deductions: 4500
      }
    });

    const hrUser = await User.create({
      email: process.env.HR_EMAIL || 'hr@hrm.com',
      password: process.env.HR_PASSWORD || 'HrPass123!',
      role: 'HR',
      isActive: true,
      employeeId: hrEmp._id
    });

    hrEmp.userId = hrUser._id;
    await hrEmp.save();

    // 3. Regular Employee Account
    const devEmp = await Employee.create({
      employeeCode: 'EMP-0003',
      firstName: 'Alex',
      lastName: 'Vance',
      email: process.env.EMPLOYEE_EMAIL || 'employee@hrm.com',
      phone: '+91 98765 67890',
      department: engDept._id,
      designation: 'Backend Tech Lead',
      joiningDate: new Date('2024-06-10'),
      employmentType: 'Full-time',
      status: 'Active',
      managerId: hrEmp._id,
      panNumber: 'KLMNO9012P',
      workLocation: 'Remote',
      bankName: 'State Bank of India',
      accountNumber: '38192019283',
      salary: {
        basic: 45000,
        hra: 18000,
        conveyance: 4000,
        specialAllowance: 7000,
        bonus: 3000,
        otherEarnings: 2000,
        deductions: 5000
      }
    });

    const devUser = await User.create({
      email: process.env.EMPLOYEE_EMAIL || 'employee@hrm.com',
      password: process.env.EMPLOYEE_PASSWORD || 'EmpPass123!',
      role: 'Employee',
      isActive: true,
      employeeId: devEmp._id
    });

    devEmp.userId = devUser._id;
    await devEmp.save();

    console.log('[Seeder] Seeding Payroll Slips...');
    await Payroll.create([
      {
        employeeId: adminEmp._id,
        month: 7,
        year: 2026,
        payDate: new Date('2026-07-28'),
        panNumber: 'ABCDE1234F',
        workLocation: 'Bhubaneswar',
        bankName: 'HDFC Bank',
        accountNumber: '5010049281723',
        totalWorkingDays: 30,
        paidDays: 30,
        lopDays: 0,
        basic: 35000,
        hra: 14000,
        conveyance: 3000,
        specialAllowance: 5000,
        bonus: 2000,
        otherEarnings: 1000,
        grossSalary: 60000,
        deductions: { tax: 3000, providentFund: 4200, other: 1000, totalDeductions: 8200 },
        netSalary: 51800,
        amountInWords: 'Indian Rupees Fifty One Thousand Eight Hundred Only',
        paymentMode: 'Bank Transfer',
        transactionRef: 'TXN-982710492',
        paymentStatus: 'Paid'
      },
      {
        employeeId: hrEmp._id,
        month: 7,
        year: 2026,
        payDate: new Date('2026-07-28'),
        panNumber: 'FGHIJ5678K',
        workLocation: 'Bhubaneswar',
        bankName: 'ICICI Bank',
        accountNumber: '629101928374',
        totalWorkingDays: 30,
        paidDays: 30,
        lopDays: 0,
        basic: 40000,
        hra: 16000,
        conveyance: 3500,
        specialAllowance: 6000,
        bonus: 2500,
        otherEarnings: 1500,
        grossSalary: 69500,
        deductions: { tax: 3475, providentFund: 4800, other: 1225, totalDeductions: 9500 },
        netSalary: 60000,
        amountInWords: 'Indian Rupees Sixty Thousand Only',
        paymentMode: 'Bank Transfer',
        transactionRef: 'TXN-982710493',
        paymentStatus: 'Paid'
      }
    ]);

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedData();
