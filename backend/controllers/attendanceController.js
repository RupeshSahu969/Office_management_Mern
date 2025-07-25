const Attendance = require("../models/attendance");

const createAttendanceRecord = async (req, res) => {
  try {
    const newAttendance = new Attendance(req.body);
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createAttendanceRecord,
};
