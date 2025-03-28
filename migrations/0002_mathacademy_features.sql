-- Add new tables for MathAcademy-inspired features

-- Create Key Points table
CREATE TABLE IF NOT EXISTS key_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- Create Prerequisites table with more detailed relationships
CREATE TABLE IF NOT EXISTS prerequisites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  prerequisite_lesson_id INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  FOREIGN KEY (prerequisite_lesson_id) REFERENCES lessons(id)
);

-- Create Daily Streaks table
CREATE TABLE IF NOT EXISTS daily_streaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  streak_count INTEGER NOT NULL,
  streak_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create Practice Attempts table with timing information
CREATE TABLE IF NOT EXISTS practice_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  problem_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (problem_id) REFERENCES practice_problems(id)
);

-- Add difficulty field to practice_problems if not exists
ALTER TABLE practice_problems ADD COLUMN IF NOT EXISTS difficulty INTEGER DEFAULT 1;

-- Add xp_value field to practice_problems if not exists
ALTER TABLE practice_problems ADD COLUMN IF NOT EXISTS xp_value INTEGER DEFAULT 5;

-- Add explanation field to practice_problems if not exists
ALTER TABLE practice_problems ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Add type field to practice_problems if not exists
ALTER TABLE practice_problems ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'multiple_choice';

-- Add tolerance field to practice_problems if not exists (for numeric answers)
ALTER TABLE practice_problems ADD COLUMN IF NOT EXISTS tolerance REAL DEFAULT 0.001;

-- Add streak_days field to users if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;

-- Add weekly_goal field to users if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_goal INTEGER DEFAULT 500;

-- Add last_active_date field to users if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_date DATE;

-- Sample data for key points
INSERT INTO key_points (lesson_id, content, order_index) VALUES
(1, 'An equation is a mathematical statement that asserts the equality of two expressions', 1),
(1, 'To solve an equation, isolate the variable on one side', 2),
(1, 'The solution to an equation is the value that makes the equation true', 3),
(2, 'When solving equations, perform the same operation on both sides', 1),
(2, 'Addition and subtraction are used to isolate terms with variables', 2),
(2, 'Division and multiplication are used to isolate the variable itself', 3);

-- Sample data for prerequisites
INSERT INTO prerequisites (lesson_id, prerequisite_lesson_id, order_index) VALUES
(2, 1, 1),
(3, 2, 1);

-- Sample data for practice problems with enhanced fields
INSERT INTO practice_problems (lesson_id, question, answer, explanation, difficulty, type, xp_value) VALUES
(1, 'Which of the following is an equation?', 'x + 5 = 10', 'An equation contains an equals sign (=) and asserts that two expressions are equal.', 1, 'multiple_choice', 5),
(1, 'Solve for x: 3x + 5 = 14', 'x = 3', 'Subtract 5 from both sides: 3x = 9. Then divide both sides by 3: x = 3.', 2, 'numeric', 10),
(2, 'Solve for y: 2y - 7 = 15', 'y = 11', 'Add 7 to both sides: 2y = 22. Then divide both sides by 2: y = 11.', 2, 'numeric', 10),
(2, 'Solve for z: 4z + 10 = 2z - 8', 'z = -9', 'Subtract 2z from both sides: 2z + 10 = -8. Subtract 10 from both sides: 2z = -18. Divide both sides by 2: z = -9.', 3, 'numeric', 15);
