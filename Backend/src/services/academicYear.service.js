const AcademicYearModel = require('../models/AcademicYear.model');
const {NotFoundError, ValidationError} = require("../utils/errorTypes");
const db = require('../config/database');
class AcademicYearService {
    // Create academic year
    static async create(data) {
        // Check if year already exists
        const existing = await AcademicYearModel.findByYear(data.year);
        if (existing) {
            throw new ValidationError('Academic year already exists');
        }

        // Validate dates
        if (new Date(data.endDate) <= new Date(data.startDate)) {
            throw new ValidationError('End date must be after start date');
        }

        const yearId = await AcademicYearModel.create(data);
        return await AcademicYearModel.findById(yearId);
    }

    // Get all academic years
    static async getAll() {
        return await AcademicYearModel.getAll();
    }

    // Get active academic year
    static async getActive() {
        const activeYear = await AcademicYearModel.getActive();
        if (!activeYear) {
            throw new NotFoundError('No active academic year found');
        }
        return activeYear;
    }

    // Get by ID
    static async getById(yearId) {
        const year = await AcademicYearModel.findById(yearId);
        if (!year) {
            throw new NotFoundError('Academic year not found');
        }
        return year;
    }

    // Update academic year
    static async update(yearId, data) {
        const existing = await AcademicYearModel.findById(yearId);
        if (!existing) {
            throw new NotFoundError('Academic year not found');
        }

        // Validate dates
        if (data.endDate && data.startDate) {
            if (new Date(data.endDate) <= new Date(data.startDate)) {
                throw new ValidationError('End date must be after start date');
            }
        }

        const updated = await AcademicYearModel.update(yearId, data);
        if (!updated) {
            throw new Error('Failed to update academic year');
        }

        return await AcademicYearModel.findById(yearId);
    }

    // Delete academic year
    static async delete(yearId) {
        const existing = await AcademicYearModel.findById(yearId);
        if (!existing) {
            throw new NotFoundError('Academic year not found');
        }

        // Check if has associated data
        const hasData = await AcademicYearModel.hasAssociatedData(yearId);
        if (hasData) {
            throw new ValidationError('Cannot delete academic year with associated classes or semesters');
        }

        const deleted = await AcademicYearModel.delete(yearId);
        if (!deleted) {
            throw new Error('Failed to delete academic year');
        }

        return { message: 'Academic year deleted successfully' };
    }

    // Set active academic year
    static async setActive(yearId) {
        const existing = await AcademicYearModel.findById(yearId);
        if (!existing) {
            throw new NotFoundError('Academic year not found');
        }

        await AcademicYearModel.setActive(yearId);
        return await AcademicYearModel.findById(yearId);
    }
}

module.exports = AcademicYearService;