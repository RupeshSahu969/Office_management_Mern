const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Only one profile per user
  },
  name: {
    type: String,
    required: true,
  },
  email: { // This can also be derived from User if needed
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    default: 'employee',
  },
  department: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
