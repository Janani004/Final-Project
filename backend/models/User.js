
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true, 
  },
  phone: String,
  address: String,
  gender: {      
    type: String,
    enum: ['Male', 'Female', 'Other'], 
  },
  dob: Date,   
  role:{
type:String,
default:"user"
  },
kycDocument: {
  data: Buffer,
  contentType: String,
  fileName: String,
  kycDocumentType: String,
},
isKYCVerified: {
  type: Boolean,
  default: false,
},
isKYCRejected: {
  type: Boolean,
  default: false,
},
},{ timestamps: true })


// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Generate customer ID if not already present
  if (!this.customerId) {
    this.customerId = 'CUST-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  next();
});

// Add a method to compare entered password with hashed one
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

 