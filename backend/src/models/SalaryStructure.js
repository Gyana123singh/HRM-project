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
    default: '$80k - $120k'
  },
  basic: {
    type: String,
    default: '50%'
  },
  hra: {
    type: String,
    default: '20%'
  },
  allowances: {
    type: String,
    default: '25%'
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
