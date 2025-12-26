const User = require('../models/User.model');
const bcrypt = require('bcrypt');

class UserService {
   // Get user profile details
    async getProfile(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Remove sensitive data
        delete user.password;

        return user;
    }
    // update user profile

    async updateProfile(userId, updateData) {
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Validate email if changing
        if (updateData.institutionalEmail && updateData.institutionalEmail !== user.institutionalEmail) {
            const emailExists = await User.emailExists(updateData.institutionalEmail, userId);
            if (emailExists) {
                throw new Error('Email already in use');
            }
            // If email changed, mark as unverified
            updateData.emailVerified = false;
        }

        // Hash password if changing
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Update user
        const updated = await User.update(userId, updateData);

        if (!updated) {
            throw new Error('Failed to update profile');
        }

        // Return updated user
        return await this.getProfile(userId);
    }

    // getting all student with pagination
    async getAllStudents(filters, pagination) {
        const { page = 1, limit = 20 } = pagination;
        const offset = (page - 1) * limit;

        const students = await User.getAllStudents({
            ...filters,
            limit,
            offset
        });

        const total = await User.countStudents(filters);

        return {
            students,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    // getting a student by id
    async getStudentById(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('Student not found');
        }

        if (user.roleName !== 'student') {
            throw new Error('User is not a student');
        }

        delete user.password;
        return user;
    }

    // update student class
    async updateStudentClass(userId, classId) {
        // Check if user exists and is a student
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('Student not found');
        }

        if (user.roleName !== 'student') {
            throw new Error('Only students can change classes');
        }

        // Update class
        const updated = await User.updateClass(userId, classId);

        if (!updated) {
            throw new Error('Failed to update class');
        }

        return await this.getStudentById(userId);
    }

    // turrning off user account
    async deactivateUser(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const deleted = await User.delete(userId);

        if (!deleted) {
            throw new Error('Failed to deactivate user');
        }

        return {
            message: 'User account deactivated successfully'
        };
    }

    // reactiving a user account
    async reactivateUser(userId) {
        const updated = await User.update(userId, { isActive: true });

        if (!updated) {
            throw new Error('Failed to reactivate user');
        }

        return {
            message: 'User account reactivated successfully'
        };
    }

    // get stats
    async getUserStats() {
        const [activeStudents] = await User.getAllStudents({ isActive: true });
        const [inactiveStudents] = await User.getAllStudents({ isActive: false });
        const [verifiedStudents] = await User.getAllStudents({ emailVerified: true });
        const [unverifiedStudents] = await User.getAllStudents({ emailVerified: false });

        return {
            totalStudents: activeStudents.length + inactiveStudents.length,
            activeStudents: activeStudents.length,
            inactiveStudents: inactiveStudents.length,
            verifiedStudents: verifiedStudents.length,
            unverifiedStudents: unverifiedStudents.length
        };
    }
}

module.exports = new UserService();