const UserModel = require('../models/User.model');
const RoleModel = require('../models/Role.model');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../config/jwt');
const { AuthenticationError, ValidationError } = require('../utils/errorTypes');

class AuthService {
    // Admin signup
    static async adminSignup(data) {
        // Check if email already exists
        const emailExists = await UserModel.emailExists(data.email);
        if (emailExists) {
            throw new ValidationError('Email already registered');
        }

        // Get admin role
        const adminRole = await RoleModel.findByName('Admin');
        if (!adminRole) {
            throw new Error('Admin role not found in database');
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        // Create admin user
        const userId = await UserModel.createAdmin({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            roleId: adminRole.role_id
        });

        // Get created user
        const user = await UserModel.findById(userId);

        // Generate token
        const token = generateToken({
            userId: user.user_id,
            email: user.email,
            roleId: user.role_id,
            roleName: user.role_name
        });

        return {
            token,
            user: {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role_name
            }
        };
    }

    // Admin login
    static async adminLogin(email, password) {
        // Find user by email
        const user = await UserModel.findByEmail(email);

        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Check if user is admin
        if (user.role_name !== 'Admin') {
            throw new AuthenticationError('Access denied. Admin only.');
        }

        // Check if account is active
        if (!user.is_active) {
            throw new AuthenticationError('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Update last login
        await UserModel.updateLastLogin(user.user_id);

        // Generate token
        const token = generateToken({
            userId: user.user_id,
            email: user.email,
            roleId: user.role_id,
            roleName: user.role_name
        });

        return {
            token,
            user: {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                role: user.role_name
            }
        };
    }

    // Student login (matricule + email)
    static async studentLogin(matricule, email) {
        // Find user by matricule
        const user = await UserModel.findByMatricule(matricule);

        if (!user) {
            throw new AuthenticationError('Invalid matricule or email');
        }

        // Check if user is student
        if (user.role_name !== 'Student') {
            throw new AuthenticationError('Access denied. Student only.');
        }

        // Check if email matches
        if (user.email !== email) {
            throw new AuthenticationError('Invalid matricule or email');
        }

        // Check if account is active
        if (!user.is_active) {
            throw new AuthenticationError('Account is deactivated');
        }

        // Update last login
        await UserModel.updateLastLogin(user.user_id);

        // Generate token
        const token = generateToken({
            userId: user.user_id,
            email: user.email,
            roleId: user.role_id,
            roleName: user.role_name,
            matricule: user.matricule,
            classId: user.class_id
        });

        return {
            token,
            user: {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                matricule: user.matricule,
                classId: user.class_id,
                role: user.role_name
            }
        };
    }

    // Create student (by admin) - FIXED VERSION
    static async createStudent(data) {
        // Check if email already exists
        const emailExists = await UserModel.emailExists(data.email);
        if (emailExists) {
            throw new ValidationError('Email already registered');
        }

        // Check if matricule already exists
        const matriculeExists = await UserModel.matriculeExists(data.matricule);
        if (matriculeExists) {
            throw new ValidationError('Matricule already registered');
        }

        // Get student role
        const studentRole = await RoleModel.findByName('Student');
        if (!studentRole) {
            throw new Error('Student role not found in database');
        }

        // ✅ Generate a random password for student (they won't use it for login)
        // Students login with matricule + email only, no password needed
        const randomPassword = Math.random().toString(36).slice(-12) + 'A1@';
        const hashedPassword = await hashPassword(randomPassword);

        // Create student user
        const userId = await UserModel.createStudent({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword, // ✅ Random password stored but never used
            matricule: data.matricule,
            classId: data.classId,
            roleId: studentRole.role_id
        });

        // Get created user
        const user = await UserModel.findById(userId);

        return {
            userId: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            matricule: user.matricule,
            classId: user.class_id,
            role: user.role_name
        };
    }
}

module.exports = AuthService;
