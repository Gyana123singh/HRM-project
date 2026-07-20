const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    },
    baseSalary: {
      type: Number,
      required: true,
      default: 0
    },
    allowances: {
      hra: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    deductions: {
      tax: { type: Number, default: 0 },
      providentFund: { type: Number, default: 0 },
      unpaidLeaves: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    grossSalary: {
      type: Number,
      required: true,
      default: 0
    },
    netSalary: {
      type: Number,
      required: true,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Paid'],
      default: 'Pending'
    },
    paymentDate: {
      type: Date
    },
    payslipUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

PayrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', PayrollSchema);
