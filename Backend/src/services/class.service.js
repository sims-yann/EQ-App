const ClassModel = require('../models/Class.model');
const { ValidationError, NotFoundError } = require('../utils/errorTypes');

class ClassService {
    // Create new class
    static async create(data) {
        // Validate class doesn't already exist
        const classes = await ClassModel.getByAcademicYear(data.yearId);
        const duplicate = classes.find(c =>
            c.class_name === data.className && c.level === data.level
        );

        if (duplicate) {
            throw new ValidationError('Class with this name and level already exists');
        }

        const classId = await ClassModel.create(data);
        return await ClassModel.findById(classId);
    }

    // Get all classes
    static async getAll() {
        return await ClassModel.getAll();
    }

    // Get class by ID
    static async getById(classId) {
        const classData = await ClassModel.findById(classId);
        if (!classData) {
            throw new NotFoundError('Class not found');
        }
        return classData;
    }

    // Get classes by academic year
    static async getByAcademicYear(yearId) {
        return await ClassModel.getByAcademicYear(yearId);
    }

    // Update class
    static async update(classId, data) {
        const existingClass = await ClassModel.findById(classId);
        if (!existingClass) {
            throw new NotFoundError('Class not found');
        }

        const updated = await ClassModel.update(classId, data);
        if (!updated) {
            throw new Error('Failed to update class');
        }

        return await ClassModel.findById(classId);
    }

    // Delete class
    static async delete(classId) {
        const existingClass = await ClassModel.findById(classId);
        if (!existingClass) {
            throw new NotFoundError('Class not found');
        }

        // Check if class has students
        const hasStudents = await ClassModel.hasStudents(classId);
        if (hasStudents) {
            throw new ValidationError('Cannot delete class with enrolled students');
        }

        const deleted = await ClassModel.delete(classId);
        if (!deleted) {
            throw new Error('Failed to delete class');
        }

        return { message: 'Class deleted successfully' };
    }

    // Get students in class
    static async getStudents(classId) {
        const existingClass = await ClassModel.findById(classId);
        if (!existingClass) {
            throw new NotFoundError('Class not found');
        }

        return await ClassModel.getStudents(classId);
    }
}

module.exports = ClassService;