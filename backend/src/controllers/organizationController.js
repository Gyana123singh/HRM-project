const Organization = require('../models/Organization');
const Branch = require('../models/Branch');
const Designation = require('../models/Designation');
const Employee = require('../models/Employee');

// @desc    Get Organization Profile
// @route   GET /api/organization/profile
// @access  Private
exports.getOrganizationProfile = async (req, res, next) => {
  try {
    let org = await Organization.findOne();
    if (!org) {
      org = await Organization.create({});
    }
    res.status(200).json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Organization Profile
// @route   PUT /api/organization/profile
// @access  Private (Admin, HR)
exports.updateOrganizationProfile = async (req, res, next) => {
  try {
    let org = await Organization.findOne();
    if (!org) {
      org = await Organization.create(req.body);
    } else {
      org = await Organization.findByIdAndUpdate(org._id, req.body, { new: true, runValidators: true });
    }
    res.status(200).json({ success: true, message: 'Organization profile updated successfully', data: org });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Branches
// @route   GET /api/organization/branches
// @access  Private
exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find();
    // Compute dynamic workforce count
    const branchesWithCount = await Promise.all(branches.map(async (b, idx) => {
      const count = await Employee.countDocuments({ location: { $regex: b.location || b.name, $options: 'i' }, status: 'Active' });
      return {
        id: b.branchId || `BR-0${idx + 1}`,
        _id: b._id,
        name: b.name,
        location: b.location,
        head: b.head || 'Unassigned',
        employeeCount: count > 0 ? count : (b.employeeCount || 0),
        status: b.status || 'Active'
      };
    }));
    res.status(200).json({ success: true, count: branchesWithCount.length, data: branchesWithCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Branch
// @route   POST /api/organization/branches
// @access  Private (Admin, HR)
exports.createBranch = async (req, res, next) => {
  try {
    const { name, location, head } = req.body;
    const count = await Branch.countDocuments();
    const branch = await Branch.create({
      branchId: `BR-0${count + 1}`,
      name,
      location,
      head: head || 'Unassigned',
      employeeCount: 0,
      status: 'Active'
    });
    res.status(201).json({ success: true, message: `Branch ${name} created successfully`, data: branch });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Designations
// @route   GET /api/organization/designations
// @access  Private
exports.getDesignations = async (req, res, next) => {
  try {
    const designations = await Designation.find();
    const desigsWithCount = await Promise.all(designations.map(async (des, idx) => {
      const count = await Employee.countDocuments({ designation: des.name, status: 'Active' });
      return {
        id: des.desigId || `DES-0${idx + 1}`,
        _id: des._id,
        name: des.name,
        department: des.department,
        level: des.level,
        employeeCount: count > 0 ? count : (des.employeeCount || 0),
        status: des.status || 'Active'
      };
    }));
    res.status(200).json({ success: true, count: desigsWithCount.length, data: desigsWithCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Designation
// @route   POST /api/organization/designations
// @access  Private (Admin, HR)
exports.createDesignation = async (req, res, next) => {
  try {
    const { name, department, level } = req.body;
    const count = await Designation.countDocuments();
    const designation = await Designation.create({
      desigId: `DES-0${count + 1}`,
      name,
      department: department || 'Engineering',
      level: level || 'L4',
      employeeCount: 0,
      status: 'Active'
    });
    res.status(201).json({ success: true, message: `Designation ${name} created successfully`, data: designation });
  } catch (error) {
    next(error);
  }
};
