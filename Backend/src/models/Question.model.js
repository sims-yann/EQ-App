const db = require('../config/database');

class QuestionModel {
    // Create question with transaction support
    static async create(questionData, connection = null) {
        const conn = connection || db;

        const query = `
      INSERT INTO questions (question_text, type_id, course_id, evaluation_type_id, 
                            difficulty_level, created_by, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await conn.execute(query, [
            questionData.questionText,
            questionData.typeId,
            questionData.courseId,
            questionData.evaluationTypeId,
            questionData.difficultyLevel || 'medium',
            questionData.createdBy,
            questionData.isActive !== undefined ? questionData.isActive : true
        ]);

        return result.insertId;
    }

    // Create possible answer
    static async createPossibleAnswer(answerId, questionId, answerData, connection = null) {
        const conn = connection || db;

        const query = `
      INSERT INTO possible_answers (question_id, answer_text, is_correct, order_index)
      VALUES (?, ?, ?, ?)
    `;

        await conn.execute(query, [
            questionId,
            answerData.answerText,
            answerData.isCorrect,
            answerData.orderIndex
        ]);
    }

    // Add question to quiz
    static async addToQuiz(questionId, quizId, orderIndex, connection = null) {
        const conn = connection || db;

        const query = `
      INSERT INTO quiz_questions (quiz_id, question_id, order_index)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE order_index = VALUES(order_index)
    `;

        await conn.execute(query, [quizId, questionId, orderIndex]);
    }

    // Bulk create questions with answers AND add to quiz (transaction)
    static async bulkCreateWithQuiz(questionsData, quizId, connection = null) {
        const conn = connection || await db.getConnection();
        const shouldCommit = !connection; // Only commit if we created the connection

        try {
            if (shouldCommit) await conn.beginTransaction();

            const createdQuestions = [];

            for (let i = 0; i < questionsData.length; i++) {
                const questionData = questionsData[i];

                // Create question
                const questionId = await this.create(questionData, conn);

                // Create possible answers if provided (for MCQ)
                if (questionData.possibleAnswers && questionData.possibleAnswers.length > 0) {
                    for (const answer of questionData.possibleAnswers) {
                        await this.createPossibleAnswer(null, questionId, answer, conn);
                    }
                }

                // Add question to quiz
                await this.addToQuiz(questionId, quizId, i, conn);

                createdQuestions.push({
                    questionId,
                    questionText: questionData.questionText
                });
            }

            if (shouldCommit) await conn.commit();

            return createdQuestions;
        } catch (error) {
            if (shouldCommit) await conn.rollback();
            throw error;
        } finally {
            if (shouldCommit) conn.release();
        }
    }

    // Bulk create questions with answers (without quiz)
    static async bulkCreate(questionsData, connection = null) {
        const conn = connection || await db.getConnection();
        const shouldCommit = !connection;

        try {
            if (shouldCommit) await conn.beginTransaction();

            const createdQuestions = [];

            for (const questionData of questionsData) {
                // Create question
                const questionId = await this.create(questionData, conn);

                // Create possible answers if provided (for MCQ)
                if (questionData.possibleAnswers && questionData.possibleAnswers.length > 0) {
                    for (const answer of questionData.possibleAnswers) {
                        await this.createPossibleAnswer(null, questionId, answer, conn);
                    }
                }

                createdQuestions.push({
                    questionId,
                    questionText: questionData.questionText
                });
            }

            if (shouldCommit) await conn.commit();

            return createdQuestions;
        } catch (error) {
            if (shouldCommit) await conn.rollback();
            throw error;
        } finally {
            if (shouldCommit) conn.release();
        }
    }

    // Find question by ID with answers
    static async findById(questionId) {
        const questionQuery = `
      SELECT q.*, qt.type_name, et.type_name as evaluation_type,
             u.first_name, u.last_name
      FROM questions q
      JOIN question_types qt ON q.type_id = qt.type_id
      JOIN evaluation_types et ON q.evaluation_type_id = et.type_id
      JOIN users u ON q.created_by = u.user_id
      WHERE q.question_id = ?
    `;

        const answersQuery = `
      SELECT * FROM possible_answers 
      WHERE question_id = ? 
      ORDER BY order_index
    `;

        const [questions] = await db.execute(questionQuery, [questionId]);

        if (questions.length === 0) return null;

        const question = questions[0];
        const [answers] = await db.execute(answersQuery, [questionId]);

        question.possible_answers = answers;
        return question;
    }

    // Get questions by course
    static async getByCourse(courseId) {
        const query = `
      SELECT q.*, qt.type_name, et.type_name as evaluation_type,
             COUNT(pa.answer_id) as answer_count
      FROM questions q
      JOIN question_types qt ON q.type_id = qt.type_id
      JOIN evaluation_types et ON q.evaluation_type_id = et.type_id
      LEFT JOIN possible_answers pa ON q.question_id = pa.question_id
      WHERE q.course_id = ? AND q.is_active = true
      GROUP BY q.question_id
      ORDER BY q.created_at DESC
    `;

        const [rows] = await db.execute(query, [courseId]);
        return rows;
    }

    // Check if question exists
    static async exists(questionText, courseId) {
        const query = `
      SELECT COUNT(*) as count 
      FROM questions 
      WHERE question_text = ? AND course_id = ?
    `;

        const [rows] = await db.execute(query, [questionText, courseId]);
        return rows[0].count > 0;
    }

    // Delete question
    static async delete(questionId) {
        const query = 'DELETE FROM questions WHERE question_id = ?';
        const [result] = await db.execute(query, [questionId]);
        return result.affectedRows > 0;
    }
}

module.exports = QuestionModel;