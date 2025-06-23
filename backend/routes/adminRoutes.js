
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdminAuthenticated } = require('../middleware/adminAuthMiddleware');
 
router.post('/login', adminController.loginAdmin);

router.get('/kyc-users', isAdminAuthenticated,adminController.getKYCUsers); // Returns users with KYC uploaded
router.put('/verify-kyc/:userId',isAdminAuthenticated, adminController.verifyKYC); // Verifies KYC
router.put('/reject-kyc/:userId',isAdminAuthenticated, adminController.rejectKYC); // Rejects KYC
router.get('/kyc-file/:userId', isAdminAuthenticated,adminController.getKYCFile); // Sends file buffer

module.exports = router;
   