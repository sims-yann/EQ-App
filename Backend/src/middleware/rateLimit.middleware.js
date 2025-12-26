const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

// Redis client for distributed rate limiting
let redisClient;
if (process.env.REDIS_URL) {
    redisClient = redis.createClient({
        url: process.env.REDIS_URL
    });

    redisClient.connect().catch(console.error);
}

// Standard rate limiter for general API calls
const standardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...(redisClient && {
        store: new RedisStore({
            client: redisClient,
            prefix: 'rl:standard:'
        })
    })
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Limit to 5 login attempts per 15 minutes
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...(redisClient && {
        store: new RedisStore({
            client: redisClient,
            prefix: 'rl:auth:'
        })
    })
});

// Lenient rate limiter for quiz submissions
const quizLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 submissions per hour
    message: {
        success: false,
        message: 'Too many quiz submissions. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...(redisClient && {
        store: new RedisStore({
            client: redisClient,
            prefix: 'rl:quiz:'
        })
    })
});

// File upload rate limiter
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10, // 10 file uploads per hour
    message: {
        success: false,
        message: 'Too many file uploads. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...(redisClient && {
        store: new RedisStore({
            client: redisClient,
            prefix: 'rl:upload:'
        })
    })
});

module.exports = {
    standardLimiter,
    authLimiter,
    quizLimiter,
    uploadLimiter
};