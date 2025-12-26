const db = require('../config/database');
class SemesterModel {
    // Create semester
    static async create(semesterData) {
        const query = `
            INSERT INTO semesters (year_id, semester_name, start_date, end_date, is_active)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            semesterData.yearId,
            semesterData.semesterName,
            semesterData.startDate,
            semesterData.endDate,
            semesterData.isActive || false
        ]);
        return result.insertId;
    }

    // Find by ID
    static async findById(semesterId) {
        const query = `
            SELECT s.*, ay.year
            FROM semesters s
                     JOIN academic_years ay ON s.year_id = ay.year_id
            WHERE s.semester_id = ?
        `;
        const [rows] = await db.execute(query, [semesterId]);
        return rows[0] || null;
    }

    // Get all semesters
    static async getAll() {
        const query = `
            SELECT s.*, ay.year, COUNT(c.course_id) as course_count
            FROM semesters s
                     JOIN academic_years ay ON s.year_id = ay.year_id
                     LEFT JOIN courses c ON s.semester_id = c.semester_id
            GROUP BY s.semester_id
            ORDER BY ay.start_date DESC, s.start_date DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    // Get semesters by academic year
    static async getByAcademicYear(yearId) {
        const query = `
            SELECT s.*, COUNT(c.course_id) as course_count
            FROM semesters s
                     LEFT JOIN courses c ON s.semester_id = c.semester_id
            WHERE s.year_id = ?
            GROUP BY s.semester_id
            ORDER BY s.start_date
        `;
        const [rows] = await db.execute(query, [yearId]);
        return rows;
    }

    // Get active semester
    static async getActive() {
        const query = `
            SELECT s.*, ay.year
            FROM semesters s
                     JOIN academic_years ay ON s.year_id = ay.year_id
            WHERE s.is_active = true
                LIMIT 1
        `;
        const [rows] = await db.execute(query);
        return rows[0] || null;
    }

    // Update semester
    static async update(semesterId, semesterData) {
        const query = `
            UPDATE semesters
            SET semester_name = ?, start_date = ?, end_date = ?, is_active = ?
            WHERE semester_id = ?
        `;
        const [result] = await db.execute(query, [
            semesterData.semesterName,
            semesterData.startDate,
            semesterData.endDate,
            semesterData.isActive,
            semesterId
        ]);
        return result.affectedRows > 0;
    }

    // Delete semester
    static async delete(semesterId) {
        const query = 'DELETE FROM semesters WHERE semester_id = ?';
        const [result] = await db.execute(query, [semesterId]);
        return result.affectedRows > 0;
    }

    // Set active semester
    static async setActive(semesterId) {
        await db.execute('UPDATE semesters SET is_active = false');
        const query = 'UPDATE semesters SET is_active = true WHERE semester_id = ?';
        const [result] = await db.execute(query, [semesterId]);
        return result.affectedRows > 0;
    }

    // Check if has courses
    static async hasCourses(semesterId) {
        const query = 'SELECT COUNT(*) as count FROM courses WHERE semester_id = ?';
        const [rows] = await db.execute(query, [semesterId]);
        return rows[0].count > 0;
    }
}

module.exports = SemesterModel;
