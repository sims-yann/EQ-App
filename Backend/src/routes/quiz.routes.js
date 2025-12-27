const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/quiz.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const {
    validateQuizCreation,
    validateQuizUpdate,
    validateAddQuestion,
    validateIdParam
} = require('../validators/quiz.validator');

// All routes require authentication
router.use(authenticate);

  
// ADMIN ROUTES
  

// Create quiz (Admin only)
router.post(
    '/',
    authorize('Admin'),
    validateQuizCreation,
    QuizController.create
);

// Get all quizzes (Admin only)
router.get(
    '/',
    authorize('Admin'),
    QuizController.getAll
);

// Get active quizzes (Admin only)
router.get(
    '/active',
    authorize('Admin'),
    QuizController.getActive
);

// Get quizzes by course (Admin only)
router.get(
    '/course/:courseId',
    authorize('Admin'),
    validateIdParam,
    QuizController.getByCourse
);

// Get quiz by ID (Admin only)
router.get(
    '/:id',
    authorize('Admin'),
    validateIdParam,
    QuizController.getById
);

// Get quiz with questions (Admin only)
router.get(
    '/:id/full',
    authorize('Admin'),
    validateIdParam,
    QuizController.getQuizWithQuestions
);

// Update quiz (Admin only)
router.put(
    '/:id',
    authorize('Admin'),
    validateIdParam,
    validateQuizUpdate,
    QuizController.update
);

// Delete quiz (Admin only)
router.delete(
    '/:id',
    authorize('Admin'),
    validateIdParam,
    QuizController.delete
);

// Toggle quiz active status (Admin only)
router.patch(
    '/:id/toggle-active',
    authorize('Admin'),
    validateIdParam,
    QuizController.toggleActive
);

// Add question to quiz (Admin only)
router.post(
    '/:id/questions',
    authorize('Admin'),
    validateIdParam,
    validateAddQuestion,
    QuizController.addQuestion
);

// Remove question from quiz (Admin only)
router.delete(
    '/:id/questions/:questionId',
    authorize('Admin'),
    validateIdParam,
    QuizController.removeQuestion
);

// Get questions in quiz (Admin only)
router.get(
    '/:id/questions',
    authorize('Admin'),
    validateIdParam,
    QuizController.getQuestions
);

  
// STUDENT ROUTES
  

// Get available quizzes for student
router.get(
    '/student/available',
    authorize('Student'),
    QuizController.getAvailableForStudent
);

// Get quiz for taking (Student only)
router.get(
    '/student/:id',
    authorize('Student'),
    validateIdParam,
    QuizController.getQuizWithQuestions
);

module.exports = router;