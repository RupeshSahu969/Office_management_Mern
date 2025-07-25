const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
 userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
,
  date: { type: Date, required: true },
  inTime: Date,
  outTime: Date,
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'leave'],
    default: 'present'
  },
  totalHours: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Auto calculate hours
attendanceSchema.pre('save', function (next) {
  if (this.inTime && this.outTime) {
    const diff = (this.outTime - this.inTime) / (1000 * 60 * 60); // ms to hours
    this.totalHours = diff;
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
