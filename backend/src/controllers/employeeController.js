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

    // Check if email or employeeCode exists
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { employeeCode }]
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email or employee code already exists'
      });
    }

    // Create Employee record
    const employee = await Employee.create(req.body);

    // Create User account linked to Employee
    const user = await User.create({
      email: employee.email,
      password,
      role,
      employeeId: employee._id
    });

    // Update Employee with reference to User
    employee.userId = user._id;
    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Employee created successfully along with user account',
      data: employee
    });
  } catch (error) {
    next(error);
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
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.status = 'Offboarded';
    await employee.save();

    if (employee.userId) {
      await User.findByIdAndUpdate(employee.userId, { isActive: false });
    }

    res.status(200).json({
      success: true,
      message: 'Employee offboarded and account deactivated successfully'
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
