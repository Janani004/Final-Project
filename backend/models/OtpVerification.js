// models/OtpVerification.js
 
const mongoose = require('mongoose');
 
const otpVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index:true,
  },
  otp: {
    type: String,
    required: true
  },
  otpExpires: {
    type: Date,
    required: true
  },
}, { timestamps: true });
 
module.exports = mongoose.model('OtpVerification', otpVerificationSchema);
 