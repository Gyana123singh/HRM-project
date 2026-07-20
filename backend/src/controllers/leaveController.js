const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// @desc    Apply for a leave
// @route   POST /api/leaves
// @access  Private
exports.applyLeave = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee profile not associated with this account' });
    }

    const { leaveType, startDate, endDate, totalDays, reason } = req.body;

    const leave = await Leave.create({
      employeeId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leave requests for logged in employee
// @route   GET /api/leaves/my-leaves
// @access  Private
exports.getMyLeaves = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    const leaves = await Leave.find({ employeeId })
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leave requests (for HR/Admin/Manager)
// @route   GET /api/leaves
// @access  Private (Admin, HR, Manager)
exports.getAllLeaveRequests = async (req, res, next) => {
  try {
    const { status, leaveType } = req.query;
    const query = {};

    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;

    const leaves = await Leave.find(query)
      .populate('employeeId', 'firstName lastName employeeCode designation department')
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject leave request
// @route   PATCH /api/leaves/:id/status
// @access  Private (Admin, HR, Manager)
exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be Approved or Rejected.' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    leave.status = status;
    leave.approvedBy = req.user.employeeId || null;
    if (rejectionReason) {
      leave.rejectionReason = rejectionReason;
    }

    await leave.save();

    res.status(200).json({
      success: true,
      message: `Leave request ${status.toLowerCase()} successfully`,
      data: leave
    });
  } catch (error) {
    next(error);
  }
};
