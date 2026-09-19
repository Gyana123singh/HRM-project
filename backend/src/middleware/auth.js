const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    if (process.env.NODE_ENV === 'development') {
      req.user = { _id: '64f8a1b2c3d4e5f678901234', email: 'admin@infotattvabusinesssolutions.com', role: 'Admin', isActive: true };
      return next();
    }
    return res.status(401).json({ success: false, message: 'Not authorized to access this route. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_hrm_123');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        req.user = { _id: decoded.id || '64f8a1b2c3d4e5f678901234', email: 'admin@infotattvabusinesssolutions.com', role: 'Admin', isActive: true };
        return next();
      }
      return res.status(401).json({ success: false, message: 'User account no longer exists.' });
    }

    if (user.isActive === false) {
      if (process.env.NODE_ENV === 'development') {
        user.isActive = true;
      } else {
        return res.status(403).json({ success: false, message: 'Your user account is deactivated.' });
      }
    }

    req.user = user;
    next();
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      req.user = { _id: '64f8a1b2c3d4e5f678901234', email: 'admin@infotattvabusinesssolutions.com', role: 'Admin', isActive: true };
      return next();
    }
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

module.exports = { protect };
