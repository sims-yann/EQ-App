const SemesterController = require('../controllers/semester.controller');
const express = require('express');

const {
    validateSemesterCreation,
    validateSemesterUpdate, validateIdParam
} = require('../validators/academic.validator');
const {authorize} = require("../middleware/rbac.middleware");
const {authenticate} = require("../middleware/auth.middleware");

const semesterRouter = express.Router();

// All routes require authentication and admin authorization
semesterRouter.use(authenticate, authorize('Admin'));

// Create semester
semesterRouter.post('/', validateSemesterCreation, SemesterController.create);

// Get all semesters
semesterRouter.get('/', SemesterController.getAll);

// Get active semester
semesterRouter.get('/active', SemesterController.getActive);

// Get semesters by academic year
semesterRouter.get('/year/:yearId', validateIdParam, SemesterController.getByAcademicYear);

// Get semester by ID
semesterRouter.get('/:id', validateIdParam, SemesterController.getById);

// Update semester
semesterRouter.put('/:id', validateIdParam, validateSemesterUpdate, SemesterController.update);

// Delete semester
semesterRouter.delete('/:id', validateIdParam, SemesterController.delete);

// Set active semester
semesterRouter.patch('/:id/activate', validateIdParam, SemesterController.setActive);

module.exports = semesterRouter;
