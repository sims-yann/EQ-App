const express = require('express');
const router = express.Router();
const ImportController = require('../controllers/import.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const { validateQuizImport, validateQuestionImport } = require('../validators/question.validator');

// All routes require authentication and admin authorization
router.use(authenticate, authorize('Admin'));

  
// NEW: Import questions directly to quiz
  
router.post(
    '/questions/quiz/:quizId',
    handleUpload('file'),
    validateQuizImport,
    ImportController.importQuestionsToQuiz
);

  
// LEGACY: Import questions without quiz
  
router.post(
    '/questions',
    handleUpload('file'),
    validateQuestionImport,
    ImportController.importQuestions
);

// Preview questions from Excel (without importing)
router.post(
    '/preview',
    handleUpload('file'),
    ImportController.previewQuestions
);

// Validate Excel file format
router.post(
    '/validate',
    handleUpload('file'),
    ImportController.validateFile
);

module.exports = router;