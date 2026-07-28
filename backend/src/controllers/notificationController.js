const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getMyNotifications = async (req, res) => {
  try {
    const userRole = req.user.role || 'employee';
    const userId = req.user._id;

    let notifications = await Notification.find({
      $or: [
        { recipient: userId },
        { role: userRole },
        { role: 'all' }
      ]
    }).sort({ createdAt: -1 }).limit(30);

    // Initial seed if empty
    if (!notifications || notifications.length === 0) {
      const seedNotifs = [
        {
          role: 'employee',
          title: 'Payslip Disbursed',
          message: 'Your July 2026 Salary Payslip is generated and available for download.',
          type: 'payroll',
          link: '/employee/payslips'
        },
        {
          role: 'employee',
          title: 'Sprint Task Assigned',
          message: 'You were assigned task "Refactor Auth Token Refresh Middleware".',
          type: 'task',
          link: '/employee/tasks'
        },
        {
          role: 'employee',
          title: 'Kudos Received 🏆',
          message: 'Sarah Jenkins awarded you +500 Kudos points for exceptional delivery!',
          type: 'kudos',
          link: '/employee/goals'
        },
        {
          role: 'hr_admin',
          title: 'New Leave Request',
          message: 'Anita Desai applied for 3 days of Sick Leave awaiting approval.',
          type: 'leave',
          link: '/hr/attendance/leave'
        },
        {
          role: 'hr_admin',
          title: 'HR Support Ticket Logged',
          message: 'Rahul Sharma submitted a Payroll & Salary Query ticket.',
          type: 'ticket',
          link: '/hr/dashboard'
        }
      ];

      await Notification.insertMany(seedNotifs);
      notifications = await Notification.find({
        $or: [
          { recipient: userId },
          { role: userRole },
          { role: 'all' }
        ]
      }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    const userRole = req.user.role || 'employee';
    const userId = req.user._id;

    await Notification.updateMany(
      {
        $or: [
          { recipient: userId },
          { role: userRole },
          { role: 'all' }
        ]
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications',
      error: error.message
    });
  }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, role, recipient, link } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type: type || 'system',
      role: role || 'all',
      recipient: recipient || null,
      link: link || ''
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};
