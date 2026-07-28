const PerformanceReview = require('../models/PerformanceReview');
const Goal = require('../models/Goal');
const Kudos = require('../models/Kudos');
const Onboarding = require('../models/Onboarding');

// @desc    Get Onboarding Trackers
// @route   GET /api/lifecycle/onboarding
// @access  Private
exports.getOnboarding = async (req, res, next) => {
  try {
    const list = await Onboarding.find();
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Performance Reviews
// @route   GET /api/lifecycle/reviews
// @access  Private
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await PerformanceReview.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Performance Review
// @route   POST /api/lifecycle/reviews
// @access  Private (Admin, HR)
exports.createReview = async (req, res, next) => {
  try {
    const { employee, reviewer, period, rating, remarks } = req.body;
    const count = await PerformanceReview.countDocuments();
    const review = await PerformanceReview.create({
      reviewId: `REV-0${count + 1}`,
      employee,
      reviewer: reviewer || 'Alex Vance',
      period: period || 'Q3 2026 Appraisal',
      rating: rating || '4.8 / 5.0',
      remarks: remarks || 'Review cycle initiated by HR Admin.',
      status: 'Pending'
    });
    res.status(201).json({ success: true, message: `Review created for ${employee}`, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Goals & OKRs
// @route   GET /api/lifecycle/goals
// @access  Private
exports.getGoals = async (req, res, next) => {
  try {
    const filter = (req.user && req.user._id)
      ? { $or: [{ employee: req.user._id }, { employee: null }, { employee: { $exists: false } }] }
      : {};
    let goals = await Goal.find(filter).sort({ createdAt: -1 });

    if (goals.length === 0) {
      const defaultGoals = [
        {
          goalId: 'OKR-001',
          title: 'Migrate Micro-frontends to Vite Builder',
          category: 'Technical Excellence',
          period: 'Q3 2026',
          progress: 85,
          targetDate: '2026-09-30',
          keyResults: [
            'Reduce HMR reload time under 200ms',
            'Achieve 95%+ Lighthouse performance score'
          ]
        },
        {
          goalId: 'OKR-002',
          title: 'Enhance API Response Time under 150ms',
          category: 'Backend Optimization',
          period: 'Q3 2026',
          progress: 60,
          targetDate: '2026-09-15',
          keyResults: [
            'Add Redis caching layer for MongoDB queries',
            'Optimize pagination indexes on Employee collections'
          ]
        }
      ];
      goals = await Goal.insertMany(defaultGoals);
    }

    res.status(200).json({ success: true, count: goals.length, data: goals });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Goal Objective
// @route   POST /api/lifecycle/goals
// @access  Private
exports.createGoal = async (req, res, next) => {
  try {
    const { title, category, period, targetDate, keyResults, owner, target, weight, deadline } = req.body;
    const count = await Goal.countDocuments();
    const goal = await Goal.create({
      goalId: `G-10${count + 1}`,
      employee: req.user ? req.user._id : undefined,
      title,
      category: category || 'Engineering',
      period: period || 'Q3 2026',
      targetDate: targetDate || deadline || '2026-09-30',
      keyResults: keyResults || [],
      owner: owner || (req.user ? req.user.email?.split('@')[0] : 'Rahul Sharma'),
      target: target || '100%',
      weight: weight || '30%',
      deadline: deadline || targetDate || '2026-09-30',
      progress: 0,
      status: 'In Progress'
    });
    res.status(201).json({ success: true, message: `Objective "${title}" created!`, data: goal });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Kudos & Recognition
// @route   GET /api/lifecycle/kudos
// @access  Private
exports.getKudos = async (req, res, next) => {
  try {
    const kudosList = await Kudos.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: kudosList.length, data: kudosList });
  } catch (error) {
    next(error);
  }
};

// @desc    Give Kudos Recognition
// @route   POST /api/lifecycle/kudos
// @access  Private
exports.giveKudos = async (req, res, next) => {
  try {
    const { recipient, badge, message, points } = req.body;
    const count = await Kudos.countDocuments();
    const kudos = await Kudos.create({
      kudosId: `KUD-0${count + 1}`,
      recipient,
      sender: req.user ? `${req.user.email}` : 'Sarah Jenkins (HR Admin)',
      badge: badge || 'Innovation Star Award',
      points: points || '+300 Pts',
      message,
      time: 'Just now'
    });
    res.status(201).json({ success: true, message: `Kudos sent to ${recipient}! 🎉`, data: kudos });
  } catch (error) {
    next(error);
  }
};
