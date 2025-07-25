// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const {
  createLeaveRecord,
  getLeavesForEmployee,
  getAllLeaves,
} = require('../controllers/leaveController');
const { protect, hrOnly } = require('../middleware/authMiddleware');

// Employee routes
router.post('/', protect, createLeaveRecord);
router.get('/mine', protect, getLeavesForEmployee); // based on token userid

// HR/Admin routes
router.get('/', protect, hrOnly, getAllLeaves);


module.exports = router;
