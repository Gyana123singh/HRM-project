const express = require('express');
const {
  clockInOut,
  getTodayStatus,
  getEmployeeAttendanceLogs,
  getDepartmentAttendanceSummary
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect);

router.post('/punch', clockInOut);
router.get('/today', getTodayStatus);
router.get('/logs', getEmployeeAttendanceLogs);
router.get('/summary', authorize('Admin', 'HR', 'Manager'), getDepartmentAttendanceSummary);

module.exports = router;
