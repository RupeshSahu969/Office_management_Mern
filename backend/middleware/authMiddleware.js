const jwt = require('jsonwebtoken'); // Make sure this is at the top
const User = require('../models/user');

// Protect middleware to check for valid token
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB if necessary
    const userFromDb = await User.findById(decoded.userId).select('-password');

    if (!userFromDb) {
      return res.status(404).json({ message: 'User not found from token' });
    }

  

    // Combine token data + DB data (if needed)
    req.user = {
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      username: decoded.username,
      ...userFromDb.toObject(),
    };

    next();
  } catch (error) {
    console.error('Protect middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};


// Admin-only access
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role?.toLowerCase() !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// HR and Admin access
const hrOnly = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'hr') {
    return res.status(403).json({ message: 'HR or Admin only' });
  }
  next();
};

module.exports = { protect, hrOnly, adminOnly };
