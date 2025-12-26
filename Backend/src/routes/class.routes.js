const ClassController = require('../controllers/class.controller');
const express = require('express');

const {
    validateClassCreation,
    validateClassUpdate, validateIdParam
} = require('../validators/academic.validator');
const {authorize} = require("../middleware/rbac.middleware");
const {authenticate} = require("../middleware/auth.middleware");

const classRouter = express.Router();

// All routes require authentication and admin authorization
classRouter.use(authenticate, authorize('Admin'));

// Create class
classRouter.post('/', validateClassCreation, ClassController.create);

// Get all classes
classRouter.get('/', ClassController.getAll);

// Get classes by academic year
classRouter.get('/year/:yearId', validateIdParam, ClassController.getByAcademicYear);

// Get class by ID
classRouter.get('/:id', validateIdParam, ClassController.getById);

// Get students in class
classRouter.get('/:id/students', validateIdParam, ClassController.getStudents);

// Update class
classRouter.put('/:id', validateIdParam, validateClassUpdate, ClassController.update);

// Delete class
classRouter.delete('/:id', validateIdParam, ClassController.delete);

module.exports = classRouter;