const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Clock In or Clock Out for the current employee
// @route   POST /api/attendance/punch
// @access  Private
exports.clockInOut = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'User is not linked to an employee profile' });
    }

    const { workLocation = 'Office', notes } = req.body;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const now = new Date();

    if (!attendance) {
      // Clock In
      const isLate = now.getHours() >= 10; // After 10 AM considered late
      attendance = await Attendance.create({
        employeeId,
        date: startOfDay,
        checkIn: now,
        status: isLate ? 'Late' : 'Present',
        workLocation,
        notes
      });

      return res.status(200).json({
        success: true,
        type: 'checkIn',
        message: `Clocked in successfully at ${now.toLocaleTimeString()}`,
        data: attendance
      });
    } else {
      // Clock Out
      if (attendance.checkOut) {
        return res.status(400).json({ success: false, message: 'You have already clocked out for today' });
      }

      attendance.checkOut = now;
      const diffMs = now - new Date(attendance.checkIn);
      const diffHrs = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
      attendance.totalHours = diffHrs;

      if (diffHrs < 4) {
        attendance.status = 'Half-Day';
      }

      await attendance.save();

      return res.status(200).json({
        success: true,
        type: 'checkOut',
        message: `Clocked out successfully. Total hours: ${diffHrs} hrs`,
        data: attendance
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's clock status for logged in employee
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayStatus = async (req, res, next) => {
  try {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      return res.status(200).json({ success: true, data: null });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance logs with date filtering
// @route   GET /api/attendance/logs
// @access  Private
exports.getEmployeeAttendanceLogs = async (req, res, next) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    
    // Target employee ID: if provided & user is Admin/HR, use target; else use own employeeId
    let targetEmployeeId = req.user.employeeId;
    if (employeeId && ['Admin', 'HR', 'Manager'].includes(req.user.role)) {
      targetEmployeeId = employeeId;
    }

    const query = { employeeId: targetEmployeeId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const logs = await Attendance.find(query)
      .populate('employeeId', 'firstName lastName employeeCode designation')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary stats of today's attendance for dashboard
// @route   GET /api/attendance/summary
// @access  Private (Admin, HR, Manager)
exports.getDepartmentAttendanceSummary = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayLogs = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalEmployees = await Employee.countDocuments({ status: 'Active' });
    const presentCount = todayLogs.filter(l => l.status === 'Present').length;
    const lateCount = todayLogs.filter(l => l.status === 'Late').length;
    const halfDayCount = todayLogs.filter(l => l.status === 'Half-Day').length;
    const absentCount = totalEmployees - todayLogs.length;

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        present: presentCount,
        late: lateCount,
        halfDay: halfDayCount,
        absent: absentCount < 0 ? 0 : absentCount
      }
    });
  } catch (error) {
    next(error);
  }
};
