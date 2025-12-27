const { body, param, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

// Import to quiz validation
const validateQuizImport = [
    param('quizId')
        .notEmpty().withMessage('Quiz ID is required')
        .isInt({ min: 1 }).withMessage('Invalid quiz ID'),

    body('difficultyLevel')
        .optional()
        .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),

    body('allowDuplicates')
        .optional()
        .isBoolean().withMessage('allowDuplicates must be boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

// Import question validation (legacy)
const validateQuestionImport = [
    body('courseId')
        .notEmpty().withMessage('Course ID is required')
        .isInt({ min: 1 }).withMessage('Invalid course ID'),

    body('evaluationTypeId')
        .notEmpty().withMessage('Evaluation type ID is required')
        .isInt({ min: 1 }).withMessage('Invalid evaluation type ID'),

    body('difficultyLevel')
        .optional()
        .isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),

    body('allowDuplicates')
        .optional()
        .isBoolean().withMessage('allowDuplicates must be boolean'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }
        next();
    }
];

module.exports = {
    validateQuizImport,
    validateQuestionImport
};