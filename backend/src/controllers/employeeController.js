 const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get all employees with pagination, search, and filtering
// @route   GET /api/employees
// @access  Private (Admin, HR, Manager)
exports.getAllEmployees = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const { search, department, status, employmentType } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      query.department = department;
    }

    if (status) {
      query.status = status;
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    const total = await Employee.countDocuments(query);

    const employees = await Employee.find(query)
      .populate('department', 'name code')
      .populate('managerId', 'firstName lastName employeeCode')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'name code description')
      .populate('managerId', 'firstName lastName email designation')
      .populate('userId', 'email role isActive');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee and auto-create associated user account
// @route   POST /api/employees
// @access  Private (Admin, HR)
exports.createEmployee = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      employeeCode,
      department,
      designation,
      joiningDate,
      employmentType,
      salary,
      role = 'Employee',
      password = 'Password123!'
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let uniqueCode = employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    // Ensure unique employeeCode
    const codeExists = await Employee.findOne({ employeeCode: uniqueCode });
    if (codeExists) {
      uniqueCode = `EMP-${Date.now().toString().slice(-5)}`;
    }

    // Ensure unique email by appending timestamp suffix if duplicate exists
    let finalEmail = cleanEmail;
    const existingEmp = await Employee.findOne({ email: cleanEmail });
    if (existingEmp) {
      const parts = cleanEmail.split('@');
      finalEmail = `${parts[0]}_${Date.now().toString().slice(-4)}@${parts[1] || 'hrm.com'}`;
    }

    const payload = {
      ...req.body,
      employeeCode: uniqueCode,
      email: finalEmail
    };

    // Resolve department string name to ObjectId if needed
    if (department) {
      if (typeof department === 'string' && !department.match(/^[0-9a-fA-F]{24}$/)) {
        const Department = require('../models/Department');
        let deptDoc = await Department.findOne({ name: { $regex: new RegExp(`^${department.trim()}$`, 'i') } });
        if (!deptDoc) {
          try {
            deptDoc = await Department.create({ name: department.trim(), code: department.slice(0, 4).toUpperCase() });
          } catch (e) {
            // ignore department creation error
          }
        }
        if (deptDoc) {
          payload.department = deptDoc._id;
        } else {
          delete payload.department;
        }
      }
    } else {
      delete payload.department;
    }

    // Resolve salary details and calculate bands
    let basicNum = 85000;
    let monthlyVal = '7,083.33';
    let annualVal = '85,000.00';

    if (salary) {
      if (typeof salary === 'object') {
        monthlyVal = salary.monthlySalary || salary.monthlyBand || monthlyVal;
        annualVal = salary.basicSalary || salary.annualBand || annualVal;
        basicNum = salary.basic || parseFloat(String(annualVal).replace(/[^0-9.]/g, '')) || 85000;
      } else {
        basicNum = parseFloat(String(salary).replace(/[^0-9.]/g, '')) || 85000;
        monthlyVal = (basicNum / 12).toFixed(2);
        annualVal = basicNum.toString();
      }
    }

    const cleanMonthly = parseFloat(String(monthlyVal).replace(/[^0-9.]/g, '')) || (basicNum / 12);
    const cleanAnnual = parseFloat(String(annualVal).replace(/[^0-9.]/g, '')) || basicNum;

    payload.salary = {
      basic: Math.round(cleanAnnual * 0.5),
      monthlySalary: String(monthlyVal),
      basicSalary: String(annualVal),
      monthlyBand: `₹${cleanMonthly.toLocaleString('en-IN', { maximumFractionDigits: 2 })} / Month`,
      annualBand: `₹${cleanAnnual.toLocaleString('en-IN')} / Annum`,
      hra: Math.round(cleanAnnual * 0.25),
      conveyance: 1500,
      specialAllowance: 2000,
      bonus: 0,
      otherEarnings: 0,
      deductions: 0
    };

    // Create Employee record
    const employee = await Employee.create(payload);

    // Create User account linked to Employee if User does not exist
    let user = await User.findOne({ email: finalEmail });
    if (!user) {
      try {
        user = await User.create({
          email: finalEmail,
          password,
          role,
          employeeId: employee._id
        });
      } catch (uErr) {
        console.log('User auto-creation notice:', uErr.message);
      }
    }

    if (user) {
      employee.userId = user._id;
      await employee.save();
    }

    res.status(201).json({
      success: true,
      message: 'Employee created successfully along with user account',
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create employee'
    });
  }
};

// @desc    Update employee profile
// @route   PUT /api/employees/:id
// @access  Private (Admin, HR)
exports.updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('department', 'name code');

    res.status(200).json({
      success: true,
      message: 'Employee details updated successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate/Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin, HR)
exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    let employee = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }
    if (!employee) {
      employee = await Employee.findOne({ $or: [{ employeeCode: id }, { email: id }] });
    }

    if (!employee) {
      return res.status(200).json({ success: true, message: 'Employee record deleted successfully' });
    }

    const empId = employee._id;
    await Employee.findByIdAndDelete(empId);

    if (employee.userId) {
      await User.findByIdAndDelete(employee.userId);
    } else if (employee.email) {
      await User.deleteMany({ email: employee.email });
    }

    res.status(200).json({
      success: true,
      message: 'Employee permanently deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle employee active/inactive status
// @route   PATCH /api/employees/:id/toggle-status
// @access  Private (Admin, HR)
exports.toggleStatus = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const newStatus = employee.status === 'Active' ? 'Inactive' : 'Active';
    employee.status = newStatus;
    await employee.save();

    if (employee.userId) {
      await User.findByIdAndUpdate(employee.userId, { isActive: newStatus === 'Active' });
    }

    res.status(200).json({
      success: true,
      message: `Employee status changed to ${newStatus}`,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};
