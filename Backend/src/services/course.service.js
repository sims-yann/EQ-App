const CourseModel = require('../models/Course.model');
const {ValidationError, NotFoundError} = require("../utils/errorTypes");

class CourseService {
    // Create course
    static async create(data) {
        // Check if course code already exists
        const codeExists = await CourseModel.codeExists(data.courseCode);
        if (codeExists) {
            throw new ValidationError('Course code already exists');
        }

        const courseId = await CourseModel.create(data);
        return await CourseModel.findById(courseId);
    }

    // Get all courses
    static async getAll() {
        return await CourseModel.getAll();
    }

    // Get by ID
    static async getById(courseId) {
        const course = await CourseModel.findById(courseId);
        if (!course) {
            throw new NotFoundError('Course not found');
        }
        return course;
    }

    // Get by class
    static async getByClass(classId) {
        return await CourseModel.getByClass(classId);
    }

    // Get by semester
    static async getBySemester(semesterId) {
        return await CourseModel.getBySemester(semesterId);
    }

    // Update course
    static async update(courseId, data) {
        const existing = await CourseModel.findById(courseId);
        if (!existing) {
            throw new NotFoundError('Course not found');
        }

        // Check if course code is being changed and already exists
        if (data.courseCode && data.courseCode !== existing.course_code) {
            const codeExists = await CourseModel.codeExists(data.courseCode, courseId);
            if (codeExists) {
                throw new ValidationError('Course code already exists');
            }
        }

        const updated = await CourseModel.update(courseId, data);
        if (!updated) {
            throw new Error('Failed to update course');
        }

        return await CourseModel.findById(courseId);
    }

    // Delete course
    static async delete(courseId) {
        const existing = await CourseModel.findById(courseId);
        if (!existing) {
            throw new NotFoundError('Course not found');
        }

        // Check if has quizzes
        const hasQuizzes = await CourseModel.hasQuizzes(courseId);
        if (hasQuizzes) {
            throw new ValidationError('Cannot delete course with associated quizzes');
        }

        const deleted = await CourseModel.delete(courseId);
        if (!deleted) {
            throw new Error('Failed to delete course');
        }

        return { message: 'Course deleted successfully' };
    }
}

module.exports = CourseService;
