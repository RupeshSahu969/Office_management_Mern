const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
  notificationType: {
    type: String,
    enum: ['task', 'project', 'general'],
    default: 'general',
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
