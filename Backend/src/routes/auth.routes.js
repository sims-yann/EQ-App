const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const {
    validateAdminSignup,
    validateAdminLogin,
    validateStudentLogin,
    validateStudentCreation
} = require('../validators/auth.validator');

// Public routes
router.post('/admin/signup', validateAdminSignup, AuthController.adminSignup);
router.post('/admin/login', validateAdminLogin, AuthController.adminLogin);
router.post('/student/login', validateStudentLogin, AuthController.studentLogin);

// Protected routes (Admin only)
router.post(
    '/student/create',
    authenticate,
    authorize('Admin'),
    validateStudentCreation,
    AuthController.createStudent
);

// Get current user
router.get('/me', authenticate, AuthController.getCurrentUser);

module.exports = router;