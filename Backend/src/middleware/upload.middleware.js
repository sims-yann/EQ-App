// middleware/upload.middleware.js - NO CHANGES NEEDED (keeping for reference)
const upload = require('../config/upload');
const multer = require('multer');
const { errorResponse } = require('../utils/apiResponse');

const handleUpload = (fieldName) => {
    return (req, res, next) => {
        const uploadSingle = upload.single(fieldName);

        uploadSingle(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return errorResponse(res, 'File size exceeds 5MB limit', 400);
                    }
                    return errorResponse(res, `Upload error: ${err.message}`, 400);
                }
                return errorResponse(res, err.message, 400);
            }
            next();
        });
    };
};

module.exports = { handleUpload };