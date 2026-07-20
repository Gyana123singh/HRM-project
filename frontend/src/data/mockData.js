// Comprehensive Mock Data for HRM/HRMS System

export const currentUserHRAdmin = {
  id: "EMP-1001",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@nexus.com",
  role: "hr_admin",
  designation: "Chief Human Resources Officer",
  department: "Human Resources",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  branch: "Headquarters (New York)",
  joinDate: "2021-03-15",
  phone: "+1 (555) 234-5678",
  status: "Active"
};

export const currentUserEmployee = {
  id: "EMP-1024",
  name: "Rahul Sharma",
  email: "rahul.sharma@nexus.com",
  role: "employee",
  designation: "Senior Frontend Developer",
  department: "Engineering",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  branch: "Headquarters (New York)",
  joinDate: "2023-06-12",
  phone: "+1 (555) 987-6543",
  status: "Active",
  reportingManager: "Alex Vance (VP Engineering)",
  shift: "General (09:00 AM - 06:00 PM)",
  location: "New York, USA",
  leaveBalances: {
    casual: 6,
    sick: 4,
    earned: 12,
    maternity: 0,
    paternity: 0
  },
  financials: {
    basic: 65000,
    hra: 26000,
    allowances: 14000,
    bonus: 5000,
    deductions: 7500,
    netPay: 102500,
    bankName: "Chase Bank",
    accountNo: "•••• •••• 8842",
    ifsc: "CHAS000912"
  }
};

export const organizationProfile = {
  name: "Nexus Global Technologies",
  taxId: "TX-99482710-X",
  email: "hr@nexusglobal.com",
  phone: "+1 (800) 555-0199",
  website: "https://nexusglobal.example.com",
  address: "750 Lexington Ave, Suite 1400, New York, NY 10022",
  currency: "USD ($)",
  fiscalYear: "Jan - Dec",
  timeZone: "EST (UTC-5)",
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80"
};

export const branches = [
  { id: "BR-01", name: "Headquarters", location: "New York, USA", employeeCount: 142, head: "Sarah Jenkins", status: "Active" },
  { id: "BR-02", name: "Silicon Valley Hub", location: "San Francisco, USA", employeeCount: 88, head: "David Chen", status: "Active" },
  { id: "BR-03", name: "European Ops", location: "London, UK", employeeCount: 54, head: "Emma Watson", status: "Active" },
  { id: "BR-04", name: "APAC Tech Center", location: "Bengaluru, India", employeeCount: 110, head: "Priya Patel", status: "Active" }
];

export const departments = [
  { id: "DEP-01", name: "Engineering", head: "Alex Vance", employeeCount: 120, description: "Software development, DevOps, and Quality Assurance", status: "Active" },
  { id: "DEP-02", name: "Human Resources", head: "Sarah Jenkins", employeeCount: 15, description: "Talent acquisition, operations, and culture", status: "Active" },
  { id: "DEP-03", name: "Product & Design", head: "Elena Rostova", employeeCount: 32, description: "Product management, UI/UX, and research", status: "Active" },
  { id: "DEP-04", name: "Sales & Marketing", head: "Marcus Sterling", employeeCount: 65, description: "Enterprise sales, growth, and brand strategy", status: "Active" },
  { id: "DEP-05", name: "Finance & Legal", head: "Robert Taylor", employeeCount: 18, description: "Financial planning, accounting, and compliance", status: "Active" },
  { id: "DEP-06", name: "Customer Success", head: "Jessica Alba", employeeCount: 44, description: "Support, client onboarding, and retention", status: "Active" }
];

export const designations = [
  { id: "DES-01", name: "VP of Engineering", department: "Engineering", level: "L7", employeeCount: 2 },
  { id: "DES-02", name: "Senior Frontend Developer", department: "Engineering", level: "L5", employeeCount: 18 },
  { id: "DES-03", name: "Full Stack Engineer", department: "Engineering", level: "L4", employeeCount: 34 },
  { id: "DES-04", name: "HR Operations Manager", department: "Human Resources", level: "L5", employeeCount: 4 },
  { id: "DES-05", name: "Senior Product Designer", department: "Product & Design", level: "L5", employeeCount: 8 },
  { id: "DES-06", name: "Enterprise Account Executive", department: "Sales & Marketing", level: "L4", employeeCount: 22 }
];

