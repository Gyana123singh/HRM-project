const mongoose = require('mongoose');

const performanceReviewSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    unique: true
  },
  employee: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true
  },
  reviewer: {
    type: String,
    required: [true, 'Reviewer name is required'],
    trim: true
  },
  period: {
    type: String,
    required: [true, 'Review period is required'],
    trim: true,
    default: 'Q3 2026 Appraisal'
  },
  rating: {
    type: String,
    default: '4.8 / 5.0'
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'In Progress'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    default: 'Review cycle initiated by HR Admin.'
  }
}, { timestamps: true });

module.exports = mongoose.model('PerformanceReview', performanceReviewSchema);
