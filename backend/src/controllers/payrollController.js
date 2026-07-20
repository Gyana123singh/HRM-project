const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// @desc    Generate monthly payroll for employee(s)
// @route   POST /api/payroll/generate
// @access  Private (Admin, HR)
exports.generateMonthlyPayroll = async (req, res, next) => {
  try {
    const { month, year, employeeId } = req.body;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Please specify month and year' });
    }

    let employees = [];
    if (employeeId) {
      const emp = await Employee.findById(employeeId);
      if (emp) employees.push(emp);
    } else {
      employees = await Employee.find({ status: 'Active' });
    }

    const generatedPayrolls = [];

    for (const emp of employees) {
      const basicSalary = emp.salary?.basic || 30000;
      const allowancesObj = emp.salary?.allowances || { hra: basicSalary * 0.2, medical: 2000, transport: 1500 };
      const totalAllowances = (allowancesObj.hra || 0) + (allowancesObj.medical || 0) + (allowancesObj.transport || 0);

      const grossSalary = basicSalary + totalAllowances;
      const taxDeduction = grossSalary * 0.1; // 10% tax estimation
      const pfDeduction = basicSalary * 0.05; // 5% PF
      const totalDeductions = taxDeduction + pfDeduction;

      const netSalary = grossSalary - totalDeductions;

      const payrollData = {
        employeeId: emp._id,
        month: Number(month),
        year: Number(year),
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
        paymentStatus: 'Pending'
      };

      const payroll = await Payroll.findOneAndUpdate(
        { employeeId: emp._id, month: Number(month), year: Number(year) },
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

    res.status(200).json({
      success: true,
      count: payslips.length,
      data: payslips
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
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee profile not associated' });
    }

    const payslips = await Payroll.find({ employeeId })
      .sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: payslips.length,
      data: payslips
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
