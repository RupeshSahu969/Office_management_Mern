const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: Date,
  status: {
    type: String,
    enum: ['not started', 'in progress', 'completed', 'on hold'],
    default: 'not started'
  },
  priority: {
    type: String,
    default: 'medium'
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
