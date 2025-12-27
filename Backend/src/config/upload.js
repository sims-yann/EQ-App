// config/upload.js - NO CHANGES NEEDED (keeping for reference)
const multer = require('multer');
const path = require('path');

// Memory storage for Excel files
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed'), false);
    }
};


// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;