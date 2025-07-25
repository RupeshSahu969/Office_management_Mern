const express = require("express");
const router = express.Router();
const {
  createAttendanceRecord,
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");
// Record attendance

// Create a new attendance record
router.post("/", protect, createAttendanceRecord);

module.exports = router;
