const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    checkIn: {
      type: Date
    },
    checkOut: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half-Day', 'Late', 'On Leave'],
      default: 'Present'
    },
    totalHours: {
      type: Number,
      default: 0
    },
    workLocation: {
      type: String,
      enum: ['Office', 'Remote', 'Field'],
      default: 'Office'
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Composite index for fast queries per employee and date
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
