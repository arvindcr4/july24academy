// Implementation of a real SQLite database connection for July24Academy
// This replaces the mock implementation in db.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Database path - use environment variable in production
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'july24academy.db');

// Create a database connection
const sqliteDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
    // Initialize database tables if they don't exist
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  console.log('Initializing database schema...');
  
  // Enable foreign keys
  sqliteDb.run('PRAGMA foreign_keys = ON');
  
  // Create users table
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  
  // Create courses table
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      order_index INTEGER
    )
  `);
  
  // Create topics table
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      order_index INTEGER,
      estimated_hours REAL,
      FOREIGN KEY (course_id) REFERENCES courses (id)
    )
  `);
  
  // Create lessons table
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      order_index INTEGER,
      estimated_minutes INTEGER,
      xp_reward INTEGER,
      content TEXT,
      FOREIGN KEY (topic_id) REFERENCES topics (id)
    )
  `);
  
  // Create problems table
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS problems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      difficulty TEXT,
      estimated_minutes INTEGER,
      xp_reward INTEGER,
      starter_code TEXT,
      test_cases TEXT,
      constraints TEXT,
      input_format TEXT,
      output_format TEXT,
      time_complexity TEXT,
      space_complexity TEXT,
      hints TEXT,
      solution TEXT,
      FOREIGN KEY (topic_id) REFERENCES topics (id)
    )
  `);
  
  // Create user_progress table
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      lesson_id INTEGER,
      problem_id INTEGER,
      completed BOOLEAN DEFAULT 0,
      xp_earned INTEGER DEFAULT 0,
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (lesson_id) REFERENCES lessons (id),
      FOREIGN KEY (problem_id) REFERENCES problems (id)
    )
  `);
  
  // Create xp_history table
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS xp_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount INTEGER,
      source TEXT,
      earned_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  
  // Create practice_attempts table
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS practice_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      problem_id INTEGER,
      answer TEXT,
      is_correct BOOLEAN,
      time_spent_seconds INTEGER,
      attempted_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (problem_id) REFERENCES problems (id)
    )
  `);
}

// Database API
const db = {
  // User functions
  async createUser(userData) {
    return new Promise((resolve, reject) => {
      const { name, email, password, created_at } = userData;
      
      sqliteDb.run(
        'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)',
        [name, email, password, created_at],
        function(err) {
          if (err) {
            console.error('Error creating user:', err.message);
            return reject(err);
          }
          
          // Get the created user
          sqliteDb.get(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [this.lastID],
            (err, row) => {
              if (err) {
                console.error('Error retrieving created user:', err.message);
                return reject(err);
              }
              resolve(row);
            }
          );
        }
      );
    });
  },
  
  async getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      sqliteDb.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) {
            console.error('Error getting user by email:', err.message);
            return reject(err);
          }
          resolve(row);
        }
      );
    });
  },
  
  async getUserById(id) {
    return new Promise((resolve, reject) => {
      sqliteDb.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            console.error('Error getting user by ID:', err.message);
            return reject(err);
          }
          resolve(row);
        }
      );
    });
  },
  
  // Course functions
  async getAllCourses() {
    return new Promise((resolve, reject) => {
      sqliteDb.all(
        'SELECT * FROM courses ORDER BY order_index',
        (err, rows) => {
          if (err) {
            console.error('Error getting all courses:', err.message);
            return reject(err);
          }
          resolve({ results: rows });
        }
      );
    });
  },
  
  async getCourseById(id) {
    return new Promise((resolve, reject) => {
      sqliteDb.get(
        'SELECT * FROM courses WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            console.error('Error getting course by ID:', err.message);
            return reject(err);
          }
          resolve(row);
        }
      );
    });
  },
  
  // Topic functions
  async getTopicsByCourseId(courseId) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(
        'SELECT * FROM topics WHERE course_id = ? ORDER BY order_index',
        [courseId],
        (err, rows) => {
          if (err) {
            console.error('Error getting topics by course ID:', err.message);
            return reject(err);
          }
          resolve({ results: rows });
        }
      );
    });
  },
  
  // Lesson functions
  async getLessonsByTopicId(topicId) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(
        'SELECT * FROM lessons WHERE topic_id = ? ORDER BY order_index',
        [topicId],
        (err, rows) => {
          if (err) {
            console.error('Error getting lessons by topic ID:', err.message);
            return reject(err);
          }
          resolve({ results: rows });
        }
      );
    });
  },
  
  // Problem functions
  async getProblemsByTopicId(topicId) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(
        'SELECT * FROM problems WHERE topic_id = ?',
        [topicId],
        (err, rows) => {
          if (err) {
            console.error('Error getting problems by topic ID:', err.message);
            return reject(err);
          }
          resolve({ results: rows });
        }
      );
    });
  },
  
  // User progress functions
  async getUserProgress(userId) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(
        `SELECT up.*, l.title as lesson_title, t.title as topic_title, c.title as course_title
         FROM user_progress up
         LEFT JOIN lessons l ON up.lesson_id = l.id
         LEFT JOIN topics t ON l.topic_id = t.id
         LEFT JOIN courses c ON t.course_id = c.id
         WHERE up.user_id = ?
         ORDER BY up.completed_at DESC`,
        [userId],
        (err, rows) => {
          if (err) {
            console.error('Error getting user progress:', err.message);
            return reject(err);
          }
          resolve({ results: rows });
        }
      );
    });
  },
  
  async getUserXPHistory(userId) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(
        'SELECT * FROM xp_history WHERE user_id = ? ORDER BY earned_at DESC',
        [userId],
        (err, rows) => {
          if (err) {
            console.error('Error getting user XP history:', err.message);
            return reject(err);
          }
          resolve({ results: rows });
        }
      );
    });
  },
  
  // Helper function to close the database connection
  close() {
    sqliteDb.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
};

module.exports = { db };
