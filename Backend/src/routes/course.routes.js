const CourseController = require('../controllers/course.controller');
const express = require('express');

const {
    validateCourseCreation,
    validateCourseUpdate, validateIdParam
} = require('../validators/academic.validator');
const {authorize} = require("../middleware/rbac.middleware");
const {authenticate} = require("../middleware/auth.middleware");

const courseRouter = express.Router();

// All routes require authentication
courseRouter.use(authenticate);

// Create course (Admin only)
courseRouter.post('/', authorize('Admin'), validateCourseCreation, CourseController.create);

// Get all courses
courseRouter.get('/', CourseController.getAll);

// Get courses by class
courseRouter.get('/class/:classId', validateIdParam, CourseController.getByClass);

// Get courses by semester
courseRouter.get('/semester/:semesterId', validateIdParam, CourseController.getBySemester);

// Get course by ID
courseRouter.get('/:id', validateIdParam, CourseController.getById);

// Update course (Admin only)
courseRouter.put('/:id', authorize('Admin'), validateIdParam, validateCourseUpdate, CourseController.update);

// Delete course (Admin only)
courseRouter.delete('/:id', authorize('Admin'), validateIdParam, CourseController.delete);

module.exports = courseRouter;