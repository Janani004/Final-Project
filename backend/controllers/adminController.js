// controllers/adminController.js 
const Admin = require('../models/Admin');
const User = require('../models/User'); // Import User model
const nodemailer = require('nodemailer');
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.session.adminId = admin._id; // Set admin session
    res.status(200).json({ message: 'Admin logged in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

 
// Admin verifies KYC for the user
exports.verifyKYC = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId); // Get the user by ID
 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    user.isKYCVerified = true; // Mark the user as KYC verified
    user.isKYCRejected= false;
    await user.save();
 
    res.status(200).json({ message: 'KYC Verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying KYC', error: error.message });
  }
}
async function sendrejectEmail(email) {

const transporter = nodemailer.createTransport({

service: process.env.EMAIL_SERVICE,

 auth: {

 user: process.env.EMAIL_USER,

 pass: process.env.EMAIL_PASS,

 }

 });

 const uploadKYCLink = `${process.env.FRONTEND_URL}`;
 const mailOptions = {

from: process.env.EMAIL_USER,

to: email,

subject: 'Rejection of KYC',


html: `
 <p>Your KYC has been rejected. Please upload your KYC document again using the following link:</p>
 <p><a href="${uploadKYCLink}">Click here to upload your KYC document</a></p>
 `,
};

try {
 const info = await transporter.sendMail(mailOptions);
 console.log('Email sent: ', info.response);
 } catch (error) {
console.error('Error sending email: ', error);
  }
  
}
exports.rejectKYC = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId); // Get the user by ID
 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    user.isKYCRejected= true; // Mark the user as KYC verified
    user.isKYCVerified= false;
    user.kycDocument.data=null;
    user.kycDocument.kycDocumentType=null;
    user.kycDocument.contentType=null;
    user.kycDocument.fileName=null;
    await user.save();
    await sendrejectEmail(user.email);
    res.status(200).json({ message: 'KYC Rejected successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error Rejecting KYC', error: error.message });
  }
}

exports.getKYCFile = async (req, res) => {
    try {
      
      const user = await User.findById(req.params.userId);
   
      if (!user || !user.kycDocument || !user.kycDocument.data) {
        return res.status(404).json({ message: 'KYC document not found' });
      }
   
      res.set('Content-Type', user.kycDocument.contentType);
      res.set('Content-Disposition', `attachment; filename=${user.kycDocument.fileName}`);
      res.send(user.kycDocument.data);
    } catch (err) {
      res.status(500).json({ message: 'Error downloading KYC', error: err.message });
    }
  };


 
  exports.getKYCUsers = async (req, res) => {
    try {
      const users = await User.find({ 'kycDocument.data': { $exists: true ,$ne: null } }, '-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };