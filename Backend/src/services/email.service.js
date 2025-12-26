const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Create transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify transporter configuration
        if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
            this.transporter.verify((error, success) => {
                if (error) {
                    console.error('❌ Email service configuration error:', error);
                } else {
                    console.log('✅ Email service ready to send messages');
                }
            });
        } else {
            console.warn('⚠️  Email service not configured. Set SMTP credentials in .env');
        }
    }

    /**
     * Send verification email
     */
    async sendVerificationEmail(email, firstName, token, userId) {
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/verify-email?token=${token}&userId=${userId}`;

        const mailOptions = {
            from: `"EQuizz Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Verify Your Email - EQuizz Platform',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007BFF; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to EQuizz!</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>Thank you for registering with EQuizz Platform. To complete your registration, please verify your email address by clicking the button below:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </center>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #007BFF;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account with EQuizz, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EQuizz Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Verification email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(email, firstName, token, userId) {
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${token}&userId=${userId}`;

        const mailOptions = {
            from: `"EQuizz Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Password Reset Request - EQuizz Platform',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007BFF; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>We received a request to reset your password for your EQuizz account. Click the button below to reset your password:</p>
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #007BFF;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
              </div>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EQuizz Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password reset email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }

    /**
     * Send welcome email after email verification
     */
    async sendWelcomeEmail(email, firstName) {
        const mailOptions = {
            from: `"EQuizz Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Welcome to EQuizz Platform!',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28A745; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to EQuizz!</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>Your email has been successfully verified! You can now:</p>
              <ul>
                <li>✅ Access and complete course evaluations</li>
                <li>📊 View your evaluation history</li>
                <li>🔔 Receive notifications for new quizzes</li>
                <li>📱 Use the mobile app for offline quizzes</li>
              </ul>
              <p>Thank you for being part of our community. Your feedback helps improve teaching quality!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EQuizz Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Welcome email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Error sending welcome email:', error);
            // Don't throw error, welcome email is not critical
            return false;
        }
    }
}

module.exports = new EmailService();