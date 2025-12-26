const db = require('../config/database');

class ClassModel {
    // Create new class
    static async create(classData) {
        const query = `
      INSERT INTO classes (class_name, level, year_id, department)
      VALUES (?, ?, ?, ?)
    `;
        const [result] = await db.execute(query, [
            classData.className,
            classData.level,
            classData.yearId,
            classData.department
        ]);
        return result.insertId;
    }

    // Find class by ID
    static async findById(classId) {
        const query = `
            SELECT c.*, ay.year, ay.start_date, ay.end_date
            FROM classes c
                     LEFT JOIN academic_years ay ON c.year_id = ay.year_id
            WHERE c.class_id = ?
        `;
        const [rows] = await db.execute(query, [classId]);
        return rows[0] || null;
    }

    // Get all classes
    static async getAll() {
        const query = `
      SELECT c.*, ay.year, COUNT(u.user_id) as student_count
      FROM classes c
      LEFT JOIN academic_years ay ON c.year_id = ay.year_id
      LEFT JOIN users u ON c.class_id = u.class_id
      GROUP BY c.class_id
      ORDER BY ay.year DESC, c.level, c.class_name
    `;
        const [rows] = await db.execute(query);
        return rows;
    }

    // Get classes by academic year
    static async getByAcademicYear(yearId) {
        const query = `
      SELECT c.*, COUNT(u.user_id) as student_count
      FROM classes c
      LEFT JOIN users u ON c.class_id = u.class_id
      WHERE c.year_id = ?
      GROUP BY c.class_id
      ORDER BY c.level, c.class_name
    `;
        const [rows] = await db.execute(query, [yearId]);
        return rows;
    }

    // Update class
    static async update(classId, classData) {
        const query = `
      UPDATE classes 
      SET class_name = ?, level = ?, year_id = ?, department = ?
      WHERE class_id = ?
    `;
        const [result] = await db.execute(query, [
            classData.className,
            classData.level,
            classData.yearId,
            classData.department,
            classId
        ]);
        return result.affectedRows > 0;
    }

    // Delete class
    static async delete(classId) {
        const query = 'DELETE FROM classes WHERE class_id = ?';
        const [result] = await db.execute(query, [classId]);
        return result.affectedRows > 0;
    }

    // Check if class has students
    static async hasStudents(classId) {
        const query = 'SELECT COUNT(*) as count FROM users WHERE class_id = ?';
        const [rows] = await db.execute(query, [classId]);
        return rows[0].count > 0;
    }

    // Get students in class
    static async getStudents(classId) {
        const query = `
            SELECT u.user_id, u.first_name, u.last_name, u.email, u.matricule,
                   u.registration_date, u.is_active
            FROM users u
            WHERE u.class_id = ? AND u.role_id = (SELECT role_id FROM roles WHERE role_name = 'Student')
            ORDER BY u.last_name, u.first_name
        `;
        const [rows] = await db.execute(query, [classId]);
        return rows;
    }
}

module.exports = ClassModel;
