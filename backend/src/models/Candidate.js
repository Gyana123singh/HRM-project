const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: [true, 'Please specify the target job posting']
    },
    fullName: {
      type: String,
      required: [true, 'Please add candidate full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add candidate email address'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    resumeUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Applied', 'Screened', 'Interviewed', 'Offered', 'Rejected'],
      default: 'Applied'
    },
    notes: {
      type: String,
      default: ''
    },
    interviewDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Candidate', CandidateSchema);
