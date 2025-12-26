-- User Service Test Data
USE equizz_users;

-- Insert test students (password for all: Student@123)
INSERT INTO users (firstName, lastName, institutionalEmail, password, matricule, classId, roleId, emailVerified, isActive)
VALUES
    ('John', 'Doe', 'john.doe@student.university.edu',
     '$2b$10$rKZ8qH/YGKxQxLqWGJGfGeZQCVqLvO5VqN0uKEZlLvQxL8zY2YQZC',
     'STU2024001', 1,
     (SELECT roleId FROM roles WHERE roleName = 'student'),
     TRUE, TRUE),

    ('Jane', 'Smith', 'jane.smith@student.university.edu',
     '$2b$10$rKZ8qH/YGKxQxLqWGJGfGeZQCVqLvO5VqN0uKEZlLvQxL8zY2YQZC',
     'STU2024002', 1,
     (SELECT roleId FROM roles WHERE roleName = 'student'),
     TRUE, TRUE),

    ('Mike', 'Johnson', 'mike.johnson@student.university.edu',
     '$2b$10$rKZ8qH/YGKxQxLqWGJGfGeZQCVqLvO5VqN0uKEZlLvQxL8zY2YQZC',
     'STU2024003', 2,
     (SELECT roleId FROM roles WHERE roleName = 'student'),
     TRUE, TRUE),

    ('Sarah', 'Williams', 'sarah.williams@student.university.edu',
     '$2b$10$rKZ8qH/YGKxQxLqWGJGfGeZQCVqLvO5VqN0uKEZlLvQxL8zY2YQZC',
     'STU2024004', 2,
     (SELECT roleId FROM roles WHERE roleName = 'student'),
     FALSE, TRUE),

    ('David', 'Brown', 'david.brown@student.university.edu',
     '$2b$10$rKZ8qH/YGKxQxLqWGJGfGeZQCVqLvO5VqN0uKEZlLvQxL8zY2YQZC',
     'STU2024005', 1,
     (SELECT roleId FROM roles WHERE roleName = 'student'),
     TRUE, FALSE);

-- Display inserted data
SELECT
    u.userId,
    u.firstName,
    u.lastName,
    u.institutionalEmail,
    u.matricule,
    u.classId,
    r.roleName,
    u.emailVerified,
    u.isActive
FROM users u
         JOIN roles r ON u.roleId = r.roleId
ORDER BY u.userId;