const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an announcement title'],
      trim: true
    },
    category: {
      type: String,
      enum: ['General', 'Policy Update', 'Event', 'Emergency'],
      default: 'General'
    },
    content: {
      type: String,
      required: [true, 'Please add announcement content'],
      trim: true
    },
    priority: {
      type: String,
      enum: ['Normal', 'High', 'Urgent'],
      default: 'Normal'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);
