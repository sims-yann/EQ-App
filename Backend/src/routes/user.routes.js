const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const studentController = require('../controllers/student.controller');
const {
    updateProfileValidation,
    changeClassValidation,
    paginationValidation
} = require('../middleware/validation.middleware');
const { extractUser, requireAuth, requireAdmin, requireStudent } = require('../middleware/rbac.middleware');

// Apply user extraction to all routes
router.use(extractUser);

// User profile routes (authenticated users)
router.get('/profile', requireAuth, userController.getProfile);
router.put('/profile', requireAuth, updateProfileValidation, userController.updateProfile);

// Student-specific routes
router.put('/students/change-class', requireStudent, changeClassValidation, studentController.changeClass);
router.get('/students/class-info', requireStudent, studentController.getClassInfo);

// Admin-only routes for managing students
router.get('/students', requireAdmin, paginationValidation, userController.getAllStudents);
router.get('/students/:id', requireAdmin, userController.getStudentById);
router.put('/students/:id/deactivate', requireAdmin, userController.deactivateUser);
router.put('/students/:id/reactivate', requireAdmin, userController.reactivateUser);
router.get('/stats', requireAdmin, userController.getUserStats);

module.exports = router;
