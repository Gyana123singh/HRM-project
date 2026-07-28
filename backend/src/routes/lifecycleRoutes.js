const express = require('express');
const router = express.Router();
const {
  getOnboarding,
  getReviews,
  createReview,
  getGoals,
  createGoal,
  getKudos,
  giveKudos
} = require('../controllers/lifecycleController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);

router.get('/onboarding', getOnboarding);

router.route('/reviews')
  .get(getReviews)
  .post(authorize('Admin', 'HR'), createReview);

router.route('/goals')
  .get(getGoals)
  .post(authorize('Admin', 'HR'), createGoal);

router.route('/kudos')
  .get(getKudos)
  .post(giveKudos);

module.exports = router;
