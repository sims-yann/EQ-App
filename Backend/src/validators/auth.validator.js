const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

// Admin signup validation
const validateAdminSignup = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number and special character'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// Student login validation
const validateStudentLogin = [
    body('matricule')
        .trim()
        .notEmpty().withMessage('Matricule is required'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// Admin login validation
const validateAdminLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// Student creation validation (by admin)
const validateStudentCreation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('matricule')
        .trim()
        .notEmpty().withMessage('Matricule is required')
        .isLength({ min: 3, max: 50 }).withMessage('Matricule must be 3-50 characters'),

    body('classId')
        .notEmpty().withMessage('Class ID is required')
        .isInt({ min: 1 }).withMessage('Invalid class ID'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

module.exports = {
    validateAdminSignup,
    validateStudentLogin,
    validateAdminLogin,
    validateStudentCreation
};