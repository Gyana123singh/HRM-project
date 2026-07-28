const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    employeeName: {
      type: String,
      default: 'Rahul Sharma'
    },
    category: {
      type: String,
      required: [true, 'Please select ticket category'],
      enum: [
        'Payroll & Salary Query',
        'Leave & Attendance Policy',
        'Health Insurance & Benefits',
        'IT Hardware & Access Issue',
        'General HR Inquiry'
      ],
      default: 'General HR Inquiry'
    },
    subject: {
      type: String,
      required: [true, 'Please enter ticket subject'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please enter detailed description'],
      trim: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open'
    }
  },
  { timestamps: true }
);

ticketSchema.pre('save', function () {
  if (!this.ticketId) {
    this.ticketId = 'TICK-' + Math.floor(1000 + Math.random() * 9000);
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
