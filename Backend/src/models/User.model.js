const db = require('../config/database');

class UserModel {
    // Create admin user with verification code
    static async createAdmin(userData) {
        const query = `
            INSERT INTO users (first_name, last_name, email, password, role_id,
                               email_verified, is_active, verification_code, verification_expires)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.password,
            userData.roleId,
            false, // email_verified = false initially
            false, // is_active = false until verified
            userData.verificationCode,
            userData.verificationExpires
        ]);
        return result.insertId;
    }

    // Find user with verification code
    static async findByVerificationCode(code) {
        const query = `
            SELECT u.*, r.role_name
            FROM users u
                     JOIN roles r ON u.role_id = r.role_id
            WHERE u.verification_code = ? AND u.verification_expires > NOW()
        `;
        const [rows] = await db.execute(query, [code]);
        return rows[0] || null;
    }

    // Verify user email
    static async verifyEmail(userId) {
        const query = `
            UPDATE users
            SET email_verified = true,
                is_active = true,
                verification_code = NULL,
                verification_expires = NULL
            WHERE user_id = ?
        `;
        const [result] = await db.execute(query, [userId]);
        return result.affectedRows > 0;
    }

    // Resend verification code
    static async updateVerificationCode(userId, code, expires) {
        const query = `
            UPDATE users
            SET verification_code = ?, verification_expires = ?
            WHERE user_id = ?
        `;
        const [result] = await db.execute(query, [code, expires, userId]);
        return result.affectedRows > 0;
    }

    // Create student user
    static async createStudent(userData) {
        const query = `
            INSERT INTO users (first_name, last_name, email, password, matricule, class_id, role_id, email_verified, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.password,
            userData.matricule,
            userData.classId,
            userData.roleId,
            userData.emailVerified || true, // Students auto-verified by admin
            userData.isActive !== undefined ? userData.isActive : true
        ]);
        return result.insertId;
    }

    // Find user by email
    static async findByEmail(email) {
        const query = `
      SELECT u.*, r.role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.email = ?
    `;
        const [rows] = await db.execute(query, [email]);
        return rows[0] || null;
    }

    // Find user by matricule
    static async findByMatricule(matricule) {
        const query = `
      SELECT u.*, r.role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.matricule = ?
    `;
        const [rows] = await db.execute(query, [matricule]);
        return rows[0] || null;
    }

    // Find user by ID
    static async findById(userId) {
        const query = `
      SELECT u.*, r.role_name 
      FROM users u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = ?
    `;
        const [rows] = await db.execute(query, [userId]);
        return rows[0] || null;
    }

    // Update last login
    static async updateLastLogin(userId) {
        const query = 'UPDATE users SET last_login_date = NOW() WHERE user_id = ?';
        await db.execute(query, [userId]);
    }

    // Check if email exists
    static async emailExists(email) {
        const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0].count > 0;
    }

    // Check if matricule exists
    static async matriculeExists(matricule) {
        const query = 'SELECT COUNT(*) as count FROM users WHERE matricule = ?';
        const [rows] = await db.execute(query, [matricule]);
        return rows[0].count > 0;
    }

    // Get all students
    static async getAllStudents() {
        const query = `
      SELECT u.user_id, u.first_name, u.last_name, u.email, u.matricule, 
             u.class_id, c.class_name, u.is_active, u.registration_date
      FROM users u
      LEFT JOIN classes c ON u.class_id = c.class_id
      JOIN roles r ON u.role_id = r.role_id
      WHERE r.role_name = 'Student'
      ORDER BY u.registration_date DESC
    `;
        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = UserModel;