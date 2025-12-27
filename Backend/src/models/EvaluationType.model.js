const db = require('../config/database');

class EvaluationTypeModel {
    static async findByName(typeName) {
        const query = 'SELECT * FROM evaluation_types WHERE type_name = ?';
        const [rows] = await db.execute(query, [typeName]);
        return rows[0] || null;
    }

    static async findById(typeId) {
        const query = 'SELECT * FROM evaluation_types WHERE type_id = ?';
        const [rows] = await db.execute(query, [typeId]);
        return rows[0] || null;
    }

    static async getAll() {
        const query = 'SELECT * FROM evaluation_types ORDER BY type_name';
        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = EvaluationTypeModel;
