const AcademicYearService = require('../services/academicYear.service');
const {successResponse, errorResponse} = require("../utils/apiResponse");

class AcademicYearController {
    // Create academic year
    static async create(req, res) {
        try {
            const result = await AcademicYearService.create(req.body);
            return successResponse(res, result, 'Academic year created successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get all academic years
    static async getAll(req, res) {
        try {
            const result = await AcademicYearService.getAll();
            return successResponse(res, result, 'Academic years retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get active academic year
    static async getActive(req, res) {
        try {
            const result = await AcademicYearService.getActive();
            return successResponse(res, result, 'Active academic year retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get by ID
    static async getById(req, res) {
        try {
            const result = await AcademicYearService.getById(req.params.id);
            return successResponse(res, result, 'Academic year retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Update academic year
    static async update(req, res) {
        try {
            const result = await AcademicYearService.update(req.params.id, req.body);
            return successResponse(res, result, 'Academic year updated successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Delete academic year
    static async delete(req, res) {
        try {
            const result = await AcademicYearService.delete(req.params.id);
            return successResponse(res, result, 'Academic year deleted successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Set active academic year
    static async setActive(req, res) {
        try {
            const result = await AcademicYearService.setActive(req.params.id);
            return successResponse(res, result, 'Academic year set as active');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = AcademicYearController;