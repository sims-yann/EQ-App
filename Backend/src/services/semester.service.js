const SemesterModel = require('../models/Semester.model');

class SemesterService {
    // Create semester
    static async create(data) {
        // Validate dates
        if (new Date(data.endDate) <= new Date(data.startDate)) {
            throw new ValidationError('End date must be after start date');
        }

        const semesterId = await SemesterModel.create(data);
        return await SemesterModel.findById(semesterId);
    }

    // Get all semesters
    static async getAll() {
        return await SemesterModel.getAll();
    }

    // Get active semester
    static async getActive() {
        const activeSemester = await SemesterModel.getActive();
        if (!activeSemester) {
            throw new NotFoundError('No active semester found');
        }
        return activeSemester;
    }

    // Get by ID
    static async getById(semesterId) {
        const semester = await SemesterModel.findById(semesterId);
        if (!semester) {
            throw new NotFoundError('Semester not found');
        }
        return semester;
    }

    // Get by academic year
    static async getByAcademicYear(yearId) {
        return await SemesterModel.getByAcademicYear(yearId);
    }

    // Update semester
    static async update(semesterId, data) {
        const existing = await SemesterModel.findById(semesterId);
        if (!existing) {
            throw new NotFoundError('Semester not found');
        }

        // Validate dates if provided
        if (data.endDate && data.startDate) {
            if (new Date(data.endDate) <= new Date(data.startDate)) {
                throw new ValidationError('End date must be after start date');
            }
        }

        const updated = await SemesterModel.update(semesterId, data);
        if (!updated) {
            throw new Error('Failed to update semester');
        }

        return await SemesterModel.findById(semesterId);
    }

    // Delete semester
    static async delete(semesterId) {
        const existing = await SemesterModel.findById(semesterId);
        if (!existing) {
            throw new NotFoundError('Semester not found');
        }

        // Check if has courses
        const hasCourses = await SemesterModel.hasCourses(semesterId);
        if (hasCourses) {
            throw new ValidationError('Cannot delete semester with associated courses');
        }

        const deleted = await SemesterModel.delete(semesterId);
        if (!deleted) {
            throw new Error('Failed to delete semester');
        }

        return { message: 'Semester deleted successfully' };
    }

    // Set active semester
    static async setActive(semesterId) {
        const existing = await SemesterModel.findById(semesterId);
        if (!existing) {
            throw new NotFoundError('Semester not found');
        }

        await SemesterModel.setActive(semesterId);
        return await SemesterModel.findById(semesterId);
    }
}

module.exports = SemesterService;
