const QuizModel = require('../models/Quiz.model');
const CourseModel = require('../models/Course.model');
const EvaluationTypeModel = require('../models/EvaluationType.model');
const QuestionModel = require('../models/Question.model');
const { ValidationError, NotFoundError, AuthorizationError } = require('../utils/errorTypes');

class QuizService {
    // Create new quiz
    static async create(data, createdBy) {
        // Validate course exists
        const course = await CourseModel.findById(data.courseId);
        if (!course) {
            throw new NotFoundError('Course not found');
        }

        // Validate evaluation type exists
        const evaluationType = await EvaluationTypeModel.findById(data.evaluationTypeId);
        if (!evaluationType) {
            throw new NotFoundError('Evaluation type not found');
        }

        // Validate dates
        if (data.publishDate && data.closeDate) {
            const publishDate = new Date(data.publishDate);
            const closeDate = new Date(data.closeDate);

            if (closeDate <= publishDate) {
                throw new ValidationError('Close date must be after publish date');
            }
        }

        // Create quiz
        const quizId = await QuizModel.create({
            ...data,
            createdBy
        });

        return await QuizModel.findById(quizId);
    }

    // Get all quizzes
    static async getAll() {
        return await QuizModel.getAll();
    }

    // Get quiz by ID
    static async getById(quizId) {
        const quiz = await QuizModel.findById(quizId);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }
        return quiz;
    }

    // Get quiz with questions
    static async getQuizWithQuestions(quizId) {
        const quiz = await QuizModel.getQuizWithQuestions(quizId);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }
        return quiz;
    }

    // Get quizzes by course
    static async getByCourse(courseId) {
        const course = await CourseModel.findById(courseId);
        if (!course) {
            throw new NotFoundError('Course not found');
        }
        return await QuizModel.getByCourse(courseId);
    }

    // Get active quizzes
    static async getActive() {
        return await QuizModel.getActive();
    }

    // Get quizzes available for student
    static async getAvailableForStudent(studentId, classId) {
        if (!classId) {
            throw new ValidationError('Student class information is missing');
        }
        return await QuizModel.getAvailableForStudent(classId);
    }

    // Update quiz
    static async update(quizId, data) {
        const existingQuiz = await QuizModel.findById(quizId);
        if (!existingQuiz) {
            throw new NotFoundError('Quiz not found');
        }

        // Check if quiz has submissions
        const hasSubmissions = await QuizModel.hasSubmissions(quizId);
        if (hasSubmissions && data.courseId && data.courseId !== existingQuiz.course_id) {
            throw new ValidationError('Cannot change course for quiz with submissions');
        }

        // Validate dates if provided
        if (data.publishDate && data.closeDate) {
            const publishDate = new Date(data.publishDate);
            const closeDate = new Date(data.closeDate);

            if (closeDate <= publishDate) {
                throw new ValidationError('Close date must be after publish date');
            }
        }

        const updated = await QuizModel.update(quizId, {
            quizTitle: data.quizTitle || existingQuiz.quiz_title,
            courseId: data.courseId || existingQuiz.course_id,
            evaluationTypeId: data.evaluationTypeId || existingQuiz.evaluation_type_id,
            publishDate: data.publishDate !== undefined ? data.publishDate : existingQuiz.publish_date,
            closeDate: data.closeDate !== undefined ? data.closeDate : existingQuiz.close_date,
            isActive: data.isActive !== undefined ? data.isActive : existingQuiz.is_active
        });

        if (!updated) {
            throw new Error('Failed to update quiz');
        }

        return await QuizModel.findById(quizId);
    }

    // Delete quiz
    static async delete(quizId) {
        const existingQuiz = await QuizModel.findById(quizId);
        if (!existingQuiz) {
            throw new NotFoundError('Quiz not found');
        }

        // Check if quiz has submissions
        const hasSubmissions = await QuizModel.hasSubmissions(quizId);
        if (hasSubmissions) {
            throw new ValidationError('Cannot delete quiz with student submissions');
        }

        const deleted = await QuizModel.delete(quizId);
        if (!deleted) {
            throw new Error('Failed to delete quiz');
        }

        return { message: 'Quiz deleted successfully' };
    }

    // Toggle quiz active status
    static async toggleActive(quizId) {
        const quiz = await QuizModel.findById(quizId);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }

        const newStatus = !quiz.is_active;
        await QuizModel.toggleActive(quizId, newStatus);

        return await QuizModel.findById(quizId);
    }

    // Add question to quiz
    static async addQuestion(quizId, questionId) {
        const quiz = await QuizModel.findById(quizId);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }

        const question = await QuestionModel.findById(questionId);
        if (!question) {
            throw new NotFoundError('Question not found');
        }

        // Verify question belongs to same course
        if (question.course_id !== quiz.course_id) {
            throw new ValidationError('Question must belong to the same course as the quiz');
        }

        await QuizModel.addQuestion(quizId, questionId);

        return { message: 'Question added to quiz successfully' };
    }

    // Remove question from quiz
    static async removeQuestion(quizId, questionId) {
        const quiz = await QuizModel.findById(quizId);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }

        // Check if quiz has submissions for this question
        const hasSubmissions = await QuizModel.hasSubmissions(quizId);
        if (hasSubmissions) {
            throw new ValidationError('Cannot remove questions from quiz with submissions');
        }

        const removed = await QuizModel.removeQuestion(quizId, questionId);
        if (!removed) {
            throw new NotFoundError('Question not found in quiz');
        }

        return { message: 'Question removed from quiz successfully' };
    }

    // Get questions in quiz
    static async getQuestions(quizId) {
        const quiz = await QuizModel.findById(quizId);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }

        return await QuizModel.getQuestions(quizId);
    }
}

module.exports = QuizService;
