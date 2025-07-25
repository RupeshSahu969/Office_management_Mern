const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Register a new user

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Log role to verify it's correctly passed
    console.log('Role passed during registration:', role);

    // Check if a user with the same email and role already exists
    const userExistsWithSameRole = await User.findOne({ email, role });

    if (userExistsWithSameRole) {
      return res.status(400).json({ message: "Duplicate user: This email and role combination already exists." });
    }

    // Check if the email already exists with a different role
    const userExistsWithDifferentRole = await User.findOne({ email });

    if (userExistsWithDifferentRole && userExistsWithDifferentRole.role !== role) {
      // If the email exists but role is different, allow registration
      console.log("Email found with a different role. Allowing new registration.");
    }

    // Create and save the new user
    const user = new User({ username, email, password, role });
    await user.save();
    
    res.status(201).json({
      message: "User registered successfully",
      user: user
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid data",
      errors: error.errors ? Object.values(error.errors).map(e => e.message) : error.message
    });
  }
};


// Login user and generate JWT token
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid data', errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role, // include role in payload
      },
      process.env.JWT_SECRET,
      { expiresIn: '10d' }
    );

    // Send token and user data
    return res.status(200).json({
      message: 'Login successful',
      
     
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      token,
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
