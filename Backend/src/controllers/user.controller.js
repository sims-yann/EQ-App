const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

class UserController {
   // get current profile info
    async getProfile(req, res, next) {
        try {
            const userId = req.user.userId;
            const profile = await userService.getProfile(userId);

            res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    }

   // update current profile
    async updateProfile(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const userId = req.user.userId;
            const profile = await userService.updateProfile(userId, req.body);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: profile
            });
        } catch (error) {
            next(error);
        }
    }

    // get all student
    async getAllStudents(req, res, next) {
        try {
            const filters = {
                classId: req.query.classId,
                emailVerified: req.query.emailVerified,
                isActive: req.query.isActive
            };

            const pagination = {
                page: req.query.page || 1,
                limit: req.query.limit || 20
            };

            const result = await userService.getAllStudents(filters, pagination);

            res.status(200).json({
                success: true,
                data: result.students,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    }

    // Get student by ID
    async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await userService.getStudentById(id);

            res.status(200).json({
                success: true,
                data: student
            });
        } catch (error) {
            next(error);
        }
    }

    // deactive user
    async deactivateUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await userService.deactivateUser(id);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    // Reactive user
    async reactivateUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await userService.reactivateUser(id);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    // get user statistic
    async getUserStats(req, res, next) {
        try {
            const stats = await userService.getUserStats();

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();