const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: String,
      unique: true
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    title: {
      type: String,
      required: [true, 'Please enter task title'],
      trim: true
    },
    project: {
      type: String,
      default: 'SmartHRM Core Portal'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'In Progress'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    dueDate: {
      type: String,
      default: '2026-08-01'
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

taskSchema.pre('save', function () {
  if (!this.taskId) {
    this.taskId = 'TASK-' + Math.floor(100 + Math.random() * 900);
  }
});

module.exports = mongoose.model('Task', taskSchema);
