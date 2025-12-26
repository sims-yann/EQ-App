const db = require('../config/database');

class RoleModel {
    static async findByName(roleName) {
        const query = 'SELECT * FROM roles WHERE role_name = ?';
        const [rows] = await db.execute(query, [roleName]);
        return rows[0] || null;
    }

    static async findById(roleId) {
        const query = 'SELECT * FROM roles WHERE role_id = ?';
        const [rows] = await db.execute(query, [roleId]);
        return rows[0] || null;
    }
}

module.exports = RoleModel;
