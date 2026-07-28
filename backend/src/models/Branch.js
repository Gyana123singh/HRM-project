const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Branch location is required'],
    trim: true
  },
  head: {
    type: String,
    default: 'Unassigned'
  },
  employeeCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);
