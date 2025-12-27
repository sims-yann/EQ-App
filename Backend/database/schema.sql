
-- Drop existing database if exists (optional - comment out in production)
-- DROP DATABASE IF EXISTS equizz;

-- Create database
CREATE DATABASE IF NOT EXISTS equizz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE equizz;

--  
-- 1. USERS & AUTHENTICATION
--  
-- Add these columns to the users table

-- Roles table
CREATE TABLE roles (
                       role_id INT PRIMARY KEY AUTO_INCREMENT,
                       role_name VARCHAR(50) NOT NULL UNIQUE,
                       permissions JSON,
                       description TEXT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
                       user_id INT PRIMARY KEY AUTO_INCREMENT,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       matricule VARCHAR(50) UNIQUE,
                       class_id INT,
                       role_id INT NOT NULL,
                       email_verified BOOLEAN DEFAULT FALSE,
                       is_active BOOLEAN DEFAULT TRUE,
                       registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       last_login_date TIMESTAMP NULL,
                       FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

ALTER TABLE users
    ADD COLUMN verification_code VARCHAR(6),
    ADD COLUMN verification_expires TIMESTAMP NULL,
    ADD INDEX idx_verification_code (verification_code);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
                                           token_id INT PRIMARY KEY AUTO_INCREMENT,
                                           user_id INT NOT NULL,
                                           token VARCHAR(255) NOT NULL UNIQUE,
                                           expires_at TIMESTAMP NOT NULL,
                                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                           FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
                                       token_id INT PRIMARY KEY AUTO_INCREMENT,
                                       user_id INT NOT NULL,
                                       token VARCHAR(255) NOT NULL UNIQUE,
                                       expires_at TIMESTAMP NOT NULL,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

--  
-- 2. ACADEMIC STRUCTURE
--  

-- Academic years
CREATE TABLE academic_years (
                                year_id INT PRIMARY KEY AUTO_INCREMENT,
                                year VARCHAR(20) NOT NULL UNIQUE,
                                start_date DATE NOT NULL,
                                end_date DATE NOT NULL,
                                is_active BOOLEAN DEFAULT FALSE,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Semesters
CREATE TABLE semesters (
                           semester_id INT PRIMARY KEY AUTO_INCREMENT,
                           year_id INT NOT NULL,
                           semester_name VARCHAR(50) NOT NULL,
                           start_date DATE NOT NULL,
                           end_date DATE NOT NULL,
                           is_active BOOLEAN DEFAULT FALSE,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           FOREIGN KEY (year_id) REFERENCES academic_years(year_id) ON DELETE CASCADE
);

-- Classes
CREATE TABLE classes (
                         class_id INT PRIMARY KEY AUTO_INCREMENT,
                         class_name VARCHAR(100) NOT NULL,
                         level VARCHAR(50),
                         year_id INT NOT NULL,
                         department VARCHAR(100),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (year_id) REFERENCES academic_years(year_id) ON DELETE CASCADE
);

-- Add foreign key to users after classes table is created
ALTER TABLE users
    ADD CONSTRAINT fk_users_class
        FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE SET NULL;

-- Courses
CREATE TABLE courses (
                         course_id INT PRIMARY KEY AUTO_INCREMENT,
                         course_name VARCHAR(255) NOT NULL,
                         course_code VARCHAR(50) NOT NULL,
                         lecturer VARCHAR(255),
                         class_id INT NOT NULL,
                         credits INT,
                         semester_id INT NOT NULL,
                         description TEXT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
                         FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE CASCADE
);

--  
-- 3. QUESTION BANK
--  

-- Question types
CREATE TABLE question_types (
                                type_id INT PRIMARY KEY AUTO_INCREMENT,
                                type_name VARCHAR(50) NOT NULL UNIQUE,
                                description TEXT
);

-- Evaluation types
CREATE TABLE evaluation_types (
                                  type_id INT PRIMARY KEY AUTO_INCREMENT,
                                  type_name VARCHAR(50) NOT NULL UNIQUE,
                                  description TEXT
);

-- Questions
CREATE TABLE questions (
                           question_id INT PRIMARY KEY AUTO_INCREMENT,
                           question_text TEXT NOT NULL,
                           type_id INT NOT NULL,
                           course_id INT NOT NULL,
                           evaluation_type_id INT NOT NULL,
                           difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
                           created_by INT NOT NULL,
                           is_active BOOLEAN DEFAULT TRUE,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           FOREIGN KEY (type_id) REFERENCES question_types(type_id),
                           FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                           FOREIGN KEY (evaluation_type_id) REFERENCES evaluation_types(type_id),
                           FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Possible answers (for MCQ and closed questions)
CREATE TABLE possible_answers (
                                  answer_id INT PRIMARY KEY AUTO_INCREMENT,
                                  question_id INT NOT NULL,
                                  answer_text TEXT NOT NULL,
                                  is_correct BOOLEAN DEFAULT FALSE,
                                  order_index INT DEFAULT 0,
                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

--  
-- 4. QUIZZES & EVALUATIONS
--  

-- Quizzes
CREATE TABLE quizzes (
                         quiz_id INT PRIMARY KEY AUTO_INCREMENT,
                         quiz_title VARCHAR(255) NOT NULL,
                         course_id INT NOT NULL,
                         evaluation_type_id INT NOT NULL,
                         publish_date TIMESTAMP NULL,
                         close_date TIMESTAMP NULL,
                         is_active BOOLEAN DEFAULT FALSE,
                         created_by INT NOT NULL,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                         FOREIGN KEY (evaluation_type_id) REFERENCES evaluation_types(type_id),
                         FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Quiz questions (many-to-many relationship)
CREATE TABLE quiz_questions (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                quiz_id INT NOT NULL,
                                question_id INT NOT NULL,
                                order_index INT DEFAULT 0,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
                                FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
                                UNIQUE KEY unique_quiz_question (quiz_id, question_id)
);

-- Student answers
CREATE TABLE student_answers (
                                 answer_id INT PRIMARY KEY AUTO_INCREMENT,
                                 student_id INT NOT NULL,
                                 quiz_id INT NOT NULL,
                                 question_id INT NOT NULL,
                                 answer_text TEXT,
                                 selected_answer_id INT,
                                 submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
                                 FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
                                 FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
                                 FOREIGN KEY (selected_answer_id) REFERENCES possible_answers(answer_id) ON DELETE SET NULL
);

--  
-- 5. NOTIFICATIONS
--  

-- Notifications
CREATE TABLE notifications (
                               notification_id INT PRIMARY KEY AUTO_INCREMENT,
                               user_id INT NOT NULL,
                               title VARCHAR(255) NOT NULL,
                               message TEXT NOT NULL,
                               type VARCHAR(50) DEFAULT 'info',
                               is_read BOOLEAN DEFAULT FALSE,
                               sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Device tokens (for push notifications)
CREATE TABLE device_tokens (
                               token_id INT PRIMARY KEY AUTO_INCREMENT,
                               user_id INT NOT NULL,
                               device_token VARCHAR(255) NOT NULL UNIQUE,
                               platform VARCHAR(20) NOT NULL,
                               is_active BOOLEAN DEFAULT TRUE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

--  
-- 6. RESULTS & ANALYTICS
--  

-- Statistics
CREATE TABLE statistics (
                            stat_id INT PRIMARY KEY AUTO_INCREMENT,
                            quiz_id INT,
                            course_id INT,
                            class_id INT,
                            participation_rate DECIMAL(5,2),
                            average_score DECIMAL(5,2),
                            total_students INT,
                            total_participants INT,
                            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
                            FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                            FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE
);

-- Sentiment analysis
CREATE TABLE sentiment_analysis (
                                    analysis_id INT PRIMARY KEY AUTO_INCREMENT,
                                    answer_id INT NOT NULL,
                                    sentiment ENUM('positive', 'negative', 'neutral') NOT NULL,
                                    confidence DECIMAL(5,2),
                                    keywords JSON,
                                    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    FOREIGN KEY (answer_id) REFERENCES student_answers(answer_id) ON DELETE CASCADE
);

--  
-- 7. INITIAL DATA
--  

-- Insert default roles
INSERT INTO roles (role_name, permissions, description) VALUES
                                                            ('Admin', '{"manage_users": true, "manage_quizzes": true, "view_statistics": true, "manage_academic": true}', 'Administrator with full access'),
                                                            ('Student', '{"take_quiz": true, "view_results": false}', 'Student with quiz access only');

-- Insert question types
INSERT INTO question_types (type_name, description) VALUES
                                                        ('MCQ', 'Multiple Choice Question'),
                                                        ('Open', 'Open-ended question requiring text response'),
                                                        ('Closed', 'Closed question with yes/no or limited options');

-- Insert evaluation types
INSERT INTO evaluation_types (type_name, description) VALUES
                                                          ('Midterm', 'Mid-semester evaluation'),
                                                          ('Final', 'End-of-semester evaluation');

--  
-- 8. INDEXES FOR PERFORMANCE
--  

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_matricule ON users(matricule);
CREATE INDEX idx_users_class ON users(class_id);
CREATE INDEX idx_users_role ON users(role_id);

-- Questions indexes
CREATE INDEX idx_questions_course ON questions(course_id);
CREATE INDEX idx_questions_type ON questions(type_id);
CREATE INDEX idx_questions_evaluation_type ON questions(evaluation_type_id);

-- Quizzes indexes
CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quizzes_active ON quizzes(is_active);
CREATE INDEX idx_quizzes_dates ON quizzes(publish_date, close_date);

-- Student answers indexes
CREATE INDEX idx_student_answers_student ON student_answers(student_id);
CREATE INDEX idx_student_answers_quiz ON student_answers(quiz_id);
CREATE INDEX idx_student_answers_question ON student_answers(question_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

--  
-- SCRIPT COMPLETE
--  