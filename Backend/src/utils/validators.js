// checking email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Checking password
function isValidPassword(password) {
    if (password.length < 8) {
        return {
            valid: false,
            message: 'Password must be at least 8 characters long'
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            valid: false,
            message: 'Password must contain at least one lowercase letter'
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            message: 'Password must contain at least one uppercase letter'
        };
    }

    if (!/\d/.test(password)) {
        return {
            valid: false,
            message: 'Password must contain at least one number'
        };
    }

    return {
        valid: true,
        message: 'Password is valid'
    };
}

// checking if the matricule is correct
function isValidMatricule(matricule) {
    if (!matricule) {
        return {
            valid: false,
            message: 'Matricule is required'
        };
    }

    if (matricule.length < 5 || matricule.length > 20) {
        return {
            valid: false,
            message: 'Matricule must be between 5 and 20 characters'
        };
    }

    return {
        valid: true,
        message: 'Matricule is valid'
    };
}


function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return input;
    }

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/['"]/g, ''); // Remove quotes
}

// email validation
function isInstitutionalEmail(email) {
    // Modify this based on your institution's email format
    // Example: must end with @university.edu or @student.university.edu
    const institutionalDomains = [
        '@university.edu',
        '@student.university.edu',
        '@admin.university.edu'
    ];

    return institutionalDomains.some(domain => email.toLowerCase().endsWith(domain));
}

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidMatricule,
    sanitizeInput,
    isInstitutionalEmail
};