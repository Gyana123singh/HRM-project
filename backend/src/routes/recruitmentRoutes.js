const express = require('express');
const {
  getJobs,
  createJob,
  updateJobStatus,
  applyForJob,
  getCandidatesByJob,
  updateCandidateStatus
} = require('../controllers/recruitmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Public route to view open jobs & apply
router.get('/jobs', getJobs);
router.post('/apply', applyForJob);

// Protected routes (Admin & HR)
router.use(protect);

router.post('/jobs', authorize('Admin', 'HR'), createJob);
router.patch('/jobs/:id/status', authorize('Admin', 'HR'), updateJobStatus);

router.get('/candidates', authorize('Admin', 'HR'), getCandidatesByJob);
router.patch('/candidates/:id/status', authorize('Admin', 'HR'), updateCandidateStatus);

module.exports = router;
