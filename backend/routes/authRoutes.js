const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Only admin can register new users
router.post('/register', protect, adminOnly, registerValidation, registerUser);

// Public login route
router.post('/login', loginValidation, loginUser);

module.exports = router;
