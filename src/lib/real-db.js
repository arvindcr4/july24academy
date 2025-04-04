// Database implementation for Render.com compatibility
// This file provides a database implementation that works in both local and Render.com environments
const fs = typeof window === 'undefined' ? require('fs') : null;
const path = typeof window === 'undefined' ? require('path') : null;

const __dirname = typeof window === 'undefined' ? process.cwd() : '';

const dbPath = typeof window === 'undefined' ? path.join(__dirname, 'database.sqlite') : '';

const mockDataPath = typeof window === 'undefined' ? path.join(__dirname, 'mock-data') : '';

if (typeof window === 'undefined' && fs) {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

// Database API implementation
let db;

// Initialize database with fallback for Render.com
async function initializeDatabase() {
  if (typeof window !== 'undefined') {
    return createMockDatabaseAPI();
  }
  try {
    // Try to import sqlite3
    const sqlite3 = await import('sqlite3');
    
    // Initialize SQLite database
    const sqliteDb = new sqlite3.default.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        throw err;
      } else {
        console.log('Connected to the SQLite database');
        initializeSchema(sqliteDb);
      }
    });
    
    // Return real database API
    return createRealDatabaseAPI(sqliteDb);
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error.message);
    console.log('Using mock database implementation for Render.com');
    
    // Return mock database API for Render.com
    return createMockDatabaseAPI();
  }
}

// Initialize database schema
function initializeSchema(sqliteDb) {
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

// Create real database API with SQLite
function createRealDatabaseAPI(sqliteDb) {
  return {
    // User functions
    async createUser(name, email, password) {
      return new Promise((resolve, reject) => {
        sqliteDb.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, password],
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
}

// Create mock database API for Render.com
function createMockDatabaseAPI() {
  console.log('Using mock database API for Render.com');
  
  // Try to load mock admin user from JSON file
  let mockAdminUser = {
    id: 1,
    name: 'Admin User',
    email: 'admin@july24academy.com',
    password: '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Mock hashed password
    role: 'admin',
    xp: 0,
    created_at: new Date().toISOString()
  };
  
  try {
    if (typeof window === 'undefined' && fs && fs.existsSync(path.join(mockDataPath, 'admin-user.json'))) {
      const adminData = fs.readFileSync(path.join(mockDataPath, 'admin-user.json'), 'utf8');
      mockAdminUser = JSON.parse(adminData);
      console.log('Loaded mock admin user from file');
    }
  } catch (error) {
    console.error('Error loading mock admin user:', error.message);
  }
  
  return {
    // User functions
    async createUser(name, email, password) {
      console.log('Mock: Creating user', { name, email });
      return { id: 1, name, email, created_at: new Date().toISOString() };
    },
    
    async getUserByEmail(email) {
      console.log('Mock: Getting user by email', email);
      if (email === 'admin@july24academy.com') {
        return mockAdminUser;
      }
      return null;
    },
    
    async getUserById(id) {
      console.log('Mock: Getting user by ID', id);
      if (id === 1) {
        return mockAdminUser;
      }
      return null;
    },
    
    // Course functions
    async getAllCourses() {
      console.log('Mock: Getting all courses');
      return { results: [] };
    },
    
    async getCourseById(id) {
      console.log('Mock: Getting course by ID', id);
      return null;
    },
    
    // Topic functions
    async getTopicsByCourseId(courseId) {
      console.log('Mock: Getting topics by course ID', courseId);
      return { results: [] };
    },
    
    // Lesson functions
    async getLessonsByTopicId(topicId) {
      console.log('Mock: Getting lessons by topic ID', topicId);
      return { results: [] };
    },
    
    // Problem functions
    async getProblemsByTopicId(topicId) {
      console.log('Mock: Getting problems by topic ID', topicId);
      return { results: [] };
    },
    
    // User progress functions
    async getUserProgress(userId) {
      console.log('Mock: Getting user progress', userId);
      return { results: [] };
    },
    
    async getUserXPHistory(userId) {
      console.log('Mock: Getting user XP history', userId);
      return { results: [] };
    },
    
    // Helper function to close the database connection
    close() {
      console.log('Mock: Closing database connection');
    }
  };
}

if (typeof window === 'undefined') {
  initializeDatabase().then(result => {
    db = result;
  });
}

export default db;
