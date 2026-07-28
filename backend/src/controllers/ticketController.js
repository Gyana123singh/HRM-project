const Ticket = require('../models/Ticket');

// @desc    Create new HR support ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res, next) => {
  try {
    const { category, subject, description, priority } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both subject and description'
      });
    }

    const ticket = await Ticket.create({
      employee: req.user ? req.user._id : undefined,
      employeeName: req.user ? (req.user.name || req.user.email?.split('@')[0]) : 'Rahul Sharma',
      category: category || 'General HR Inquiry',
      subject,
      description,
      priority: priority || 'Medium',
      status: 'Open'
    });

    res.status(201).json({
      success: true,
      message: 'HR Support Ticket created successfully',
      data: ticket
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in employee's support tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
exports.getMyTickets = async (req, res, next) => {
  try {
    const filter = req.user ? { employee: req.user._id } : {};
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all HR support tickets (HR / Admin)
// @route   GET /api/tickets
// @access  Private (Admin, HR)
exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update ticket status
// @route   PATCH /api/tickets/:id/status
// @access  Private (Admin, HR)
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const mongoose = require('mongoose');

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { ticketId: id };

    const ticket = await Ticket.findOneAndUpdate(
      query,
      { status },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      data: ticket
    });
  } catch (err) {
    next(err);
  }
};
