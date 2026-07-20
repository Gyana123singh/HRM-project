const express = require('express');
const {
  applyLeave,
  getMyLeaves,
  getAllLeaveRequests,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.use(protect);

router.post('/', applyLeave);
router.get('/my-leaves', getMyLeaves);
router.get('/', authorize('Admin', 'HR', 'Manager'), getAllLeaveRequests);
router.patch('/:id/status', authorize('Admin', 'HR', 'Manager'), updateLeaveStatus);

module.exports = router;
