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
    payDate: {
      type: Date,
      default: Date.now
    },
    panNumber: {
      type: String,
      default: 'ABCDE1234F'
    },
    workLocation: {
      type: String,
      default: 'Bhubaneswar / Remote'
    },
    bankName: {
      type: String,
      default: 'HDFC Bank'
    },
    accountNumber: {
      type: String,
      default: 'XXXXX1234'
    },
    totalWorkingDays: {
      type: Number,
      default: 30
    },
    paidDays: {
      type: Number,
      default: 30
    },
    lopDays: {
      type: Number,
      default: 0
    },
    basic: {
      type: Number,
      default: 0
    },
    hra: {
      type: Number,
      default: 0
    },
    conveyance: {
      type: Number,
      default: 0
    },
    specialAllowance: {
      type: Number,
      default: 0
    },
    bonus: {
      type: Number,
      default: 0
    },
    otherEarnings: {
      type: Number,
      default: 0
    },
    grossSalary: {
      type: Number,
      required: true,
      default: 0
    },
    deductions: {
      tax: { type: Number, default: 0 },
      providentFund: { type: Number, default: 0 },
      unpaidLeaves: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
      totalDeductions: { type: Number, default: 0 }
    },
    netSalary: {
      type: Number,
      required: true,
      default: 0
    },
    amountInWords: {
      type: String,
      default: ''
    },
    paymentMode: {
      type: String,
      default: 'Bank Transfer'
    },
    transactionRef: {
      type: String,
      default: 'TXN-987654321'
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
