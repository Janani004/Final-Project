 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
 
// Route imports
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const otpRoutes = require('./routes/otpRoutes');

 
const app = express();
 
// Enable CORS
app.use(cors({origin: 'http://localhost:3000', 
  credentials: true,}));
 
// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
 
// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax'
  }
}));
 



// Register routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/otp', otpRoutes);

 
// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});


