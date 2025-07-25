const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMyEmployeeProfile,
  updateMyEmployeeProfile,
} = require('../controllers/employeeController');

// GET logged-in employee profile
router.get('/', protect, getMyEmployeeProfile);

// PUT update logged-in employee profile
router.put('/', protect, updateMyEmployeeProfile);

module.exports = router;
