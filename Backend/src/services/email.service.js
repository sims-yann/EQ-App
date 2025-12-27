const transporter = require('../config/email');
const crypto = require('crypto');

class EmailService {

    //  Generating 6-digit verification code

    static generateVerificationCode() {
        return crypto.randomInt(100000, 999999).toString();
    }

    //
    //   Generate verification token (alternative to code)

    static generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }


    //  * Send verification email with code
    static async sendVerificationEmail(email, firstName, verificationCode) {
        const mailOptions = {
            from: `EQuizz Platform <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Verify Your EQuizz Admin Account',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #007BFF, #0056b3); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px dashed #007BFF; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; color: #007BFF; letter-spacing: 5px; }
            .button { display: inline-block; padding: 12px 30px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 EQuizz Platform</h1>
              <p>Email Verification Required</p>
            </div>
            <div class="content">
              <h2>Hello ${firstName}! 👋</h2>
              <p>Thank you for registering as an administrator on the EQuizz platform.</p>
              <p>To complete your registration and activate your account, please verify your email address using the code below:</p>
              
              <div class="code-box">
                <p style="margin: 0; color: #666;">Your Verification Code:</p>
                <div class="code">${verificationCode}</div>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Code expires in 24 hours</p>
              </div>

              <p style="text-align: center;">
                <strong>Enter this code in the verification page to activate your account.</strong>
              </p>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0;">
                  <li>Never share this code with anyone</li>
                  <li>EQuizz staff will never ask for this code</li>
                  <li>This code expires in 24 hours</li>
                </ul>
              </div>

              <p>If you didn't create an EQuizz account, please ignore this email or contact support if you're concerned.</p>
              
              <div class="footer">
                <p>This is an automated message from EQuizz Platform</p>
                <p>© ${new Date().getFullYear()} EQuizz - Teaching Quality Evaluation System</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(' Verification email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(' Failed to send verification email:', error);
            throw new Error(`Email sending failed: ${error.message}`);
        }
    }


    //   Send welcome email after verification

    static async sendWelcomeEmail(email, firstName) {
        const mailOptions = {
            from: `EQuizz Platform <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Welcome to EQuizz Platform!',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28A745, #1e7e34); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature-box { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #28A745; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to EQuizz!</h1>
            </div>
            <div class="content">
              <h2>Congratulations ${firstName}! 🎊</h2>
              <p>Your EQuizz administrator account has been successfully verified and activated.</p>
              
              <h3>What you can do now:</h3>
              <div class="feature-box">
                <strong>📚 Manage Academic Structure</strong>
                <p>Create and organize academic years, semesters, classes, and courses</p>
              </div>
              <div class="feature-box">
                <strong>❓ Build Question Banks</strong>
                <p>Create questions manually or import from Excel files</p>
              </div>
              <div class="feature-box">
                <strong>📝 Generate Quizzes</strong>
                <p>Create and publish evaluations for your courses</p>
              </div>
              <div class="feature-box">
                <strong>📊 Analyze Results</strong>
                <p>View statistics and AI-powered sentiment analysis</p>
              </div>

              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 15px 40px; background: #28A745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Login to Dashboard
                </a>
              </p>

              <p>Need help getting started? Check out our documentation or contact support.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} EQuizz Platform</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(' Welcome email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(' Failed to send welcome email:', error);
            // Don't throw error for welcome email - it's not critical
            return { success: false, error: error.message };
        }
    }


    //   Send password reset email

    static async sendPasswordResetEmail(email, firstName, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `EQuizz Platform <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Password Reset Request - EQuizz',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Password Reset</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p><strong>This link expires in 1 hour.</strong></p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            throw new Error(`Email sending failed: ${error.message}`);
        }
    }
}

module.exports = EmailService;