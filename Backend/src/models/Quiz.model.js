const db = require('../config/database');

class QuizModel {
    // Create quiz
    static async create(quizData) {
        const query = `
      INSERT INTO quizzes (quiz_title, course_id, evaluation_type_id, 
                          publish_date, close_date, is_active, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await db.execute(query, [
            quizData.quizTitle,
            quizData.courseId,
            quizData.evaluationTypeId,
            quizData.publishDate || null,
            quizData.closeDate || null,
            quizData.isActive !== undefined ? quizData.isActive : false,
            quizData.createdBy
        ]);

        return result.insertId;
    }

    // Find quiz by ID with full details
    static async findById(quizId) {
        const query = `
      SELECT q.*, c.course_name, c.course_code, 
             et.type_name as evaluation_type,
             cl.class_name, s.semester_name, ay.year,
             u.first_name as creator_first_name, 
             u.last_name as creator_last_name,
             COUNT(DISTINCT qq.question_id) as question_count,
             COUNT(DISTINCT sa.student_id) as participant_count
      FROM quizzes q
      JOIN courses c ON q.course_id = c.course_id
      JOIN evaluation_types et ON q.evaluation_type_id = et.type_id
      JOIN classes cl ON c.class_id = cl.class_id
      JOIN semesters s ON c.semester_id = s.semester_id
      JOIN academic_years ay ON s.year_id = ay.year_id
      JOIN users u ON q.created_by = u.user_id
      LEFT JOIN quiz_questions qq ON q.quiz_id = qq.quiz_id
      LEFT JOIN student_answers sa ON q.quiz_id = sa.quiz_id
      WHERE q.quiz_id = ?
      GROUP BY q.quiz_id
    `;

        const [rows] = await db.execute(query, [quizId]);
        return rows[0] || null;
    }

    // Get all quizzes
    static async getAll() {
        const query = `
      SELECT q.*, c.course_name, c.course_code, 
             et.type_name as evaluation_type,
             cl.class_name,
             COUNT(DISTINCT qq.question_id) as question_count,
             COUNT(DISTINCT sa.student_id) as participant_count
      FROM quizzes q
      JOIN courses c ON q.course_id = c.course_id
      JOIN evaluation_types et ON q.evaluation_type_id = et.type_id
      JOIN classes cl ON c.class_id = cl.class_id
      LEFT JOIN quiz_questions qq ON q.quiz_id = qq.quiz_id
      LEFT JOIN student_answers sa ON q.quiz_id = sa.quiz_id
      GROUP BY q.quiz_id
      ORDER BY q.created_at DESC
    `;

        const [rows] = await db.execute(query);
        return rows;
    }

    // Get quizzes by course
    static async getByCourse(courseId) {
        const query = `
      SELECT q.*, et.type_name as evaluation_type,
             COUNT(DISTINCT qq.question_id) as question_count,
             COUNT(DISTINCT sa.student_id) as participant_count
      FROM quizzes q
      JOIN evaluation_types et ON q.evaluation_type_id = et.type_id
      LEFT JOIN quiz_questions qq ON q.quiz_id = qq.quiz_id
      LEFT JOIN student_answers sa ON q.quiz_id = sa.quiz_id
      WHERE q.course_id = ?
      GROUP BY q.quiz_id
      ORDER BY q.created_at DESC
    `;

        const [rows] = await db.execute(query, [courseId]);
        return rows;
    }

    // Get active quizzes
    static async getActive() {
        const query = `
      SELECT q.*, c.course_name, c.course_code,
             et.type_name as evaluation_type,
             cl.class_name,
             COUNT(DISTINCT qq.question_id) as question_count
      FROM quizzes q
      JOIN courses c ON q.course_id = c.course_id
      JOIN evaluation_types et ON q.evaluation_type_id = et.type_id
      JOIN classes cl ON c.class_id = cl.class_id
      LEFT JOIN quiz_questions qq ON q.quiz_id = qq.quiz_id
      WHERE q.is_active = true 
        AND (q.publish_date IS NULL OR q.publish_date <= NOW())
        AND (q.close_date IS NULL OR q.close_date >= NOW())
      GROUP BY q.quiz_id
      ORDER BY q.publish_date DESC
    `;

        const [rows] = await db.execute(query);
        return rows;
    }

    // Get quizzes available for a student (by class)
    static async getAvailableForStudent(classId) {
        if (!classId) {
            throw new Error('Class ID is required');
        }
        const query = `
      SELECT q.*, c.course_name, c.course_code,
             et.type_name as evaluation_type,
             COUNT(DISTINCT qq.question_id) as question_count
      FROM quizzes q
      JOIN courses c ON q.course_id = c.course_id
      JOIN evaluation_types et ON q.evaluation_type_id = et.type_id
      LEFT JOIN quiz_questions qq ON q.quiz_id = qq.quiz_id
      WHERE c.class_id = ?
        AND q.is_active = true
        AND (q.publish_date IS NULL OR q.publish_date <= NOW())
        AND (q.close_date IS NULL OR q.close_date >= NOW())
      GROUP BY q.quiz_id
      ORDER BY q.publish_date DESC
    `;

        const [rows] = await db.execute(query, [classId]);
        return rows;
    }

    // Update quiz
    static async update(quizId, quizData) {
        const query = `
      UPDATE quizzes 
      SET quiz_title = ?, course_id = ?, evaluation_type_id = ?,
          publish_date = ?, close_date = ?, is_active = ?
      WHERE quiz_id = ?
    `;

        const [result] = await db.execute(query, [
            quizData.quizTitle,
            quizData.courseId,
            quizData.evaluationTypeId,
            quizData.publishDate || null,
            quizData.closeDate || null,
            quizData.isActive,
            quizId
        ]);

        return result.affectedRows > 0;
    }

    // Delete quiz
    static async delete(quizId) {
        const query = 'DELETE FROM quizzes WHERE quiz_id = ?';
        const [result] = await db.execute(query, [quizId]);
        return result.affectedRows > 0;
    }

    // Toggle quiz active status
    static async toggleActive(quizId, isActive) {
        const query = 'UPDATE quizzes SET is_active = ? WHERE quiz_id = ?';
        const [result] = await db.execute(query, [isActive, quizId]);
        return result.affectedRows > 0;
    }

    // Add question to quiz
    static async addQuestion(quizId, questionId, orderIndex = 0) {
        const query = `
      INSERT INTO quiz_questions (quiz_id, question_id, order_index)
      VALUES (?, ?, ?)
    `;

        await db.execute(query, [quizId, questionId, orderIndex]);
    }

    // Remove question from quiz
    static async removeQuestion(quizId, questionId) {
        const query = 'DELETE FROM quiz_questions WHERE quiz_id = ? AND question_id = ?';
        const [result] = await db.execute(query, [quizId, questionId]);
        return result.affectedRows > 0;
    }

    // Get questions in quiz
    static async getQuestions(quizId) {
        const query = `
            SELECT
                q.question_id,
                q.question_text,
                q.type_id,
                q.course_id,
                q.evaluation_type_id,
                q.difficulty_level,
                q.is_active,
                q.created_at,
                qt.type_name,
                qq.order_index,
                COUNT(pa.answer_id) AS answer_count
            FROM quiz_questions qq
                     JOIN questions q ON qq.question_id = q.question_id
                     JOIN question_types qt ON q.type_id = qt.type_id
                     LEFT JOIN possible_answers pa ON q.question_id = pa.question_id
            WHERE qq.quiz_id = ?
            GROUP BY
                q.question_id,
                qq.order_index,
                qt.type_name,
                q.question_text,
                q.type_id,
                q.course_id,
                q.evaluation_type_id,
                q.difficulty_level,
                q.is_active,
                q.created_at
            ORDER BY qq.order_index ASC
        `;

        const [rows] = await db.execute(query, [quizId]);
        return rows;
    }


    // Get quiz with questions and answers
    static async getQuizWithQuestions(quizId) {
        // Get quiz details
        const quiz = await this.findById(quizId);
        if (!quiz) return null;

        // Get questions
        const questions = await this.getQuestions(quizId);

        // Get possible answers for each MCQ question
        for (const question of questions) {
            if (question.type_name === 'MCQ') {
                const answerQuery = `
          SELECT answer_id, answer_text, order_index
          FROM possible_answers
          WHERE question_id = ?
          ORDER BY order_index
        `;
                const [answers] = await db.execute(answerQuery, [question.question_id]);
                question.possible_answers = answers;
            }
        }

        quiz.questions = questions;
        return quiz;
    }

    // Check if quiz has submissions
    static async hasSubmissions(quizId) {
        const query = 'SELECT COUNT(*) as count FROM student_answers WHERE quiz_id = ?';
        const [rows] = await db.execute(query, [quizId]);
        return rows[0].count > 0;
    }

    // Check if student has submitted quiz
    static async hasStudentSubmitted(quizId, studentId) {
        const query = `
      SELECT COUNT(DISTINCT question_id) as answered_count
      FROM student_answers 
      WHERE quiz_id = ? AND student_id = ?
    `;
        const [rows] = await db.execute(query, [quizId, studentId]);
        return rows[0].answered_count > 0;
    }

    // Bulk add questions to quiz
    static async bulkAddQuestions(quizId, questionIds) {
        const values = questionIds.map((qId, index) => [quizId, qId, index]);
        const query = `
      INSERT INTO quiz_questions (quiz_id, question_id, order_index)
      VALUES ?
    `;

        await db.query(query, [values]);
    }
}

module.exports = QuizModel;
