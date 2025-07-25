const express = require('express');
const router = express.Router();
const { protect, hrOnly } = require('../middleware/authMiddleware');
const {
  getAllEmployeeData,
  getEmployeeTasks,
  getEmployeeLeave,
  getEmployeeAttendance,
  getProjectsByHR,
  assignEmployeesToProject,updateLeaveStatus
} = require('../controllers/hrController');

router.get('/employees', protect, hrOnly, getAllEmployeeData);
router.get('/tasks/:id', protect, hrOnly, getEmployeeTasks);
router.get('/leaves/:id', protect, hrOnly, getEmployeeLeave);
router.get('/attendance/:id', protect, hrOnly, getEmployeeAttendance);
router.get('/projects', protect, hrOnly, getProjectsByHR);
router.post('/projects', protect, hrOnly, assignEmployeesToProject);
router.put('/leaves/:id/status', protect, hrOnly, updateLeaveStatus);

module.exports = router;
