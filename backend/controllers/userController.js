 const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
 
// user/register
exports.registerUser = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
 
  const { name, email, password } = req.body;
 
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
 
    const newUser = new User({ name, email, password });
    await newUser.save();
 
    return res.status(201).json({
      message: 'User registered successfully',
      customerId: newUser.customerId
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
 
    req.session.userId = user._id; // Set session
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
 
// Get Profile (only if logged in)
exports.getProfile = async (req, res) => {
 
  try {
    const user = await User.findById(req.session.userId).select('-password');
   
    if (!user) return res.status(404).json({ message: 'User not found' });
   
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
 
// Update Profile
exports.updateProfile = async (req, res) => {
 
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.session.userId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
 
    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
 
// controllers/userController.js
 
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout failed:', err);
        return res.status(500).json({ message: 'Logout failed', error: err.message });
      }
   
      res.clearCookie('connect.sid'); 
   
      
      return res.json({message:'Logged out successfully'}); 
    });
  };
  
  exports.uploadKYC = async (req, res) => {
    try {
      const userId = req.user._id;
      const { kycDocumentType } = req.body;
  
      if (!req.file || !kycDocumentType) {
        return res.status(400).json({ message: 'Document and type are required' });
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, {
        isKYCVerified: false,
        kycDocument: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
          fileName: req.file.originalname,
          kycDocumentType
        }
      }, { new: true });
  
      res.status(200).json({ message: 'KYC uploaded successfully', user: updatedUser });
    } catch (error) {
      console.error('KYC upload error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };