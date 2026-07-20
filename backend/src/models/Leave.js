const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    leaveType: {
      type: String,
      enum: ['Casual', 'Sick', 'Earned', 'Unpaid', 'Maternity', 'Paternity'],
      required: [true, 'Please select a leave type']
    },
    startDate: {
      type: Date,
      required: [true, 'Please select a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please select an end date']
    },
    totalDays: {
      type: Number,
      required: true,
      min: 0.5
    },
    reason: {
      type: String,
      required: [true, 'Please state a reason for the leave request']
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    rejectionReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Leave', LeaveSchema);
