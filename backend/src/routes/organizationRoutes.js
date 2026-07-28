const express = require('express');
const router = express.Router();
const {
  getOrganizationProfile,
  updateOrganizationProfile,
  getBranches,
  createBranch,
  getDesignations,
  createDesignation
} = require('../controllers/organizationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);

router.route('/profile')
  .get(getOrganizationProfile)
  .put(authorize('Admin', 'HR'), updateOrganizationProfile);

router.route('/branches')
  .get(getBranches)
  .post(authorize('Admin', 'HR'), createBranch);

router.route('/designations')
  .get(getDesignations)
  .post(authorize('Admin', 'HR'), createDesignation);

module.exports = router;
