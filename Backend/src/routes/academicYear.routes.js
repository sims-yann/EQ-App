const express = require('express');
const router = express.Router();
const AcademicYearController = require('../controllers/academicYear.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const {
    validateAcademicYearCreation,
    validateAcademicYearUpdate,
    validateIdParam
} = require('../validators/academic.validator');

// All routes require authentication and admin authorization
router.use(authenticate, authorize('Admin'));

// Create academic year
router.post('/', validateAcademicYearCreation, AcademicYearController.create);

// Get all academic years
router.get('/', AcademicYearController.getAll);

// Get active academic year
router.get('/active', AcademicYearController.getActive);

// Get academic year by ID
router.get('/:id', validateIdParam, AcademicYearController.getById);

// Update academic year
router.put('/:id', validateIdParam, validateAcademicYearUpdate, AcademicYearController.update);

// Delete academic year
router.delete('/:id', validateIdParam, AcademicYearController.delete);

// Set active academic year
router.patch('/:id/activate', validateIdParam, AcademicYearController.setActive);

module.exports = router;
