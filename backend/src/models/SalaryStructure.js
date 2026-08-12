const mongoose = require('mongoose');

const salaryStructureSchema = new mongoose.Schema({
  structureId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Structure name is required'],
    trim: true
  },
  band: {
    type: String,
    required: [true, 'Compensation band is required'],
    default: '₹6,00,000 - ₹12,00,000 / Annum'
  },
  basic: {
    type: String,
    default: '50%'
  },
  hra: {
    type: String,
    default: '20%'
  },
  conveyance: {
    type: String,
    default: '10%'
  },
  specialAllowance: {
    type: String,
    default: '10%'
  },
  bonus: {
    type: String,
    default: '5%'
  },
  otherEarnings: {
    type: String,
    default: '5%'
  },
  deductions: {
    type: String,
    default: '10%'
  },
  membersCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);

