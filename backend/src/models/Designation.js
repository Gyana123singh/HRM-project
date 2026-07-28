const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  desigId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Designation title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department assignment is required'],
    trim: true,
    default: 'Engineering'
  },
  level: {
    type: String,
    default: 'L4'
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

module.exports = mongoose.model('Designation', designationSchema);
