const ExcelImportService = require('../services/excelImport.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

class ImportController {

    //  Import questions from Excel to specific quiz
    //   POST /api/import/questions/quiz/:quizId
    static async importQuestionsToQuiz(req, res) {
        try {
            if (!req.file) {
                return errorResponse(res, 'No file uploaded', 400);
            }

            const quizId = parseInt(req.params.quizId);
            const { difficultyLevel, allowDuplicates } = req.body;

            const options = {
                difficultyLevel: difficultyLevel || 'medium',
                allowDuplicates: allowDuplicates === 'true' || allowDuplicates === true
            };

            const result = await ExcelImportService.importQuestionsToQuiz(
                req.file.buffer,
                quizId,
                req.user.userId,
                options
            );

            return successResponse(res, result, 'Questions imported to quiz successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }


    //  Import questions from Excel (legacy - without quiz)
    //  POST /api/import/questions

    static async importQuestions(req, res) {
        try {
            if (!req.file) {
                return errorResponse(res, 'No file uploaded', 400);
            }

            const { courseId, evaluationTypeId, difficultyLevel, allowDuplicates } = req.body;

            // Validate required fields
            if (!courseId || !evaluationTypeId) {
                return errorResponse(res, 'Course ID and Evaluation Type ID are required', 400);
            }

            const options = {
                difficultyLevel: difficultyLevel || 'medium',
                allowDuplicates: allowDuplicates === 'true' || allowDuplicates === true
            };

            const result = await ExcelImportService.importQuestions(
                req.file.buffer,
                parseInt(courseId),
                parseInt(evaluationTypeId),
                req.user.userId,
                options
            );

            return successResponse(res, result, 'Questions imported successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }


    //  * Preview questions from Excel
    //  * POST /api/import/preview

    static async previewQuestions(req, res) {
        try {
            if (!req.file) {
                return errorResponse(res, 'No file uploaded', 400);
            }

            const result = await ExcelImportService.previewQuestions(req.file.buffer);
            return successResponse(res, result, 'Preview generated successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    //  * Validate Excel file format
    //  * POST /api/import/validate

    static async validateFile(req, res) {
        try {
            if (!req.file) {
                return errorResponse(res, 'No file uploaded', 400);
            }

            const result = await ExcelImportService.validateExcelFile(req.file.buffer);

            if (result.valid) {
                return successResponse(res, result, 'File format is valid');
            } else {
                return errorResponse(res, result.message, 400, result);
            }
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = ImportController;