const { body, param, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

// Academic Year Validators
const validateAcademicYearCreation = [
    body('year')
        .trim()
        .notEmpty().withMessage('Academic year is required')
        .matches(/^\d{4}-\d{4}$/).withMessage('Year must be in format YYYY-YYYY (e.g., 2024-2025)'),

    body('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Invalid start date format'),

    body('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('Invalid end date format'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

const validateAcademicYearUpdate = [
    body('year')
        .optional()
        .trim()
        .matches(/^\d{4}-\d{4}$/).withMessage('Year must be in format YYYY-YYYY'),

    body('startDate')
        .optional()
        .isISO8601().withMessage('Invalid start date format'),

    body('endDate')
        .optional()
        .isISO8601().withMessage('Invalid end date format'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// Semester Validators
const validateSemesterCreation = [
    body('yearId')
        .notEmpty().withMessage('Academic year ID is required')
        .isInt({ min: 1 }).withMessage('Invalid academic year ID'),

    body('semesterName')
        .trim()
        .notEmpty().withMessage('Semester name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Semester name must be 2-100 characters'),

    body('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Invalid start date format'),

    body('endDate')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('Invalid end date format'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

const validateSemesterUpdate = [
    body('semesterName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Semester name must be 2-100 characters'),

    body('startDate')
        .optional()
        .isISO8601().withMessage('Invalid start date format'),

    body('endDate')
        .optional()
        .isISO8601().withMessage('Invalid end date format'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// Class Validators
const validateClassCreation = [
    body('className')
        .trim()
        .notEmpty().withMessage('Class name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Class name must be 2-100 characters'),

    body('level')
        .trim()
        .notEmpty().withMessage('Level is required')
        .isLength({ max: 50 }).withMessage('Level must not exceed 50 characters'),

    body('yearId')
        .notEmpty().withMessage('Academic year ID is required')
        .isInt({ min: 1 }).withMessage('Invalid academic year ID'),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department must not exceed 100 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

const validateClassUpdate = [
    body('className')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Class name must be 2-100 characters'),

    body('level')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('Level must not exceed 50 characters'),

    body('yearId')
        .optional()
        .isInt({ min: 1 }).withMessage('Invalid academic year ID'),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department must not exceed 100 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// Course Validators
const validateCourseCreation = [
    body('courseName')
        .trim()
        .notEmpty().withMessage('Course name is required')
        .isLength({ min: 2, max: 255 }).withMessage('Course name must be 2-255 characters'),

    body('courseCode')
        .trim()
        .notEmpty().withMessage('Course code is required')
        .isLength({ min: 2, max: 50 }).withMessage('Course code must be 2-50 characters'),

    body('lecturer')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('Lecturer name must not exceed 255 characters'),

    body('classId')
        .notEmpty().withMessage('Class ID is required')
        .isInt({ min: 1 }).withMessage('Invalid class ID'),

    body('credits')
        .optional()
        .isInt({ min: 0, max: 20 }).withMessage('Credits must be between 0 and 20'),

    body('semesterId')
        .notEmpty().withMessage('Semester ID is required')
        .isInt({ min: 1 }).withMessage('Invalid semester ID'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

const validateCourseUpdate = [
    body('courseName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 255 }).withMessage('Course name must be 2-255 characters'),

    body('courseCode')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Course code must be 2-50 characters'),

    body('lecturer')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('Lecturer name must not exceed 255 characters'),

    body('credits')
        .optional()
        .isInt({ min: 0, max: 20 }).withMessage('Credits must be between 0 and 20'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// ID Parameter Validator
const validateIdParam = [
    param('id')
        .isInt({ min: 1 }).withMessage('Invalid ID parameter'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

module.exports = {
    validateAcademicYearCreation,
    validateAcademicYearUpdate,
    validateSemesterCreation,
    validateSemesterUpdate,
    validateClassCreation,
    validateClassUpdate,
    validateCourseCreation,
    validateCourseUpdate,
    validateIdParam
};
