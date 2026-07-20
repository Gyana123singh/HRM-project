const mongoose = require('mongoose');

const JobPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Please specify a department']
    },
    location: {
      type: String,
      required: [true, 'Please add a location (e.g. Remote, On-site, Hybrid)'],
      default: 'On-site'
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time'
    },
    experience: {
      type: String,
      default: '1-3 years'
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description']
    },
    requirements: [
      {
        type: String
      }
    ],
    salaryRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Draft'],
      default: 'Open'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('JobPosting', JobPostingSchema);
