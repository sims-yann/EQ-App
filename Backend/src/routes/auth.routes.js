const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const {
    validateAdminSignup,
    validateEmailVerification,
    validateResendCode,
    validateAdminLogin,
    validateStudentLogin,
    validateStudentCreation
} = require('../validators/auth.validator');

  
// PUBLIC ROUTES
  

// Admin signup (creates unverified account)
router.post('/admin/signup', validateAdminSignup, AuthController.adminSignup);

// Verify email with code
router.post('/verify-email', validateEmailVerification, AuthController.verifyEmail);

// Resend verification code
router.post('/resend-code', validateResendCode, AuthController.resendVerificationCode);

// Admin login (requires verified email)
router.post('/admin/login', validateAdminLogin, AuthController.adminLogin);

// Student login (no verification needed)
router.post('/student/login', validateStudentLogin, AuthController.studentLogin);

  
// PROTECTED ROUTES (Admin only)
  

// Create student account (admin only)
router.post(
    '/student/create',
    authenticate,
    authorize('Admin'),
    validateStudentCreation,
    AuthController.createStudent
);

  
// AUTHENTICATED ROUTES
  

// Get current user info
router.get('/me', authenticate, AuthController.getCurrentUser);

module.exports = router;