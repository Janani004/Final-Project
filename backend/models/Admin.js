const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type:String,
  }
}, { timestamps: true }); // Adds createdAt and updatedAt
 
// Hash the password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
 
// Method to compare entered password with hashed password
adminSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
 
module.exports = mongoose.model('Admin', adminSchema);

 