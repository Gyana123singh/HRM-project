const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  goalId: {
    type: String,
    unique: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Objective title is required'],
    trim: true
  },
  category: {
    type: String,
    default: 'Engineering'
  },
  period: {
    type: String,
    default: 'Q3 2026'
  },
  targetDate: {
    type: String,
    default: '2026-09-30'
  },
  keyResults: [{
    type: String
  }],
  owner: {
    type: String,
    trim: true,
    default: 'Rahul Sharma'
  },
  target: {
    type: String,
    default: '100%'
  },
  progress: {
    type: Number,
    default: 0
  },
  weight: {
    type: String,
    default: '30%'
  },
  deadline: {
    type: String,
    default: '2026-09-30'
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'On Hold'],
    default: 'In Progress'
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
