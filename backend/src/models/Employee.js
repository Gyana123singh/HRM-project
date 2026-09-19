const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      required: [true, 'Please add an employee code'],
      unique: true,
      trim: true
    },
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer Not to Say'],
      default: 'Prefer Not to Say'
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department'
    },
    designation: {
      type: String,
      required: [true, 'Please add a designation/job title'],
      trim: true
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
      default: 'Full-time'
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Onboarding', 'Offboarded'],
      default: 'Active'
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'},
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
    salary: {
      basic: { type: Number, default: 7000 },
      monthlySalary: { type: String, default: '7,083.33' },
      basicSalary: { type: String, default: '85,000.00' },
      monthlyBand: { type: String, default: '₹7,083.33 / Month' },
      annualBand: { type: String, default: '₹85,000 / Annum' },
      hra: { type: Number, default: 3500 },
      conveyance: { type: Number, default: 1500 },
      specialAllowance: { type: Number, default: 2000 },
      bonus: { type: Number, default: 0 },
      otherEarnings: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 }
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    documents: [
      {
        name: String,
        url: String,
        publicId: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Virtual for full name
EmployeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

EmployeeSchema.set('toJSON', { virtuals: true });
EmployeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
