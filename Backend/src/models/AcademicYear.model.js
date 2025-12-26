const db = require('../config/database');

class AcademicYearModel {
    // Create academic year
    static async create(yearData) {
        const query = `
      INSERT INTO academic_years (year, start_date, end_date, is_active)
      VALUES (?, ?, ?, ?)
    `;
        const [result] = await db.execute(query, [
            yearData.year,
            yearData.startDate,
            yearData.endDate,
            yearData.isActive || false
        ]);
        return result.insertId;
    }

    // Find by ID
    static async findById(yearId) {
        const query = 'SELECT * FROM academic_years WHERE year_id = ?';
        const [rows] = await db.execute(query, [yearId]);
        return rows[0] || null;
    }

    // Find by year name
    static async findByYear(year) {
        const query = 'SELECT * FROM academic_years WHERE year = ?';
        const [rows] = await db.execute(query, [year]);
        return rows[0] || null;
    }

    // Get all academic years
    static async getAll() {
        const query = `
      SELECT ay.*, COUNT(DISTINCT c.class_id) as class_count,
             COUNT(DISTINCT s.semester_id) as semester_count
      FROM academic_years ay
      LEFT JOIN classes c ON ay.year_id = c.year_id
      LEFT JOIN semesters s ON ay.year_id = s.year_id
      GROUP BY ay.year_id
      ORDER BY ay.start_date DESC
    `;
        const [rows] = await db.execute(query);
        return rows;
    }

    // Get active academic year
    static async getActive() {
        const query = 'SELECT * FROM academic_years WHERE is_active = true LIMIT 1';
        const [rows] = await db.execute(query);
        return rows[0] || null;
    }

    // Update academic year
    static async update(yearId, yearData) {
        const query = `
      UPDATE academic_years 
      SET year = ?, start_date = ?, end_date = ?, is_active = ?
      WHERE year_id = ?
    `;
        const [result] = await db.execute(query, [
            yearData.year,
            yearData.startDate,
            yearData.endDate,
            yearData.isActive,
            yearId
        ]);
        return result.affectedRows > 0;
    }

    // Delete academic year
    static async delete(yearId) {
        const query = 'DELETE FROM academic_years WHERE year_id = ?';
        const [result] = await db.execute(query, [yearId]);
        return result.affectedRows > 0;
    }

    // Set active academic year
    static async setActive(yearId) {
        await db.execute('UPDATE academic_years SET is_active = false');
        const query = 'UPDATE academic_years SET is_active = true WHERE year_id = ?';
        const [result] = await db.execute(query, [yearId]);
        return result.affectedRows > 0;
    }

    // Check if has associated data
    static async hasAssociatedData(yearId) {
        const query = `
      SELECT 
        (SELECT COUNT(*) FROM classes WHERE year_id = ?) as classes,
        (SELECT COUNT(*) FROM semesters WHERE year_id = ?) as semesters
    `;
        const [rows] = await db.execute(query, [yearId, yearId]);
        return rows[0].classes > 0 || rows[0].semesters > 0;
    }
}

module.exports = AcademicYearModel;
