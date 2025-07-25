const { body } = require('express-validator');

// Validation rules for registration
exports.registerValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('username').not().isEmpty().withMessage('Username is required'),
];

// Validation rules for login
exports.loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
