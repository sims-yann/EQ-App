// services/excelImport.service.js - UPDATED
const ExcelParser = require('../utils/excelParser');
const QuestionModel = require('../models/Question.model');
const QuestionTypeModel = require('../models/QuestionType.model');
const EvaluationTypeModel = require('../models/EvaluationType.model');
const CourseModel = require('../models/Course.model');
const QuizModel = require('../models/Quiz.model');
const { ValidationError, NotFoundError } = require('../utils/errorTypes');

class ExcelImportService {
    /**
     * Import questions from Excel file and associate with quiz
     */
    static async importQuestionsToQuiz(fileBuffer, quizId, createdBy, options = {}) {
        // Validate quiz exists
        const quiz = await QuizModel.findById(quizId);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }

        // Get course and evaluation type from quiz
        const courseId = quiz.course_id;
        const evaluationTypeId = quiz.evaluation_type_id;

        // Validate course exists
        const course = await CourseModel.findById(courseId);
        if (!course) {
            throw new NotFoundError('Course not found');
        }

        // Validate evaluation type exists
        const evaluationType = await EvaluationTypeModel.findById(evaluationTypeId);
        if (!evaluationType) {
            throw new NotFoundError('Evaluation type not found');
        }

        // Parse Excel file
        let parseResult;
        try {
            parseResult = ExcelParser.parseAuto(fileBuffer);
        } catch (error) {
            throw new ValidationError(`Failed to parse Excel file: ${error.message}`);
        }

        const { format, questions } = parseResult;

        // Get question type ID
        const questionType = await QuestionTypeModel.findByName(format);
        if (!questionType) {
            throw new Error(`Question type '${format}' not found in database`);
        }

        // Validate and prepare questions for insertion
        const questionsToInsert = [];
        const skippedQuestions = [];
        const duplicateQuestions = [];

        for (const question of questions) {
            // Check for duplicates if option is enabled
            if (!options.allowDuplicates) {
                const exists = await QuestionModel.exists(question.questionText, courseId);
                if (exists) {
                    duplicateQuestions.push({
                        rowNumber: question.rowNumber,
                        questionText: question.questionText
                    });
                    continue;
                }
            }

            // Prepare question data
            const questionData = {
                questionText: question.questionText,
                typeId: questionType.type_id,
                courseId: courseId,
                evaluationTypeId: evaluationTypeId,
                difficultyLevel: options.difficultyLevel || 'medium',
                createdBy: createdBy,
                isActive: true
            };

            // Add possible answers for MCQ
            if (format === 'MCQ') {
                questionData.possibleAnswers = question.possibleAnswers;
            }

            questionsToInsert.push(questionData);
        }

        // Bulk insert questions AND associate with quiz
        let createdQuestions = [];
        if (questionsToInsert.length > 0) {
            createdQuestions = await QuestionModel.bulkCreateWithQuiz(questionsToInsert, quizId);
        }

        return {
            success: true,
            format: format,
            quizId: quizId,
            quizTitle: quiz.quiz_title,
            totalParsed: questions.length,
            imported: createdQuestions.length,
            skipped: skippedQuestions.length,
            duplicates: duplicateQuestions.length,
            createdQuestions: createdQuestions,
            duplicateQuestions: duplicateQuestions,
            message: `Successfully imported ${createdQuestions.length} questions to quiz "${quiz.quiz_title}"`
        };
    }


    // Import questions from Excel file (legacy - without quiz)

    static async importQuestions(fileBuffer, courseId, evaluationTypeId, createdBy, options = {}) {
        // Validate course exists
        const course = await CourseModel.findById(courseId);
        if (!course) {
            throw new NotFoundError('Course not found');
        }

        // Validate evaluation type exists
        const evaluationType = await EvaluationTypeModel.findById(evaluationTypeId);
        if (!evaluationType) {
            throw new NotFoundError('Evaluation type not found');
        }

        // Parse Excel file
        let parseResult;
        try {
            parseResult = ExcelParser.parseAuto(fileBuffer);
        } catch (error) {
            throw new ValidationError(`Failed to parse Excel file: ${error.message}`);
        }

        const { format, questions } = parseResult;

        // Get question type ID
        const questionType = await QuestionTypeModel.findByName(format);
        if (!questionType) {
            throw new Error(`Question type '${format}' not found in database`);
        }

        // Validate and prepare questions for insertion
        const questionsToInsert = [];
        const skippedQuestions = [];
        const duplicateQuestions = [];

        for (const question of questions) {
            // Check for duplicates if option is enabled
            if (!options.allowDuplicates) {
                const exists = await QuestionModel.exists(question.questionText, courseId);
                if (exists) {
                    duplicateQuestions.push({
                        rowNumber: question.rowNumber,
                        questionText: question.questionText
                    });
                    continue;
                }
            }

            // Prepare question data
            const questionData = {
                questionText: question.questionText,
                typeId: questionType.type_id,
                courseId: courseId,
                evaluationTypeId: evaluationTypeId,
                difficultyLevel: options.difficultyLevel || 'medium',
                createdBy: createdBy,
                isActive: true
            };

            // Add possible answers for MCQ
            if (format === 'MCQ') {
                questionData.possibleAnswers = question.possibleAnswers;
            }

            questionsToInsert.push(questionData);
        }

        // Bulk insert questions
        let createdQuestions = [];
        if (questionsToInsert.length > 0) {
            createdQuestions = await QuestionModel.bulkCreate(questionsToInsert);
        }

        return {
            success: true,
            format: format,
            totalParsed: questions.length,
            imported: createdQuestions.length,
            skipped: skippedQuestions.length,
            duplicates: duplicateQuestions.length,
            createdQuestions: createdQuestions,
            duplicateQuestions: duplicateQuestions,
            message: `Successfully imported ${createdQuestions.length} questions`
        };
    }


    //   Preview questions from Excel without importing

    static async previewQuestions(fileBuffer) {
        try {
            const parseResult = ExcelParser.parseAuto(fileBuffer);

            return {
                success: true,
                format: parseResult.format,
                totalQuestions: parseResult.questions.length,
                questions: parseResult.questions.slice(0, 10), // Preview first 10
                message: `Found ${parseResult.questions.length} questions in ${parseResult.format} format`
            };
        } catch (error) {
            throw new ValidationError(`Failed to preview Excel file: ${error.message}`);
        }
    }

    //   Validate Excel file format

    static async validateExcelFile(fileBuffer) {
        try {
            const format = ExcelParser.detectFormat(fileBuffer);
            return {
                valid: true,
                format: format,
                message: `Valid ${format} format detected`
            };
        } catch (error) {
            return {
                valid: false,
                format: null,
                message: error.message
            };
        }
    }
}

module.exports = ExcelImportService;