export const orgChartData = {
  name: "Sarah Jenkins",
  title: "Chief Human Resources Officer",
  avatar: currentUserHRAdmin.avatar,
  department: "Executive",
  children: [
    {
      name: "Alex Vance",
      title: "VP of Engineering",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      department: "Engineering",
      children: [
        { name: "Rahul Sharma", title: "Senior Frontend Developer", avatar: currentUserEmployee.avatar, department: "Engineering" },
        { name: "Jessica Lin", title: "Lead Backend Developer", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", department: "Engineering" },
        { name: "Michael Chang", title: "DevOps Architect", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", department: "Engineering" }
      ]
    },
    {
      name: "Elena Rostova",
      title: "Head of Product",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      department: "Product",
      children: [
        { name: "David Miller", title: "Senior Product Manager", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", department: "Product" },
        { name: "Sophia Martinez", title: "Lead UX Researcher", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80", department: "Product" }
      ]
    },
    {
      name: "Marcus Sterling",
      title: "VP of Global Sales",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      department: "Sales",
      children: [
        { name: "Amanda Hayes", title: "Regional Sales Director", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80", department: "Sales" }
      ]
    }
  ]
};

export const employeesList = [
  {
    id: "EMP-1024",
    name: "Rahul Sharma",
    email: "rahul.sharma@nexus.com",
    department: "Engineering",
    designation: "Senior Frontend Developer",
    branch: "Headquarters",
    joinDate: "2023-06-12",
    employmentType: "Full-Time",
    status: "Active",
    avatar: currentUserEmployee.avatar,
    phone: "+1 (555) 987-6543",
    salary: "$110,000",
    manager: "Alex Vance",
    performanceRating: "4.8/5"
  },
  {
    id: "EMP-1001",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@nexus.com",
    department: "Human Resources",
    designation: "Chief HR Officer",
    branch: "Headquarters",
    joinDate: "2021-03-15",
    employmentType: "Full-Time",
    status: "Active",
    avatar: currentUserHRAdmin.avatar,
    phone: "+1 (555) 234-5678",
    salary: "$160,000",
    manager: "CEO Board",
    performanceRating: "4.9/5"
  },
  {
    id: "EMP-1002",
    name: "Alex Vance",
    email: "alex.vance@nexus.com",
    department: "Engineering",
    designation: "VP of Engineering",
    branch: "Headquarters",
    joinDate: "2020-01-10",
    employmentType: "Full-Time",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 345-6789",
    salary: "$185,000",
    manager: "CEO Board",
    performanceRating: "5.0/5"
  },
  {
    id: "EMP-1003",
    name: "Jessica Lin",
    email: "jessica.lin@nexus.com",
    department: "Engineering",
    designation: "Lead Backend Developer",
    branch: "Silicon Valley Hub",
    joinDate: "2022-09-01",
    employmentType: "Full-Time",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 456-7890",
    salary: "$135,000",
    manager: "Alex Vance",
    performanceRating: "4.7/5"
  },
  {
    id: "EMP-1004",
    name: "Elena Rostova",
    email: "elena.rostova@nexus.com",
    department: "Product & Design",
    designation: "Head of Product",
    branch: "European Ops",
    joinDate: "2021-11-20",
    employmentType: "Full-Time",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    phone: "+44 20 7946 0912",
    salary: "$150,000",
    manager: "CEO Board",
    performanceRating: "4.8/5"
  },
  {
    id: "EMP-1005",
    name: "Michael Chang",
    email: "michael.chang@nexus.com",
    department: "Engineering",
    designation: "DevOps Architect",
    branch: "Silicon Valley Hub",
    joinDate: "2024-01-15",
    employmentType: "Full-Time",
    status: "Probation",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 567-8901",
    salary: "$125,000",
    manager: "Alex Vance",
    performanceRating: "4.5/5"
  },
  {
    id: "EMP-1006",
    name: "Sophia Martinez",
    email: "sophia.m@nexus.com",
    department: "Product & Design",
    designation: "Lead UX Researcher",
    branch: "Headquarters",
    joinDate: "2023-02-01",
    employmentType: "Full-Time",
    status: "On Leave",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 678-9012",
    salary: "$115,000",
    manager: "Elena Rostova",
    performanceRating: "4.6/5"
  },
  {
    id: "EMP-1007",
    name: "Daniel Kim",
    email: "daniel.kim@nexus.com",
    department: "Sales & Marketing",
    designation: "Account Executive",
    branch: "APAC Tech Center",
    joinDate: "2024-04-10",
    employmentType: "Full-Time",
    status: "Notice Period",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98765 43210",
    salary: "$95,000",
    manager: "Marcus Sterling",
    performanceRating: "3.9/5"
  }
];

export const attendanceLogsToday = [
  { id: "ATT-01", employeeId: "EMP-1024", name: "Rahul Sharma", checkIn: "09:02 AM", checkOut: "--", hours: "6h 25m", status: "Present", lateBy: "2 mins", overtime: "0m" },
  { id: "ATT-02", employeeId: "EMP-1001", name: "Sarah Jenkins", checkIn: "08:50 AM", checkOut: "--", hours: "6h 37m", status: "Present", lateBy: "0 mins", overtime: "30m" },
  { id: "ATT-03", employeeId: "EMP-1002", name: "Alex Vance", checkIn: "09:15 AM", checkOut: "--", hours: "6h 12m", status: "Late", lateBy: "15 mins", overtime: "0m" },
  { id: "ATT-04", employeeId: "EMP-1003", name: "Jessica Lin", checkIn: "08:55 AM", checkOut: "--", hours: "6h 32m", status: "Present", lateBy: "0 mins", overtime: "45m" },
  { id: "ATT-05", employeeId: "EMP-1006", name: "Sophia Martinez", checkIn: "--", checkOut: "--", hours: "0h", status: "On Leave", lateBy: "0 mins", overtime: "0m" },
  { id: "ATT-06", employeeId: "EMP-1007", name: "Daniel Kim", checkIn: "09:30 AM", checkOut: "--", hours: "5h 57m", status: "Late", lateBy: "30 mins", overtime: "0m" }
];

export const regularizationRequests = [
  { id: "REG-101", employeeId: "EMP-1024", name: "Rahul Sharma", date: "2026-07-16", originalCheckIn: "10:15 AM", requestedCheckIn: "09:00 AM", reason: "Client emergency call from home before commute", status: "Pending" },
  { id: "REG-102", employeeId: "EMP-1005", name: "Michael Chang", date: "2026-07-14", originalCheckIn: "--", requestedCheckIn: "09:05 AM", reason: "Biometric scanner card failure", status: "Approved" }
];

export const leaveRequests = [
  { id: "LR-501", employeeId: "EMP-1024", employeeName: "Rahul Sharma", leaveType: "Casual Leave", startDate: "2026-07-28", endDate: "2026-07-29", totalDays: 2, reason: "Family event & personal travel", status: "Pending", appliedDate: "2026-07-19" },
  { id: "LR-502", employeeId: "EMP-1006", employeeName: "Sophia Martinez", leaveType: "Paid Leave", startDate: "2026-07-18", endDate: "2026-07-22", totalDays: 5, reason: "Medical recovery", status: "Approved", appliedDate: "2026-07-15" },
  { id: "LR-503", employeeId: "EMP-1007", employeeName: "Daniel Kim", leaveType: "Sick Leave", startDate: "2026-07-20", endDate: "2026-07-20", totalDays: 1, reason: "Severe headache", status: "Approved", appliedDate: "2026-07-20" }
];

export const holidays = [
  { id: "HOL-01", title: "Independence Day", date: "2026-07-04", type: "National Holiday", day: "Saturday" },
  { id: "HOL-02", title: "Labor Day", date: "2026-09-07", type: "Public Holiday", day: "Monday" },
  { id: "HOL-03", title: "Thanksgiving Day", date: "2026-11-26", type: "Public Holiday", day: "Thursday" },
  { id: "HOL-04", title: "Christmas Day", date: "2026-12-25", type: "Company Holiday", day: "Friday" }
];

export const payrollData = {
  currentMonth: "July 2026",
  totalBudget: "$485,000",
  processedCount: 389,
  pendingCount: 12,
  status: "In Review",
  recentPayslips: [
    { id: "PAY-701", month: "June 2026", netSalary: "$8,541.66", basic: "$5,416.66", hra: "$2,166.66", deductions: "$625.00", status: "Paid", downloadUrl: "#" },
    { id: "PAY-700", month: "May 2026", netSalary: "$8,541.66", basic: "$5,416.66", hra: "$2,166.66", deductions: "$625.00", status: "Paid", downloadUrl: "#" },
    { id: "PAY-699", month: "April 2026", netSalary: "$8,541.66", basic: "$5,416.66", hra: "$2,166.66", deductions: "$625.00", status: "Paid", downloadUrl: "#" }
  ]
};

export const jobsList = [
  { id: "JOB-201", title: "Senior React Developer", department: "Engineering", location: "New York (Hybrid)", type: "Full-Time", applicants: 42, status: "Open", postedDate: "2026-07-01", description: "Looking for an expert React / Vite developer to lead modern web applications." },
  { id: "JOB-202", title: "Staff DevOps Engineer", department: "Engineering", location: "Remote", type: "Full-Time", applicants: 28, status: "Open", postedDate: "2026-07-05", description: "AWS, Kubernetes, Terraform, and CI/CD automation master needed." },
  { id: "JOB-203", title: "Product Marketing Manager", department: "Sales & Marketing", location: "London, UK", type: "Full-Time", applicants: 19, status: "Closed", postedDate: "2026-06-15", description: "Drive go-to-market strategies for our B2B tech suite." }
];

export const recruitmentCandidates = [
  { id: "CAN-01", name: "David Wright", position: "Senior React Developer", stage: "Applied", rating: 4.5, matchScore: 92, email: "david.w@gmail.com", phone: "+1 (555) 111-2222", experience: "6 Years" },
  { id: "CAN-02", name: "Elena Gilbert", position: "Senior React Developer", stage: "Screening", rating: 4.8, matchScore: 88, email: "elena.g@yahoo.com", phone: "+1 (555) 333-4444", experience: "7 Years" },
  { id: "CAN-03", name: "Marcus Brody", position: "Staff DevOps Engineer", stage: "Shortlisted", rating: 4.2, matchScore: 85, email: "marcus.b@dev.io", phone: "+1 (555) 555-6666", experience: "8 Years" },
  { id: "CAN-04", name: "Samantha Reed", position: "Senior React Developer", stage: "Interview", rating: 4.9, matchScore: 96, email: "samantha.r@tech.com", phone: "+1 (555) 777-8888", experience: "5 Years" },
  { id: "CAN-05", name: "Kevin Sterling", position: "Staff DevOps Engineer", stage: "Offer", rating: 5.0, matchScore: 94, email: "kevin.s@cloud.net", phone: "+1 (555) 999-0000", experience: "10 Years" },
  { id: "CAN-06", name: "Nisha Patel", position: "Product Marketing Manager", stage: "Hired", rating: 4.7, matchScore: 90, email: "nisha.p@growth.org", phone: "+1 (555) 444-1111", experience: "4 Years" }
];

export const onboardingTasks = [
  { id: "OBT-01", employee: "Michael Chang", total: 10, completed: 8, progress: 80, mentor: "Alex Vance", status: "In Progress" },
  { id: "OBT-02", employee: "Daniel Kim", total: 10, completed: 10, progress: 100, mentor: "Sarah Jenkins", status: "Completed" }
];

export const goalsList = [
  { id: "G-101", title: "Migrate Micro-frontends to Vite & React 19", target: "100%", progress: 85, weight: "40%", deadline: "2026-09-30", owner: "Rahul Sharma", status: "In Progress" },
  { id: "G-102", title: "Reduce API Response Latency by 30%", target: "30%", progress: 60, weight: "30%", deadline: "2026-08-15", owner: "Rahul Sharma", status: "In Progress" },
  { id: "G-103", title: "Achieve 95% Unit Test Coverage across core UI", target: "95%", progress: 100, weight: "30%", deadline: "2026-07-01", owner: "Rahul Sharma", status: "Completed" }
];

export const projectsList = [
  { id: "PRJ-01", name: "HRMS Enterprise Portal v2", progress: 75, deadline: "2026-08-30", teamSize: 6, lead: "Rahul Sharma", status: "Active" },
  { id: "PRJ-02", name: "Cloud Infrastructure Modernization", progress: 40, deadline: "2026-10-15", teamSize: 4, lead: "Michael Chang", status: "Active" },
  { id: "PRJ-03", name: "Global Talent Re-branding", progress: 90, deadline: "2026-07-31", teamSize: 5, lead: "Sarah Jenkins", status: "Active" }
];

export const tasksList = [
  { id: "TSK-301", title: "Design Mobile Drawer Navigation", project: "HRMS Enterprise Portal v2", assignee: "Rahul Sharma", priority: "High", stage: "In Progress", dueDate: "2026-07-22" },
  { id: "TSK-302", title: "Integrate TanStack Table for Employee Directory", project: "HRMS Enterprise Portal v2", assignee: "Rahul Sharma", priority: "Medium", stage: "Done", dueDate: "2026-07-18" },
  { id: "TSK-303", title: "Configure Terraform Kubernetes Cluster", project: "Cloud Infrastructure Modernization", assignee: "Michael Chang", priority: "Urgent", stage: "To Do", dueDate: "2026-07-25" }
];

export const expenseClaims = [
  { id: "EXP-801", employeeName: "Rahul Sharma", category: "Client Dinner & Transport", amount: "$145.50", date: "2026-07-15", receipt: "receipt_715.pdf", status: "Pending", description: "Meeting with enterprise client leads at Manhattan Bistro." },
  { id: "EXP-802", employeeName: "Sophia Martinez", category: "UX Software Subscription", amount: "$89.00", date: "2026-07-10", receipt: "figma_invoice.pdf", status: "Approved", description: "Annual plugin access subscription." }
];

export const assetInventory = [
  { id: "AST-1024", name: "MacBook Pro 16\" M3 Max", category: "Laptop", assetId: "AST-1024", assignedTo: "Rahul Sharma", assignedDate: "2026-01-12", status: "Assigned" },
  { id: "AST-1025", name: "Dell UltraSharp 27\" 4K Monitor", category: "Monitor", assetId: "AST-1025", assignedTo: "Rahul Sharma", assignedDate: "2026-01-12", status: "Assigned" },
  { id: "AST-1026", name: "iPhone 15 Pro (Work Line)", category: "Mobile", assetId: "AST-1026", assignedTo: "Sarah Jenkins", assignedDate: "2025-05-10", status: "Assigned" },
  { id: "AST-1027", name: "YubiKey 5C NFC Security Key", category: "Security", assetId: "AST-1027", assignedTo: "Available Pool", assignedDate: "--", status: "Available" }
];

export const helpDeskTickets = [
  { id: "TCK-901", subject: "Request for Second Monitor Adapter", category: "IT Support", priority: "Low", employee: "Rahul Sharma", date: "2026-07-18", status: "Open", assignedHR: "Tech Ops Team" },
  { id: "TCK-902", subject: "Discrepancy in June Tax Deduction", category: "Payroll", priority: "High", employee: "Daniel Kim", date: "2026-07-12", status: "Resolved", assignedHR: "Sarah Jenkins" }
];

export const announcements = [
  { id: "ANC-01", title: "Q3 Town Hall & Innovation Awards", date: "2026-07-25", category: "Event", priority: "High", content: "Join us for our quarterly virtual town hall featuring CEO product reveals and annual culture awards!" },
  { id: "ANC-02", title: "Updated Hybrid Work Policy Guidelines", date: "2026-07-10", category: "Policy Update", priority: "Normal", content: "Please review the updated flexible work policy document in the Employee Documents portal." }
];

export const initialNotifications = [
  { id: "NTF-1", title: "Leave Request Approved", message: "Your Casual Leave for July 28-29 has been approved by HR Admin.", time: "10 mins ago", read: false, role: "employee" },
  { id: "NTF-2", title: "New Expense Claim Submitted", message: "Rahul Sharma submitted an expense claim of $145.50 for review.", time: "1 hour ago", read: false, role: "hr_admin" },
  { id: "NTF-3", title: "July Payslip Available", message: "Your payslip for July 2026 is ready for download.", time: "1 day ago", read: true, role: "employee" }
];
