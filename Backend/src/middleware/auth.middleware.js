const { verifyToken } = require('../config/jwt');
const { AuthenticationError } = require('../utils/errorTypes');
const { errorResponse } = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verifyToken(token);

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            roleId: decoded.roleId,
            roleName: decoded.roleName,
            matricule: decoded.matricule || null,
            classId: decoded.classId || null
        };

        next();
    } catch (error) {
        return errorResponse(res, error.message, 401);
    }
};

module.exports = { authenticate };