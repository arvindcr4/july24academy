-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  xp_total INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0
);

-- Create Courses table
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Topics table
CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 10,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES topics(id)
);

-- Create Practice Problems table
CREATE TABLE IF NOT EXISTS practice_problems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  explanation TEXT,
  difficulty INTEGER DEFAULT 1,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Create User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Create XP History table
CREATE TABLE IF NOT EXISTS xp_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample data for courses
INSERT INTO courses (title, description, difficulty_level, image_url) VALUES
('Algebra Fundamentals', 'Master the basics of algebra including equations, inequalities, and functions', 'Beginner', '/images/algebra.jpg'),
('Calculus I', 'Introduction to limits, derivatives, and integrals', 'Intermediate', '/images/calculus.jpg'),
('Statistics Essentials', 'Learn probability, distributions, and hypothesis testing', 'Beginner', '/images/statistics.jpg');

-- Insert sample topics for Algebra course
INSERT INTO topics (course_id, title, description, order_index) VALUES
(1, 'Linear Equations', 'Solving equations of the form ax + b = c', 1),
(1, 'Quadratic Equations', 'Solving equations of the form ax² + bx + c = 0', 2),
(1, 'Functions and Graphs', 'Understanding function notation and graphing', 3);

-- Insert sample lessons for Linear Equations topic
INSERT INTO lessons (topic_id, title, content, xp_reward, order_index) VALUES
(1, 'Introduction to Equations', 'An equation is a mathematical statement that asserts the equality of two expressions...', 10, 1),
(1, 'Solving Simple Equations', 'To solve an equation, we need to isolate the variable on one side...', 15, 2),
(1, 'Word Problems with Linear Equations', 'Many real-world problems can be solved by translating them into linear equations...', 20, 3);

-- Insert sample practice problems
INSERT INTO practice_problems (lesson_id, question, answer, explanation, difficulty) VALUES
(1, 'Solve for x: 3x + 5 = 14', 'x = 3', 'Subtract 5 from both sides: 3x = 9. Then divide both sides by 3: x = 3.', 1),
(1, 'Solve for y: 2y - 7 = 15', 'y = 11', 'Add 7 to both sides: 2y = 22. Then divide both sides by 2: y = 11.', 1),
(2, 'Solve for z: 4z + 10 = 2z - 8', 'z = -9', 'Subtract 2z from both sides: 2z + 10 = -8. Subtract 10 from both sides: 2z = -18. Divide both sides by 2: z = -9.', 2);
