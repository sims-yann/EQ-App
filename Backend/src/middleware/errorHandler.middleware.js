const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Mongoose/Sequelize duplicate key error
    if (err.code === 11000 || err.code === 'ER_DUP_ENTRY') {
        return errorResponse(res, 'Duplicate entry found', 409);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token expired', 401);
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    return errorResponse(res, message, statusCode);
};

module.exports = { errorHandler };