const UserModel = require('../models/User.model');
const RoleModel = require('../models/Role.model');
const EmailService = require('./email.service');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../config/jwt');
const { AuthenticationError, ValidationError } = require('../utils/errorTypes');

class AuthService {
    // Admin signup with email verification
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

        // Generate 6-digit verification code
        const verificationCode = EmailService.generateVerificationCode();

        // Set expiration to 24 hours from now
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Create admin user (unverified)
        const userId = await UserModel.createAdmin({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            roleId: adminRole.role_id,
            verificationCode: verificationCode,
            verificationExpires: verificationExpires
        });

        // Send verification email
        try {
            await EmailService.sendVerificationEmail(
                data.email,
                data.firstName,
                verificationCode
            );
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Don't throw error - user is created, they can resend
        }

        // Get created user
        const user = await UserModel.findById(userId);

        return {
            message: 'Registration successful! Please check your email for verification code.',
            user: {
                userId: user.user_id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                emailVerified: user.email_verified,
                role: user.role_name
            }
        };
    }

    // Verify email with code
    static async verifyEmail(verificationCode) {
        // Find user by verification code
        const user = await UserModel.findByVerificationCode(verificationCode);

        if (!user) {
            throw new ValidationError('Invalid or expired verification code');
        }

        // Verify the user
        const verified = await UserModel.verifyEmail(user.user_id);

        if (!verified) {
            throw new Error('Failed to verify email');
        }

        // Send welcome email
        try {
            await EmailService.sendWelcomeEmail(user.email, user.first_name);
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            // Don't throw - verification succeeded
        }

        // Generate token for immediate login
        const token = generateToken({
            userId: user.user_id,
            email: user.email,
            roleId: user.role_id,
            roleName: user.role_name
        });

        return {
            message: 'Email verified successfully! Welcome to EQuizz.',
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

    // Resend verification code
    static async resendVerificationCode(email) {
        // Find user by email
        const user = await UserModel.findByEmail(email);

        if (!user) {
            throw new ValidationError('Email not found');
        }

        if (user.email_verified) {
            throw new ValidationError('Email already verified');
        }

        // Generate new code
        const verificationCode = EmailService.generateVerificationCode();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Update verification code
        await UserModel.updateVerificationCode(
            user.user_id,
            verificationCode,
            verificationExpires
        );

        // Send new verification email
        await EmailService.sendVerificationEmail(
            user.email,
            user.first_name,
            verificationCode
        );

        return {
            message: 'Verification code resent successfully. Please check your email.'
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

        // Check if email is verified
        if (!user.email_verified) {
            throw new AuthenticationError('Please verify your email before logging in');
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
        const user = await UserModel.findByMatricule(matricule);

        if (!user) {
            throw new AuthenticationError('Invalid matricule or email');
        }

        if (user.role_name !== 'Student') {
            throw new AuthenticationError('Access denied. Student only.');
        }

        if (user.email !== email) {
            throw new AuthenticationError('Invalid matricule or email');
        }

        if (!user.is_active) {
            throw new AuthenticationError('Account is deactivated');
        }

        if (!user.class_id) {
            throw new AuthenticationError('Student is not assigned to a class. Please contact administrator.');
        }


        await UserModel.updateLastLogin(user.user_id);

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

    // Create student (by admin)
    static async createStudent(data) {
        const emailExists = await UserModel.emailExists(data.email);
        if (emailExists) {
            throw new ValidationError('Email already registered');
        }

        const matriculeExists = await UserModel.matriculeExists(data.matricule);
        if (matriculeExists) {
            throw new ValidationError('Matricule already registered');
        }

        const studentRole = await RoleModel.findByName('Student');
        if (!studentRole) {
            throw new Error('Student role not found in database');
        }

        // Students don't need passwords - they login with matricule + email
        const randomPassword = Math.random().toString(36).slice(-12) + 'A1@';
        const hashedPassword = await hashPassword(randomPassword);

        const userId = await UserModel.createStudent({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            matricule: data.matricule,
            classId: data.classId,
            roleId: studentRole.role_id
        });

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