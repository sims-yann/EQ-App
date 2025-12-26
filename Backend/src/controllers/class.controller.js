const ClassService = require('../services/class.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

class ClassController {
    // Create new class
    static async create(req, res) {
        try {
            const result = await ClassService.create(req.body);
            return successResponse(res, result, 'Class created successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get all classes
    static async getAll(req, res) {
        try {
            const result = await ClassService.getAll();
            return successResponse(res, result, 'Classes retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get class by ID
    static async getById(req, res) {
        try {
            const result = await ClassService.getById(req.params.id);
            return successResponse(res, result, 'Class retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get classes by academic year
    static async getByAcademicYear(req, res) {
        try {
            const result = await ClassService.getByAcademicYear(req.params.yearId);
            return successResponse(res, result, 'Classes retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Update class
    static async update(req, res) {
        try {
            const result = await ClassService.update(req.params.id, req.body);
            return successResponse(res, result, 'Class updated successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Delete class
    static async delete(req, res) {
        try {
            const result = await ClassService.delete(req.params.id);
            return successResponse(res, result, 'Class deleted successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get students in class
    static async getStudents(req, res) {
        try {
            const result = await ClassService.getStudents(req.params.id);
            return successResponse(res, result, 'Students retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = ClassController;
