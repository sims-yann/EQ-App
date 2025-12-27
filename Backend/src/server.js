require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const corsMiddleware = require('./middleware/cors.middleware');
const { errorHandler } = require('./middleware/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 3000;


// MIDDLEWARE

// Security
app.use(helmet());

// CORS
app.use(corsMiddleware);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));


// ROUTES


// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'EQuizz API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/academic-years', require('./routes/academicYear.routes'));
app.use('/api/semesters', require('./routes/semester.routes'));
app.use('/api/classes', require('./routes/class.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/quizzes', require('./routes/quiz.routes'));
app.use('/api/import', require('./routes/import.routes'));
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);


// START SERVER


app.listen(PORT, () => {
    console.log(`
  
EQuizz API Server Running on Port: ${PORT}                       
Environment: ${process.env.NODE_ENV || 'development'}         
Time: ${new Date().toLocaleString()}      
  
  `);
});