const AuthService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

class AuthController {
    // Admin signup
    static async adminSignup(req, res) {
        try {
            const result = await AuthService.adminSignup(req.body);
            return successResponse(res, result, result.message, 201);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Verify email with code
    static async verifyEmail(req, res) {
        try {
            const { code } = req.body;
            const result = await AuthService.verifyEmail(code);
            return successResponse(res, result, result.message);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 400);
        }
    }

    // Resend verification code
    static async resendVerificationCode(req, res) {
        try {
            const { email } = req.body;
            const result = await AuthService.resendVerificationCode(email);
            return successResponse(res, result, result.message);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 400);
        }
    }

    // Admin login
    static async adminLogin(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.adminLogin(email, password);
            return successResponse(res, result, 'Login successful');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Student login
    static async studentLogin(req, res) {
        try {
            const { matricule, email } = req.body;
            const result = await AuthService.studentLogin(matricule, email);
            return successResponse(res, result, 'Login successful');
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Create student (by admin)
    static async createStudent(req, res) {
        try {
            const result = await AuthService.createStudent(req.body);
            return successResponse(res, result, 'Student created successfully', 201);
        } catch (error) {
            return errorResponse(res, error.message, error.statusCode || 500);
        }
    }

    // Get current user info
    static async getCurrentUser(req, res) {
        try {
            return successResponse(res, req.user, 'User info retrieved');
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    }
}

module.exports = AuthController;