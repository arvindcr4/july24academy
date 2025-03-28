-- Enhanced course structure to better support multiple courses
-- Migration: 0003_enhanced_course_structure.sql

-- Add course categories table for better organization
CREATE TABLE IF NOT EXISTS course_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Columns for courses table already exist, no need to add them again

-- Add course_enrollments table to track user enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_accessed_at TIMESTAMP,
  completion_percentage REAL DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE(user_id, course_id)
);

-- Add course_reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE(user_id, course_id)
);

-- Add course_authors table for multiple authors per course
CREATE TABLE IF NOT EXISTS course_authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add course_author_mappings for many-to-many relationship
CREATE TABLE IF NOT EXISTS course_author_mappings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (author_id) REFERENCES course_authors(id),
  UNIQUE(course_id, author_id)
);

-- Add resources table for additional course materials
CREATE TABLE IF NOT EXISTS course_resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- 'pdf', 'video', 'link', etc.
  resource_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Add tags table for better course discovery
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add course_tags for many-to-many relationship
CREATE TABLE IF NOT EXISTS course_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id),
  UNIQUE(course_id, tag_id)
);

-- Add user_course_notes table
CREATE TABLE IF NOT EXISTS user_course_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER,
  lesson_id INTEGER,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Add user_bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER,
  lesson_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Add certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  certificate_url TEXT,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE(user_id, course_id)
);

-- Insert sample course categories
INSERT INTO course_categories (name, description, image_url, order_index) VALUES
('Mathematics', 'Courses covering various branches of mathematics', '/images/categories/math.jpg', 1),
('Computer Science', 'Programming, algorithms, and computer theory', '/images/categories/cs.jpg', 2),
('System Design', 'Software architecture and system design principles', '/images/categories/system-design.jpg', 3),
('Data Science', 'Statistics, machine learning, and data analysis', '/images/categories/data-science.jpg', 4);

-- Update existing courses with categories
UPDATE courses SET category_id = 1 WHERE id IN (1, 2, 3);

-- Insert sample course authors
INSERT INTO course_authors (name, bio, avatar_url) VALUES
('Dr. Jane Smith', 'Mathematics professor with 15 years of teaching experience', '/images/authors/jane-smith.jpg'),
('Alex Xu', 'System Design expert and author of "System Design Interview"', '/images/authors/alex-xu.jpg');

-- Map authors to courses
INSERT INTO course_author_mappings (course_id, author_id, is_primary) VALUES
(1, 1, TRUE),
(2, 1, TRUE),
(3, 1, TRUE)
ON CONFLICT (course_id, author_id) DO NOTHING;

-- Insert sample tags
INSERT INTO tags (name) VALUES
('Algebra'),
('Calculus'),
('Statistics'),
('Beginner'),
('Intermediate'),
('Advanced'),
('System Design'),
('Software Architecture')
ON CONFLICT (name) DO NOTHING;

-- Map tags to courses
INSERT INTO course_tags (course_id, tag_id) VALUES
(1, 1), -- Algebra Fundamentals - Algebra
(1, 4), -- Algebra Fundamentals - Beginner
(2, 2), -- Calculus I - Calculus
(2, 5), -- Calculus I - Intermediate
(3, 3), -- Statistics Essentials - Statistics
(3, 4) -- Statistics Essentials - Beginner
ON CONFLICT (course_id, tag_id) DO NOTHING;
