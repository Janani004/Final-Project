 
const express = require('express');
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const otpController = require('../controllers/otpController');
const nodemailer = require('nodemailer');
const router = express.Router();
 
// Limit OTP requests to prevent abuse
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many OTP requests. Please try again later.'
});

// Request OTP
router.post(
  '/request',
  otpRequestLimiter,
  [check('email').isEmail().withMessage('Please enter a valid email')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    otpController.sendOTP(req, res);
  }
 
);
 
// Verify OTP
router.post(
  '/verify',
  [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('otp').isNumeric().withMessage('OTP must be a number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    otpController.verifyOTP(req, res);
  }
);
 
// Reset password after OTP verification
router.post(
  '/reset',
  [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    otpController.resetPassword(req, res);
  }
);
 
module.exports = router;
 