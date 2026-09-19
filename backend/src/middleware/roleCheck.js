const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userRole = (req.user.role || '').toLowerCase();
    const allowedRoles = roles.map((r) => r.toLowerCase());

    // Super roles (Admin & HR) or matched roles or dev mode bypass
    if (
      userRole === 'admin' ||
      userRole === 'hr' ||
      allowedRoles.includes(userRole) ||
      process.env.NODE_ENV === 'development'
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `User role '${req.user.role}' is not authorized to access this route.`
    });
  };
};

module.exports = { authorize };
