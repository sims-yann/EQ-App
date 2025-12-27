const { body, param, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

// Quiz creation validation
const validateQuizCreation = [
    body('quizTitle')
        .trim()
        .notEmpty().withMessage('Quiz title is required')
        .isLength({ min: 3, max: 255 }).withMessage('Quiz title must be 3-255 characters'),

    body('courseId')
        .notEmpty().withMessage('Course ID is required')
        .isInt({ min: 1 }).withMessage('Invalid course ID'),

    body('evaluationTypeId')
        .notEmpty().withMessage('Evaluation type ID is required')
        .isInt({ min: 1 }).withMessage('Invalid evaluation type ID'),

    body('publishDate')
        .optional()
        .isISO8601().withMessage('Invalid publish date format'),

    body('closeDate')
        .optional()
        .isISO8601().withMessage('Invalid close date format'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// Quiz update validation
const validateQuizUpdate = [
    body('quizTitle')
        .optional()
        .trim()
        .isLength({ min: 3, max: 255 }).withMessage('Quiz title must be 3-255 characters'),

    body('courseId')
        .optional()
        .isInt({ min: 1 }).withMessage('Invalid course ID'),

    body('evaluationTypeId')
        .optional()
        .isInt({ min: 1 }).withMessage('Invalid evaluation type ID'),

    body('publishDate')
        .optional()
        .isISO8601().withMessage('Invalid publish date format'),

    body('closeDate')
        .optional()
        .isISO8601().withMessage('Invalid close date format'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// Add question to quiz validation
const validateAddQuestion = [
    body('questionId')
        .notEmpty().withMessage('Question ID is required')
        .isInt({ min: 1 }).withMessage('Invalid question ID'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// ID parameter validation
const validateIdParam = [
    param('id')
        .isInt({ min: 1 }).withMessage('Invalid quiz ID'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

module.exports = {
    validateQuizCreation,
    validateQuizUpdate,
    validateAddQuestion,
    validateIdParam
};
