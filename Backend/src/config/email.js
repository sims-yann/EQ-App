// config/email.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // For development only
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error(' Email transporter error:', error.message);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

module.exports = transporter;