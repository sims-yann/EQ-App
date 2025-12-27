const QuizService = require('../services/quiz.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

class QuizController {
    // Create quiz
    static async create(req, res) {
        try {
            const result = await QuizService.create(req.body, req.user.userId);
            return successResponse(res, result, 'Quiz created successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get all quizzes
    static async getAll(req, res) {
        try {
            const result = await QuizService.getAll();
            return successResponse(res, result, 'Quizzes retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get quiz by ID
    static async getById(req, res) {
        try {
            const result = await QuizService.getById(req.params.id);
            return successResponse(res, result, 'Quiz retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get quiz with questions
    static async getQuizWithQuestions(req, res) {
        try {
            const result = await QuizService.getQuizWithQuestions(req.params.id);
            return successResponse(res, result, 'Quiz with questions retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get quizzes by course
    static async getByCourse(req, res) {
        try {
            const result = await QuizService.getByCourse(req.params.courseId);
            return successResponse(res, result, 'Quizzes retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get active quizzes
    static async getActive(req, res) {
        try {
            const result = await QuizService.getActive();
            return successResponse(res, result, 'Active quizzes retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get available quizzes for student
    static async getAvailableForStudent(req, res) {
        try {

            // Check if user has classId
            if (!req.user.classId) {
                return errorResponse(res, 'Student is not assigned to a class', 400);
            }

            const result = await QuizService.getAvailableForStudent(
                req.user.userId,
                req.user.classId
            );
            return successResponse(res, result, 'Available quizzes retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Update quiz
    static async update(req, res) {
        try {
            const result = await QuizService.update(req.params.id, req.body);
            return successResponse(res, result, 'Quiz updated successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Delete quiz
    static async delete(req, res) {
        try {
            const result = await QuizService.delete(req.params.id);
            return successResponse(res, result, 'Quiz deleted successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Toggle quiz active status
    static async toggleActive(req, res) {
        try {
            const result = await QuizService.toggleActive(req.params.id);
            return successResponse(res, result, 'Quiz status toggled successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Add question to quiz
    static async addQuestion(req, res) {
        try {
            const result = await QuizService.addQuestion(req.params.id, req.body.questionId);
            return successResponse(res, result, 'Question added to quiz successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Remove question from quiz
    static async removeQuestion(req, res) {
        try {
            const result = await QuizService.removeQuestion(req.params.id, req.params.questionId);
            return successResponse(res, result, 'Question removed from quiz successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get questions in quiz
    static async getQuestions(req, res) {
        try {
            const result = await QuizService.getQuestions(req.params.id);
            return successResponse(res, result, 'Quiz questions retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = QuizController;