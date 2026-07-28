const mongoose = require('mongoose');
const Task = require('../models/Task');

// @desc    Create new personal / project task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, project, priority, dueDate, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task title'
      });
    }

    const task = await Task.create({
      employee: req.user ? req.user._id : undefined,
      title,
      project: project || 'SmartHRM Core Portal',
      priority: priority || 'Medium',
      dueDate: dueDate || '2026-08-01',
      description: description || '',
      status: 'In Progress',
      progress: 0
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in employee's tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
exports.getMyTasks = async (req, res, next) => {
  try {
    const filter = (req.user && req.user._id && mongoose.Types.ObjectId.isValid(req.user._id))
      ? { $or: [{ employee: req.user._id }, { employee: null }, { employee: { $exists: false } }] }
      : {};
    let tasks = await Task.find(filter).sort({ createdAt: -1 });

    if (tasks.length === 0) {
      const defaultTasks = [
        {
          title: 'Refactor Auth Token Refresh Middleware',
          project: 'SmartHRM Core Portal',
          priority: 'High',
          status: 'In Progress',
          progress: 75,
          dueDate: '2026-07-28',
          description: 'Optimize JWT token validation latency and add fallback handler for session expiration.'
        },
        {
          title: 'Complete Q3 Frontend Performance Audit',
          project: 'SmartHRM Mobile & Web',
          priority: 'Medium',
          status: 'In Progress',
          progress: 40,
          dueDate: '2026-07-30',
          description: 'Audit bundle size, lazy load routes, and fix component re-render bottlenecks.'
        }
      ];
      tasks = await Task.insertMany(defaultTasks);
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task status & progress
// @route   PATCH /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status, progress } = req.body;
    const { id } = req.params;

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { taskId: id };

    const task = await Task.findOneAndUpdate(
      query,
      { status, progress },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Task status updated',
      data: task
    });
  } catch (err) {
    next(err);
  }
};
