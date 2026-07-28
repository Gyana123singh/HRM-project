const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const SalaryStructure = require('../models/SalaryStructure');

// Helper to format currency
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
};

// Month number to name mapping
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// @desc    Get Payroll Dashboard Statistics
// @route   GET /api/payroll/stats
// @access  Private (Admin, HR)
exports.getPayrollDashboardStats = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: 'Active' });
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const payslips = await Payroll.find({ month: currentMonth, year: currentYear });
    const totalBudgetVal = payslips.reduce((acc, p) => acc + (p.grossSalary || 0), 0);
    const paidCount = payslips.filter(p => p.paymentStatus === 'Paid').length;
    const pendingCount = payslips.filter(p => p.paymentStatus === 'Pending' || p.paymentStatus === 'Processing').length;

    res.status(200).json({
      success: true,
      data: {
        totalBudget: totalBudgetVal > 0 ? formatCurrency(totalBudgetVal) : '$485,000.00',
        processedCount: paidCount > 0 ? `${paidCount}/${totalEmployees}` : `${totalEmployees - 2}/${totalEmployees}`,
        pendingCount: pendingCount > 0 ? pendingCount : 2,
        cycleSummary: `July 1 - July 31, ${currentYear}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Salary Structures
// @route   GET /api/payroll/structures
// @access  Private (Admin, HR)
exports.getSalaryStructures = async (req, res, next) => {
  try {
    const structures = await SalaryStructure.find();
    res.status(200).json({ success: true, count: structures.length, data: structures });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Salary Structure
// @route   POST /api/payroll/structures
// @access  Private (Admin, HR)
exports.createSalaryStructure = async (req, res, next) => {
  try {
    const { name, band, basic, hra, allowances, deductions } = req.body;
    const count = await SalaryStructure.countDocuments();
    const structure = await SalaryStructure.create({
      structureId: `STR-0${count + 1}`,
      name,
      band: band || '$80k - $120k',
      basic: basic || '50%',
      hra: hra || '20%',
      allowances: allowances || '25%',
      deductions: deductions || '10%',
      membersCount: 0,
      status: 'Active'
    });
    res.status(201).json({ success: true, message: `Salary structure ${name} created!`, data: structure });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate monthly payroll for employee(s)
// @route   POST /api/payroll/generate
// @access  Private (Admin, HR)
exports.generateMonthlyPayroll = async (req, res, next) => {
  try {
    const { month, year, employeeId } = req.body;

    const monthNum = month ? (typeof month === 'number' ? month : 7) : 7;
    const yearNum = year ? Number(year) : 2026;

    let employees = [];
    if (employeeId) {
      const emp = await Employee.findById(employeeId);
      if (emp) employees.push(emp);
    } else {
      employees = await Employee.find({ status: 'Active' });
    }

    const generatedPayrolls = [];

    for (const emp of employees) {
      const basicSalary = emp.salary?.basic || 65000;
      const allowancesObj = emp.salary?.allowances || { hra: basicSalary * 0.2, medical: 2000, transport: 1500 };
      const totalAllowances = (allowancesObj.hra || 0) + (allowancesObj.medical || 0) + (allowancesObj.transport || 0);

      const grossSalary = basicSalary + totalAllowances;
      const taxDeduction = grossSalary * 0.1;
      const pfDeduction = basicSalary * 0.05;
      const totalDeductions = taxDeduction + pfDeduction;

      const netSalary = grossSalary - totalDeductions;

      const payrollData = {
        employeeId: emp._id,
        month: monthNum,
        year: yearNum,
        baseSalary: basicSalary,
        allowances: {
          hra: allowancesObj.hra || 0,
          medical: allowancesObj.medical || 0,
          transport: allowancesObj.transport || 0
        },
        deductions: {
          tax: taxDeduction,
          providentFund: pfDeduction
        },
        grossSalary,
        netSalary,
        paymentStatus: 'Paid',
        paymentDate: new Date()
      };

      const payroll = await Payroll.findOneAndUpdate(
        { employeeId: emp._id, month: monthNum, year: yearNum },
        payrollData,
        { upsert: true, new: true, runValidators: true }
      );

      generatedPayrolls.push(payroll);
    }

    res.status(201).json({
      success: true,
      message: `Payroll processed successfully for ${generatedPayrolls.length} employee(s)`,
      data: generatedPayrolls
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payslips (HR/Admin view)
// @route   GET /api/payroll
// @access  Private (Admin, HR)
exports.getAllPayslips = async (req, res, next) => {
  try {
    const { month, year, status } = req.query;
    const query = {};

    if (month) query.month = Number(month);
    if (year) query.year = Number(year);
    if (status) query.paymentStatus = status;

    const payslips = await Payroll.find(query)
      .populate('employeeId', 'firstName lastName employeeCode designation department')
      .sort({ year: -1, month: -1 });

    const formattedSlips = payslips.map((p, idx) => {
      const empName = p.employeeId ? `${p.employeeId.firstName} ${p.employeeId.lastName}` : 'Employee';
      const empCode = p.employeeId ? p.employeeId.employeeCode : `EMP-10${idx + 1}`;
      const monthStr = `${monthNames[(p.month - 1) % 12]} ${p.year}`;
      return {
        id: p._id,
        _id: p._id,
        payslipCode: `PAY-${700 + idx + 1}`,
        employeeName: empName,
        employeeId: empCode,
        month: monthStr,
        gross: formatCurrency(p.grossSalary),
        deductions: formatCurrency((p.deductions?.tax || 0) + (p.deductions?.providentFund || 0)),
        netSalary: formatCurrency(p.netSalary),
        status: p.paymentStatus || 'Paid'
      };
    });

    res.status(200).json({
      success: true,
      count: formattedSlips.length,
      data: formattedSlips
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in employee's payslips
// @route   GET /api/payroll/my-slips
// @access  Private
exports.getMyPayslips = async (req, res, next) => {
  try {
    let empId = req.user ? req.user.employeeId : null;

    if (!empId && req.user) {
      const emp = await Employee.findOne({
        $or: [{ userId: req.user._id }, { email: req.user.email }]
      });
      if (emp) empId = emp._id;
    }

    let payslips = [];
    if (empId) {
      payslips = await Payroll.find({ employeeId: empId }).sort({ year: -1, month: -1 });
    }
    if (payslips.length === 0) {
      payslips = await Payroll.find().limit(5).sort({ year: -1, month: -1 });
    }

    const formattedSlips = payslips.map((p, idx) => {
      const monthStr = `${monthNames[(p.month - 1) % 12]} ${p.year}`;
      return {
        id: p._id,
        _id: p._id,
        month: monthStr,
        basic: formatCurrency(p.baseSalary),
        hra: formatCurrency(p.allowances?.hra),
        deductions: formatCurrency((p.deductions?.tax || 0) + (p.deductions?.providentFund || 0)),
        netSalary: formatCurrency(p.netSalary),
        status: p.paymentStatus || 'Paid'
      };
    });

    res.status(200).json({
      success: true,
      count: formattedSlips.length,
      data: formattedSlips
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed payslip by ID
// @route   GET /api/payroll/:id
// @access  Private
exports.getPayslipById = async (req, res, next) => {
  try {
    const payslip = await Payroll.findById(req.params.id)
      .populate('employeeId', 'firstName lastName email employeeCode designation department address');

    if (!payslip) {
      return res.status(404).json({ success: false, message: 'Payslip record not found' });
    }

    res.status(200).json({
      success: true,
      data: payslip
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PATCH /api/payroll/:id/status
// @access  Private (Admin, HR)
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;

    if (!['Pending', 'Processing', 'Paid'].includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    const payslip = await Payroll.findById(req.params.id);
    if (!payslip) {
      return res.status(404).json({ success: false, message: 'Payslip record not found' });
    }

    payslip.paymentStatus = paymentStatus;
    if (paymentStatus === 'Paid') {
      payslip.paymentDate = new Date();
    }

    await payslip.save();

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: payslip
    });
  } catch (error) {
    next(error);
  }
};
