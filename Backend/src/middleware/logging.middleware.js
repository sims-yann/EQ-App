const logger = require('../utils/logger');
const morgan = require('morgan');

// Custom token for user ID
morgan.token('user-id', (req) => {
    return req.user ? req.user.userId : 'anonymous';
});

// Custom token for response time in seconds
morgan.token('response-time-sec', (req, res) => {
    if (!req._startAt || !res._startAt) {
        return '';
    }

    const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
        (res._startAt[1] - req._startAt[1]) * 1e-6;

    return (ms / 1000).toFixed(3);
});

// Morgan format for development
const devFormat = morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: {
        write: (message) => logger.http(message.trim())
    }
});

// Morgan format for production with more details
const prodFormat = morgan(
    ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time-sec s',
    {
        stream: {
            write: (message) => logger.http(message.trim())
        },
        skip: (req, res) => res.statusCode < 400 // Only log errors in production
    }
);

// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log request details
    logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user ? req.user.userId : 'anonymous'
    });

    // Capture response
    res.on('finish', () => {
        const duration = Date.now() - start;

        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user ? req.user.userId : 'anonymous'
        };

        if (res.statusCode >= 500) {
            logger.error('Request failed', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('Request error', logData);
        } else {
            logger.info('Request completed', logData);
        }
    });

    next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
    logger.error('Request error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        userId: req.user ? req.user.userId : 'anonymous',
        body: req.body
    });

    next(err);
};

module.exports = {
    devFormat,
    prodFormat,
    requestLogger,
    errorLogger
};