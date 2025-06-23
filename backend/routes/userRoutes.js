// routes/userRoutes.js
 
const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const {isUserAuthenticated}=require('../middleware/userAuthMiddleware');
const upload = require('../middleware/upload');
const router = express.Router();
 
// POST /user/register


router.post(
  '/register',
  [
    body('name').matches(/^[A-Za-z\s]+$/).withMessage('Name should contain only alphabets'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/\d/).withMessage('Password must contain at least one number')
      .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character'),
  ],
 userController.registerUser
);

router.post('/login', userController.loginUser);
router.get('/profile', isUserAuthenticated,userController.getProfile);
router.put('/profile', isUserAuthenticated, userController.updateProfile);
router.post('/logout', isUserAuthenticated,userController.logoutUser);
router.post('/uploadKYC', isUserAuthenticated, upload.single('kycFile'),userController. uploadKYC);
module.exports = router;