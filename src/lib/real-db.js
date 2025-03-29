// Database implementation using SQLite
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const dbPath = join(__dirname, '../../database.sqlite');

// Ensure the database directory exists
const dbDir = dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const sqliteDb = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  sqliteDb.serialize(() => {
    // Create users table
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        xp INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create courses table
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        difficulty TEXT,
        category_id INTEGER,
        order_index INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create topics table
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        order_index INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses (id)
      )
    `);
    
    // Create lessons table
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER,
        title TEXT NOT NULL,
        content TEXT,
        difficulty INTEGER,
        xp_reward INTEGER DEFAULT 10,
        order_index INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
        difficulty INTEGER,
        xp_reward INTEGER DEFAULT 20,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topic_id) REFERENCES topics (id)
      )
    `);
    
    // Create user_progress table
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        lesson_id INTEGER,
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (lesson_id) REFERENCES lessons (id)
      )
    `);
    
    // Create xp_history table
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS xp_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        amount INTEGER,
        source TEXT,
        earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
    
    console.log('Database schema initialized');
  });
}

// Database operations
export const db = {
  // User functions
  async createUser(name, email, password) {
    return new Promise((resolve, reject) => {
      sqliteDb.run(
        'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
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

export default db;
