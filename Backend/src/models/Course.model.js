const db = require('../config/database');

class CourseModel {
    // Create course
    static async create(courseData) {
        const query = `
            INSERT INTO courses (course_name, course_code, lecturer, class_id,
                                 credits, semester_id, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            courseData.courseName,
            courseData.courseCode,
            courseData.lecturer,
            courseData.classId,
            courseData.credits,
            courseData.semesterId,
            courseData.description
        ]);
        return result.insertId;
    }

    // Find by ID
    static async findById(courseId) {
        const query = `
            SELECT c.*, cl.class_name, s.semester_name, ay.year
            FROM courses c
                     JOIN classes cl ON c.class_id = cl.class_id
                     JOIN semesters s ON c.semester_id = s.semester_id
                     JOIN academic_years ay ON s.year_id = ay.year_id
            WHERE c.course_id = ?
        `;
        const [rows] = await db.execute(query, [courseId]);
        return rows[0] || null;
    }

    // Find by course code
    static async findByCode(courseCode) {
        const query = 'SELECT * FROM courses WHERE course_code = ?';
        const [rows] = await db.execute(query, [courseCode]);
        return rows[0] || null;
    }

    // Get all courses
    static async getAll() {
        const query = `
            SELECT c.*, cl.class_name, s.semester_name, ay.year,
                   COUNT(DISTINCT q.quiz_id) as quiz_count
            FROM courses c
                     JOIN classes cl ON c.class_id = cl.class_id
                     JOIN semesters s ON c.semester_id = s.semester_id
                     JOIN academic_years ay ON s.year_id = ay.year_id
                     LEFT JOIN quizzes q ON c.course_id = q.course_id
            GROUP BY c.course_id
            ORDER BY ay.start_date DESC, s.start_date DESC, c.course_name
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    // Get courses by class
    static async getByClass(classId) {
        const query = `
            SELECT c.*, s.semester_name, COUNT(q.quiz_id) as quiz_count
            FROM courses c
                     JOIN semesters s ON c.semester_id = s.semester_id
                     LEFT JOIN quizzes q ON c.course_id = q.course_id
            WHERE c.class_id = ?
            GROUP BY c.course_id
            ORDER BY s.start_date DESC, c.course_name
        `;
        const [rows] = await db.execute(query, [classId]);
        return rows;
    }

    // Get courses by semester
    static async getBySemester(semesterId) {
        const query = `
      SELECT c.*, cl.class_name, COUNT(q.quiz_id) as quiz_count
      FROM courses c
      JOIN classes cl ON c.class_id = cl.class_id
      LEFT JOIN quizzes q ON c.course_id = q.course_id
      WHERE c.semester_id = ?
      GROUP BY c.course_id
      ORDER BY cl.class_name, c.course_name
    `;
        const [rows] = await db.execute(query, [semesterId]);
        return rows;
    }

    // Update course
    static async update(courseId, courseData) {
        const query = `
            UPDATE courses
            SET course_name = ?, course_code = ?, lecturer = ?,
                credits = ?, description = ?
            WHERE course_id = ?
        `;
        const [result] = await db.execute(query, [
            courseData.courseName,
            courseData.courseCode,
            courseData.lecturer,
            courseData.credits,
            courseData.description,
            courseId
        ]);
        return result.affectedRows > 0;
    }

    // Delete course
    static async delete(courseId) {
        const query = 'DELETE FROM courses WHERE course_id = ?';
        const [result] = await db.execute(query, [courseId]);
        return result.affectedRows > 0;
    }

    // Check if has quizzes
    static async hasQuizzes(courseId) {
        const query = 'SELECT COUNT(*) as count FROM quizzes WHERE course_id = ?';
        const [rows] = await db.execute(query, [courseId]);
        return rows[0].count > 0;
    }

    // Check if course code exists
    static async codeExists(courseCode, excludeCourseId = null) {
        let query = 'SELECT COUNT(*) as count FROM courses WHERE course_code = ?';
        const params = [courseCode];

        if (excludeCourseId) {
            query += ' AND course_id != ?';
            params.push(excludeCourseId);
        }

        const [rows] = await db.execute(query, params);
        return rows[0].count > 0;
    }
}

module.exports = CourseModel;