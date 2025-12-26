const jwt = require('jsonwebtoken');

// jwt token for user
function generateToken(user) {
    const payload = {
        uid: user.userId,
        email: user.institutionalEmail,
        role: user.roleName,
        permissions: user.permissions || []
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'equizz-api-gateway',
        audience: 'equizz-services'
    });
}

// verfiy jwt token
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET, {
            issuer: 'equizz-api-gateway',
            audience: 'equizz-services'
        });
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

// generate a refresh token
function generateRefreshToken(user) {
    const payload = {
        uid: user.userId,
        type: 'refresh'
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        issuer: 'equizz-api-gateway',
        audience: 'equizz-services'
    });
}

module.exports = {
    generateToken,
    verifyToken,
    generateRefreshToken
};