
const OtpVerification = require('../models/OtpVerification');

const User = require('../models/User');

const nodemailer = require('nodemailer');

const crypto = require('crypto');

// Generate a 6-digit OTP

function generateOtp() {

 return Math.floor(100000 + Math.random() * 900000).toString();

}
// Send OTP email

async function sendOtpEmail(email, otp) {

const transporter = nodemailer.createTransport({

service: process.env.EMAIL_SERVICE,

 auth: {

 user: process.env.EMAIL_USER,

 pass: process.env.EMAIL_PASS,

 }

 });



 const mailOptions = {

from: process.env.EMAIL_USER,

to: email,

subject: 'Your OTP for Password Reset',

 text: `Your OTP is ${otp}. It will expire in ${process.env.OTP_EXPIRATION_TIME || 5} minutes.`,

};



 await transporter.sendMail(mailOptions);

}



// Controller: Send OTP

exports.sendOTP = async (req, res) => {

 const { email } = req.body;

try {

    const existingOtp = await OtpVerification.findOne({ email });

    if (existingOtp && existingOtp.otpExpires > new Date()) {

      return res.status(400).json({ error: 'OTP already sent and still valid. Please check your email.' });

    }

    const otp = generateOtp();

    const otpExpires = new Date();

    otpExpires.setMinutes(otpExpires.getMinutes() + (parseInt(process.env.OTP_EXPIRATION_TIME) || 5));

    await OtpVerification.deleteMany({ email }); // Clear old OTPs

    await OtpVerification.create({ email, otp, otpExpires });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to email successfully.' });
  } catch (error) {

    console.error('Error sending OTP:', error);

    res.status(500).json({ error: 'Internal server error. Please try again later.' });

  }

};


// Controller: Verify OTP

exports.verifyOTP = async (req, res) => {

  const { email, otp } = req.body;

  try {

    const otpRecord = await OtpVerification.findOne({ email });

    if (!otpRecord) {

      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });

    }
    if (otpRecord.otp !== otp || otpRecord.otpExpires < new Date()) {

      return res.status(400).json({ error: 'Invalid or expired OTP.' });

    }
    await OtpVerification.deleteOne({ email });

    res.status(200).json({ message: 'OTP verified successfully.' });

 

  } catch (error) {

    console.error('Error verifying OTP:', error);

    res.status(500).json({ error: 'Internal server error.' });

  }

};

 

// Controller: Reset Password

exports.resetPassword = async (req, res) => {

  const { email, newPassword } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; 

    await user.save();


    res.status(200).json({ message: 'Password reset successful.' });


  } catch (error) {

    res.status(500).json({ message: 'Error resetting password', error: error.message });

  }

};