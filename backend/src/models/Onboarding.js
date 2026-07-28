const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  onboardingId: {
    type: String,
    unique: true
  },
  employee: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true
  },
  mentor: {
    type: String,
    default: 'Sarah Jenkins'
  },
  progress: {
    type: Number,
    default: 25
  },
  completed: {
    type: Number,
    default: 2
  },
  total: {
    type: Number,
    default: 8
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Pending'],
    default: 'In Progress'
  }
}, { timestamps: true });

module.exports = mongoose.model('Onboarding', onboardingSchema);
