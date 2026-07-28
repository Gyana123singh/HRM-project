const mongoose = require('mongoose');

const kudosSchema = new mongoose.Schema({
  kudosId: {
    type: String,
    unique: true
  },
  recipient: {
    type: String,
    required: [true, 'Recipient name is required'],
    trim: true
  },
  sender: {
    type: String,
    required: [true, 'Sender name is required'],
    trim: true,
    default: 'Sarah Jenkins (HR Admin)'
  },
  badge: {
    type: String,
    required: [true, 'Badge title is required'],
    default: 'Innovation Star Award'
  },
  points: {
    type: String,
    default: '+300 Pts'
  },
  message: {
    type: String,
    required: [true, 'Recognition message is required'],
    trim: true
  },
  time: {
    type: String,
    default: 'Just now'
  }
}, { timestamps: true });

module.exports = mongoose.model('Kudos', kudosSchema);
