const { AuthorizationError } = require('../utils/errorTypes');
const { errorResponse } = require('../utils/apiResponse');

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new AuthorizationError('User not authenticated');
            }

            const userRole = req.user.roleName;

            if (!allowedRoles.includes(userRole)) {
                throw new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
            }

            next();
        } catch (error) {
            return errorResponse(res, error.message, 403);
        }
    };
};

module.exports = { authorize };
