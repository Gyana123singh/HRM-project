const express = require('express');
const {
  getAdminDashboardStats,
  getEmployeeDashboardStats,
  getAnnouncements,
  createAnnouncement
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect); // All dashboard routes require authentication

router.get('/stats', authorize('Admin', 'HR', 'Manager'), getAdminDashboardStats);
router.get('/employee-stats', getEmployeeDashboardStats);

router.route('/announcements')
  .get(getAnnouncements)
  .post(authorize('Admin', 'HR'), createAnnouncement);

module.exports = router;
