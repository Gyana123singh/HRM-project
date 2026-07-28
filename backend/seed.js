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
      name: 'Epic Corporation Inc.',
      taxId: 'TAX-99882211-US',
      email: 'hr@epiccorp.com',
      phone: '+1 (555) 234-5678',
      website: 'https://epiccorp.global',
      currency: 'USD ($)',
      address: '100 Innovation Boulevard, Tech Park Tower A, Suite 500, San Francisco, CA',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80',
      fiscalYear: '2026-2027'
    });

    console.log('[Seeder] Seeding Branch Offices...');
    await Branch.create([
      { branchId: 'BR-01', name: 'Global Headquarters', location: 'San Francisco, CA, USA', head: 'Sarah Jenkins', employeeCount: 140, status: 'Active' },
      { branchId: 'BR-02', name: 'Austin Innovation Hub', location: 'Austin, TX, USA', head: 'Alex Vance', employeeCount: 85, status: 'Active' },
      { branchId: 'BR-03', name: 'EMEA Technology Center', location: 'London, UK', head: 'Claire Dupont', employeeCount: 62, status: 'Active' }
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

    console.log('[Seeder] Seeding Onboarding Trackers...');
    await Onboarding.create([
      { onboardingId: 'ONB-01', employee: 'Rahul Sharma', mentor: 'Sarah Jenkins', progress: 85, completed: 7, total: 8, status: 'In Progress' },
      { onboardingId: 'ONB-02', employee: 'Jessica Lin', mentor: 'Alex Vance', progress: 100, completed: 8, total: 8, status: 'Completed' },
      { onboardingId: 'ONB-03', employee: 'Michael Chang', mentor: 'Marcus Vance', progress: 40, completed: 3, total: 8, status: 'In Progress' }
    ]);

    console.log('[Seeder] Seeding Performance Appraisal Reviews...');
    await PerformanceReview.create([
      { reviewId: 'REV-01', employee: 'Rahul Sharma', reviewer: 'Alex Vance (VP Eng)', period: 'Q2 2026 Appraisal', rating: '4.8 / 5.0', status: 'Completed', remarks: 'Outstanding delivery on frontend design system and performance.' },
      { reviewId: 'REV-02', employee: 'Sarah Jenkins', reviewer: 'Executive Board', period: 'Annual Leadership 2026', rating: '4.9 / 5.0', status: 'Completed', remarks: 'Superb talent retention and organizational culture scaling.' },
      { reviewId: 'REV-03', employee: 'Michael Chang', reviewer: 'Alex Vance (VP Eng)', period: 'Probation Confirmation', rating: '4.5 / 5.0', status: 'Pending', remarks: 'Strong DevOps technical skills, finalizing 6-month review.' }
    ]);

    console.log('[Seeder] Seeding Goals & OKRs...');
    await Goal.create([
      { goalId: 'G-101', title: 'Achieve 99.99% Cloud Service Availability & Uptime', owner: 'Alex Vance', target: '99.99%', progress: 92, weight: '35%', deadline: '2026-09-30', status: 'In Progress' },
      { goalId: 'G-102', title: 'Complete Migration to React Tailwind Design System', owner: 'Rahul Sharma', target: '100%', progress: 85, weight: '30%', deadline: '2026-08-15', status: 'In Progress' },
      { goalId: 'G-103', title: 'Reduce Average Employee Onboarding Time to 3 Days', owner: 'Sarah Jenkins', target: '3 Days', progress: 100, weight: '25%', deadline: '2026-06-30', status: 'Completed' }
    ]);

    console.log('[Seeder] Seeding Kudos & Recognition...');
    await Kudos.create([
      { kudosId: 'KUD-01', recipient: 'Rahul Sharma', sender: 'Sarah Jenkins', badge: 'Innovation Star Award', points: '+500 Pts', message: 'Exceptional work re-architecting the enterprise HRM design system!', time: '2 hours ago' },
      { kudosId: 'KUD-02', recipient: 'Sophia Martinez', sender: 'Elena Rostova', badge: 'Team Player Badge', points: '+250 Pts', message: 'Fantastic UX research insights that shaped our Q3 product roadmap.', time: '1 day ago' },
      { kudosId: 'KUD-03', recipient: 'Michael Chang', sender: 'Alex Vance', badge: 'Customer Champion', points: '+300 Pts', message: 'Resolved high-priority production infrastructure emergency in record time!', time: '2 days ago' }
    ]);

    console.log('[Seeder] Creating Employees and Users...');

    // 1. Admin Account
    const adminEmp = await Employee.create({
      employeeCode: 'EMP-001',
      firstName: 'System',
      lastName: 'Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@hrm.com',
      phone: '+1 (555) 019-2831',
      department: hrDept._id,
      designation: 'System Administrator',
      joiningDate: new Date('2024-01-15'),
      employmentType: 'Full-time',
      status: 'Active',
      salary: { basic: 90000, allowances: { hra: 18000, medical: 3000, transport: 2000 } }
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
      employeeCode: 'EMP-002',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: process.env.HR_EMAIL || 'hr@hrm.com',
      phone: '+1 (555) 012-3456',
      department: hrDept._id,
      designation: 'HR Manager',
      joiningDate: new Date('2024-03-01'),
      employmentType: 'Full-time',
      status: 'Active',
      salary: { basic: 75000, allowances: { hra: 15000, medical: 2500, transport: 2000 } }
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

    // Link HR manager to Department
    hrDept.manager = hrEmp._id;
    await hrDept.save();

    // 3. Regular Employee Account
    const devEmp = await Employee.create({
      employeeCode: 'EMP-003',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: process.env.EMPLOYEE_EMAIL || 'employee@hrm.com',
      phone: '+1 (555) 018-9922',
      department: engDept._id,
      designation: 'Senior Frontend Developer',
      joiningDate: new Date('2024-06-10'),
      employmentType: 'Full-time',
      status: 'Active',
      managerId: hrEmp._id,
      salary: { basic: 65000, allowances: { hra: 13000, medical: 2000, transport: 1500 } }
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
