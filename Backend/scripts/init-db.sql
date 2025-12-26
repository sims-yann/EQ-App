-- init-db.sql

-- Create Database
CREATE DATABASE IF NOT EXISTS equizz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE equizz_db;

-- Roles Table
CREATE TABLE roles (
                       role_id INT PRIMARY KEY AUTO_INCREMENT,
                       role_name VARCHAR(50) NOT NULL UNIQUE,
                       permissions JSON,
                       description TEXT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
                       user_id INT PRIMARY KEY AUTO_INCREMENT,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,
                       institutional_email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       role_id INT NOT NULL,
                       registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       last_login_date TIMESTAMP NULL,
                       is_active BOOLEAN DEFAULT TRUE,
                       email_verified BOOLEAN DEFAULT FALSE,
                       email_verification_token VARCHAR(255),
                       password_reset_token VARCHAR(255),
                       password_reset_expires TIMESTAMP NULL,
                       FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Students Table (extends Users)
CREATE TABLE students (
                          student_id INT PRIMARY KEY AUTO_INCREMENT,
                          user_id INT NOT NULL UNIQUE,
                          matricule VARCHAR(50) NOT NULL UNIQUE,
                          class_id INT,
                          device_token VARCHAR(255),
                          offline_data JSON,
                          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Academic Years Table
CREATE TABLE academic_years (
                                year_id INT PRIMARY KEY AUTO_INCREMENT,
                                year VARCHAR(20) NOT NULL UNIQUE,
                                start_date DATE NOT NULL,
                                end_date DATE NOT NULL,
                                status ENUM('active', 'upcoming', 'archived') DEFAULT 'upcoming',
                                created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Semesters Table
CREATE TABLE semesters (
                           semester_id INT PRIMARY KEY AUTO_INCREMENT,
                           semester_name VARCHAR(100) NOT NULL,
                           year_id INT NOT NULL,
                           start_date DATE NOT NULL,
                           end_date DATE NOT NULL,
                           is_active BOOLEAN DEFAULT FALSE,
                           FOREIGN KEY (year_id) REFERENCES academic_years(year_id) ON DELETE CASCADE
);

-- Classes Table
CREATE TABLE classes (
                         class_id INT PRIMARY KEY AUTO_INCREMENT,
                         class_name VARCHAR(100) NOT NULL,
                         level VARCHAR(50),
                         year_id INT NOT NULL,
                         department VARCHAR(100),
                         student_count INT DEFAULT 0,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (year_id) REFERENCES academic_years(year_id) ON DELETE CASCADE
);

-- Update Students foreign key
ALTER TABLE students ADD FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE SET NULL;

-- Courses Table
CREATE TABLE courses (
                         course_id INT PRIMARY KEY AUTO_INCREMENT,
                         course_name VARCHAR(255) NOT NULL,
                         course_code VARCHAR(50) NOT NULL,
                         lecturer VARCHAR(255),
                         class_id INT NOT NULL,
                         credits INT,
                         semester_id INT,
                         description TEXT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
                         FOREIGN KEY (semester_id) REFERENCES semesters(semester_id) ON DELETE SET NULL
);

-- Evaluation Types Table
CREATE TABLE evaluation_types (
                                  evaluation_type_id INT PRIMARY KEY AUTO_INCREMENT,
                                  type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Question Types Table
CREATE TABLE question_types (
                                question_type_id INT PRIMARY KEY AUTO_INCREMENT,
                                type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Questions Table
CREATE TABLE questions (
                           question_id INT PRIMARY KEY AUTO_INCREMENT,
                           question_text TEXT NOT NULL,
                           question_type_id INT NOT NULL,
                           course_id INT NOT NULL,
                           evaluation_type_id INT NOT NULL,
                           difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
                           created_by INT NOT NULL,
                           created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           is_active BOOLEAN DEFAULT TRUE,
                           FOREIGN KEY (question_type_id) REFERENCES question_types(question_type_id),
                           FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                           FOREIGN KEY (evaluation_type_id) REFERENCES evaluation_types(evaluation_type_id),
                           FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Possible Answers Table (for MCQ and Closed Questions)
CREATE TABLE possible_answers (
                                  answer_id INT PRIMARY KEY AUTO_INCREMENT,
                                  question_id INT NOT NULL,
                                  answer_text TEXT NOT NULL,
                                  is_correct BOOLEAN DEFAULT FALSE,
                                  display_order INT,
                                  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- Quizzes Table
CREATE TABLE quizzes (
                         quiz_id INT PRIMARY KEY AUTO_INCREMENT,
                         quiz_title VARCHAR(255) NOT NULL,
                         course_id INT NOT NULL,
                         evaluation_type_id INT NOT NULL,
                         publish_date TIMESTAMP NULL,
                         close_date TIMESTAMP NULL,
                         is_active BOOLEAN DEFAULT FALSE,
                         created_by INT NOT NULL,
                         created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         total_questions INT DEFAULT 0,
                         FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                         FOREIGN KEY (evaluation_type_id) REFERENCES evaluation_types(evaluation_type_id),
                         FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Quiz Questions (Many-to-Many)
CREATE TABLE quiz_questions (
                                quiz_id INT NOT NULL,
                                question_id INT NOT NULL,
                                question_order INT,
                                PRIMARY KEY (quiz_id, question_id),
                                FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
                                FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- Student Answers Table
CREATE TABLE student_answers (
                                 answer_record_id INT PRIMARY KEY AUTO_INCREMENT,
                                 student_id INT NOT NULL,
                                 quiz_id INT NOT NULL,
                                 question_id INT NOT NULL,
                                 answer_text TEXT,
                                 selected_answer_id INT NULL,
                                 submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 is_synced BOOLEAN DEFAULT TRUE,
                                 FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                                 FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
                                 FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
                                 FOREIGN KEY (selected_answer_id) REFERENCES possible_answers(answer_id) ON DELETE SET NULL,
                                 UNIQUE KEY unique_student_quiz_question (student_id, quiz_id, question_id)
);

-- Quiz Completion Tracking
CREATE TABLE quiz_completions (
                                  completion_id INT PRIMARY KEY AUTO_INCREMENT,
                                  student_id INT NOT NULL,
                                  quiz_id INT NOT NULL,
                                  completed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                  is_synced BOOLEAN DEFAULT TRUE,
                                  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
                                  FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
                                  UNIQUE KEY unique_student_quiz (student_id, quiz_id)
);

-- Notifications Table
CREATE TABLE notifications (
                               notification_id INT PRIMARY KEY AUTO_INCREMENT,
                               user_id INT NOT NULL,
                               title VARCHAR(255) NOT NULL,
                               message TEXT NOT NULL,
                               type ENUM('quiz_published', 'submission_confirmed', 'class_changed', 'general') NOT NULL,
                               quiz_id INT NULL,
                               is_read BOOLEAN DEFAULT FALSE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               sent_at TIMESTAMP NULL,
                               delivery_status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
                               FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                               FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE SET NULL
);

-- Statistics Table (Aggregated Data)
CREATE TABLE statistics (
                            stat_id INT PRIMARY KEY AUTO_INCREMENT,
                            quiz_id INT NOT NULL,
                            course_id INT NOT NULL,
                            class_id INT NOT NULL,
                            year_id INT NOT NULL,
                            total_students INT NOT NULL,
                            participated_students INT NOT NULL,
                            participation_rate DECIMAL(5,2),
                            average_score DECIMAL(5,2),
                            generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
                            FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
                            FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
                            FOREIGN KEY (year_id) REFERENCES academic_years(year_id) ON DELETE CASCADE
);

-- Audit Log Table
CREATE TABLE audit_logs (
                            log_id INT PRIMARY KEY AUTO_INCREMENT,
                            user_id INT,
                            action VARCHAR(100) NOT NULL,
                            entity_type VARCHAR(50) NOT NULL,
                            entity_id INT,
                            changes JSON,
                            ip_address VARCHAR(45),
                            user_agent TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(institutional_email);
CREATE INDEX idx_students_matricule ON students(matricule);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quizzes_active ON quizzes(is_active);
CREATE INDEX idx_questions_course ON questions(course_id);
CREATE INDEX idx_answers_student ON student_answers(student_id);
CREATE INDEX idx_answers_quiz ON student_answers(quiz_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
