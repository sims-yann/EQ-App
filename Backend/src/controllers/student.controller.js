const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

class StudentController {
   // change stydent class
    async changeClass(req, res, next) {
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
            const { classId } = req.body;

            const student = await userService.updateStudentClass(userId, classId);

            res.status(200).json({
                success: true,
                message: 'Class updated successfully',
                data: student
            });
        } catch (error) {
            next(error);
        }
    }
// get student info
    async getClassInfo(req, res, next) {
        try {
            const userId = req.user.userId;
            const student = await userService.getStudentById(userId);

            res.status(200).json({
                success: true,
                data: {
                    userId: student.userId,
                    classId: student.classId,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    matricule: student.matricule
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();