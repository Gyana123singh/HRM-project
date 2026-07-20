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

    console.log('[Seeder] Creating Departments...');
    const hrDept = await Department.create({
      name: 'Human Resources',
      code: 'HR',
      description: 'Manages employee relations, hiring, and payroll.'
    });

    const engDept = await Department.create({
      name: 'Engineering',
      code: 'ENG',
      description: 'Software development and infrastructure management.'
    });

    const finDept = await Department.create({
      name: 'Finance',
      code: 'FIN',
      description: 'Accounting, compensation, and financial reporting.'
    });

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
      employeeId: devEmp._id
    });

    devEmp.userId = devUser._id;
    await devEmp.save();

    console.log('[Seeder] Creating Sample Attendance...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Attendance.create({
      employeeId: devEmp._id,
      date: today,
      checkIn: new Date(Date.now() - 5 * 3600 * 1000), // 5 hours ago
      status: 'Present',
      workLocation: 'Office'
    });

    await Attendance.create({
      employeeId: hrEmp._id,
      date: today,
      checkIn: new Date(Date.now() - 6 * 3600 * 1000),
      status: 'Present',
      workLocation: 'Office'
    });

    console.log('[Seeder] Creating Sample Leave Requests...');
    await Leave.create({
      employeeId: devEmp._id,
      leaveType: 'Casual',
      startDate: new Date(Date.now() + 86400000 * 3),
      endDate: new Date(Date.now() + 86400000 * 5),
      totalDays: 2,
      reason: 'Family event vacation',
      status: 'Pending'
    });

    console.log('[Seeder] Creating Job Postings...');
    const job1 = await JobPosting.create({
      title: 'Senior Full Stack Engineer (React/Node)',
      department: engDept._id,
      location: 'Hybrid',
      type: 'Full-time',
      experience: '3-5 years',
      description: 'We are seeking a talented Full Stack Engineer to lead web app development.',
      requirements: ['Node.js', 'React.js', 'MongoDB', 'REST APIs'],
      salaryRange: { min: 80000, max: 110000 },
      status: 'Open',
      postedBy: hrUser._id
    });

    console.log('[Seeder] Creating Candidates...');
    await Candidate.create({
      jobId: job1._id,
      fullName: 'David Miller',
      email: 'david.miller@example.com',
      phone: '+1 (555) 321-7788',
      status: 'Applied'
    });

    await Candidate.create({
      jobId: job1._id,
      fullName: 'Emily Watson',
      email: 'emily.watson@example.com',
      phone: '+1 (555) 987-1122',
      status: 'Interviewed',
      notes: 'Passed technical screening with high score.'
    });

    console.log('[Seeder] Creating Sample Payslip...');
    await Payroll.create({
      employeeId: devEmp._id,
      month: 6,
      year: 2026,
      baseSalary: 65000,
      allowances: { hra: 13000, medical: 2000, transport: 1500 },
      deductions: { tax: 8150, providentFund: 3250 },
      grossSalary: 81500,
      netSalary: 70100,
      paymentStatus: 'Paid',
      paymentDate: new Date('2026-06-30')
    });

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('----------------------------------------------------');
    console.log('🔑 CREATED ACCOUNTS FOR TESTING:');
    console.log(`1. ADMIN:    Email: ${process.env.ADMIN_EMAIL || 'admin@hrm.com'} | Password: ${process.env.ADMIN_PASSWORD || 'AdminPass123!'}`);
    console.log(`2. HR:       Email: ${process.env.HR_EMAIL || 'hr@hrm.com'}    | Password: ${process.env.HR_PASSWORD || 'HrPass123!'}`);
    console.log(`3. EMPLOYEE: Email: ${process.env.EMPLOYEE_EMAIL || 'employee@hrm.com'} | Password: ${process.env.EMPLOYEE_PASSWORD || 'EmpPass123!'}`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seedData();
