// scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin'); // Adjust the path if needed

// Replace with your actual MongoDB connection URI
const MONGO_URI = process.env.MONGODB_URI

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const createAdmin = async () => {
  try {
    const Email=process.env.EMAIL_ADMIN
    const Pass=process.env.PASS_ADMIN
    const existingAdmin = await Admin.findOne({ email: Email });
    if (existingAdmin) {
      console.log('Admin already exists');
      mongoose.disconnect();
      return;
    }
  
    const admin = new Admin({
      email:Email ,
      password:Pass,
      role:"admin"
    });

    await admin.save();
    console.log('Admin created successfully!');
  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();