const Department = require('../models/Department');
const Employee = require('../models/Employee');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
exports.getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ isActive: true }).populate('manager', 'firstName lastName email');
    
    // Dynamically update employee counts for each department
    const departmentsWithCounts = await Promise.all(departments.map(async (dept) => {
      const count = await Employee.countDocuments({ department: dept._id, status: 'Active' });
      return {
        id: dept._id,
        _id: dept._id,
        name: dept.name,
        code: dept.code || dept.name.substring(0, 3).toUpperCase(),
        head: dept.head || (dept.manager ? `${dept.manager.firstName} ${dept.manager.lastName}` : 'Unassigned'),
        description: dept.description || `Department managing ${dept.name} operations.`,
        employeeCount: count > 0 ? count : (dept.employeeCount || 0),
        status: dept.status || 'Active'
      };
    }));

    res.status(200).json({ success: true, count: departmentsWithCounts.length, data: departmentsWithCounts });
  } catch (error) {
    next(error);
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private (Admin, HR)
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, head, description, code } = req.body;
    const deptCode = code || (name ? name.substring(0, 4).toUpperCase() : 'DEPT');
    const department = await Department.create({
      name,
      head: head || 'Unassigned',
      description: description || '',
      code: deptCode,
      employeeCount: 0,
      status: 'Active'
    });
    res.status(201).json({ success: true, message: 'Department created successfully', data: department });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin, HR)
exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin, HR)
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, { isActive: false, status: 'Inactive' }, { new: true });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.status(200).json({ success: true, message: 'Department deactivated' });
  } catch (error) {
    next(error);
  }
};
