

const User = require('../models/User');

exports.isUserAuthenticated = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      // Find the user by session userId
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user; 
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

