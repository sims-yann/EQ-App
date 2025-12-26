const CourseService = require('../services/course.service');
const {successResponse, errorResponse} = require("../utils/apiResponse");

class CourseController {
    static async create(req, res) {
        try {
            const result = await CourseService.create(req.body);
            return successResponse(res, result, 'Course created successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async getAll(req, res) {
        try {
            const result = await CourseService.getAll();
            return successResponse(res, result, 'Courses retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async getById(req, res) {
        try {
            const result = await CourseService.getById(req.params.id);
            return successResponse(res, result, 'Course retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async getByClass(req, res) {
        try {
            const result = await CourseService.getByClass(req.params.classId);
            return successResponse(res, result, 'Courses retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async getBySemester(req, res) {
        try {
            const result = await CourseService.getBySemester(req.params.semesterId);
            return successResponse(res, result, 'Courses retrieved successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async update(req, res) {
        try {
            const result = await CourseService.update(req.params.id, req.body);
            return successResponse(res, result, 'Course updated successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    static async delete(req, res) {
        try {
            const result = await CourseService.delete(req.params.id);
            return successResponse(res, result, 'Course deleted successfully');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }
}

module.exports = CourseController;

