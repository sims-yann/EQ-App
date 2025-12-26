const SemesterService = require('../services/semester.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

class SemesterController {
    static async create(req, res) {
        try {
            const result = await SemesterService.create(req.body);
            return successResponse(res, result, 'Semester created successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async getAll(req, res) {
        try {
            const result = await SemesterService.getAll();
            return successResponse(res, result, 'Semesters retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async getActive(req, res) {
        try {
            const result = await SemesterService.getActive();
            return successResponse(res, result, 'Active semester retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async getById(req, res) {
        try {
            const result = await SemesterService.getById(req.params.id);
            return successResponse(res, result, 'Semester retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async getByAcademicYear(req, res) {
        try {
            const result = await SemesterService.getByAcademicYear(req.params.yearId);
            return successResponse(res, result, 'Semesters retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async update(req, res) {
        try {
            const result = await SemesterService.update(req.params.id, req.body);
            return successResponse(res, result, 'Semester updated successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async delete(req, res) {
        try {
            const result = await SemesterService.delete(req.params.id);
            return successResponse(res, result, 'Semester deleted successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async setActive(req, res) {
        try {
            const result = await SemesterService.setActive(req.params.id);
            return successResponse(res, result, 'Semester set as active');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = SemesterController;
