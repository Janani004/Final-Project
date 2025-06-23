// Ensure admin is authenticated via session
exports.isAdminAuthenticated = (req, res, next) => {
    if (req.session && req.session.adminId) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
  }; 