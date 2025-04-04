// Database implementation for Render.com compatibility
// This file provides a database implementation that works in both local and Render.com environments
const fs = typeof window === 'undefined' ? require('fs') : null;
const path = typeof window === 'undefined' ? require('path') : null;

const __dirname = typeof window === 'undefined' ? process.cwd() : '';

const dbDir = typeof window === 'undefined' ? path.join(__dirname, 'databases') : '';

const defaultDbPath = typeof window === 'undefined' ? path.join(dbDir, 'default.sqlite') : '';

const mockDataPath = typeof window === 'undefined' ? path.join(__dirname, 'mock-data') : '';

if (typeof window === 'undefined' && fs) {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

const dbConnections = new Map();

// Database API implementation
let defaultDb;

function getCourseDbPath(courseId) {
  if (typeof window === 'undefined' && courseId) {
    return path.join(dbDir, `course_${courseId}.sqlite`);
  }
  return defaultDbPath;
}

// Initialize database with fallback for Render.com
async function initializeDatabase(courseId = null) {
  if (typeof window !== 'undefined') {
    return createMockDatabaseAPI(courseId);
  }
  
  const dbPath = getCourseDbPath(courseId);
  if (dbConnections.has(dbPath)) {
    return dbConnections.get(dbPath);
  }
  
  try {
    // Try to import sqlite3
    const sqlite3 = await import('sqlite3');
    
    // Initialize SQLite database
    const sqliteDb = new sqlite3.default.Database(dbPath, (err) => {
      if (err) {
        console.error(`Error opening database ${dbPath}:`, err.message);
        throw err;
      } else {
        console.log(`Connected to the SQLite database at ${dbPath}`);
        initializeSchema(sqliteDb);
      }
    });
    
    const dbApi = createRealDatabaseAPI(sqliteDb, courseId);
    
    dbConnections.set(dbPath, dbApi);
    
    // Return real database API
    return dbApi;
  } catch (error) {
    console.error(`Failed to initialize SQLite database for course ${courseId}:`, error.message);
    console.log('Using mock database implementation for Render.com');
    
    // Return mock database API for Render.com
    return createMockDatabaseAPI(courseId);
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
function createRealDatabaseAPI(sqliteDb, courseId = null) {
  return {
    courseId,
    
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
      if (this.courseId && this.courseId === id) {
        console.log(`Using course-specific database for course ${id}`);
      }
      
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
      if (this.courseId && this.courseId === courseId) {
        console.log(`Using course-specific database for topics in course ${courseId}`);
      }
      
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
function createMockDatabaseAPI(courseId = null) {
  console.log(`Using mock database API for ${courseId ? `course ${courseId}` : 'default database'}`);
  
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
    courseId,
    
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
      console.log(`Mock: Getting course by ID ${id} from ${this.courseId ? `course-specific database for course ${this.courseId}` : 'default database'}`);
      
      const mockCourses = [
        {
          id: 1,
          title: 'Algebra Fundamentals',
          description: 'Master the core concepts of algebra, from equations to functions and beyond.',
          image_url: '/images/algebra.png',
          difficulty_level: 'Beginner',
          category_id: 1,
          order_index: 1,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Calculus I',
          description: 'Learn the fundamentals of calculus including limits, derivatives, and integrals.',
          image_url: '/images/calculus.png',
          difficulty_level: 'Intermediate',
          category_id: 1,
          order_index: 2,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Data Structures & Algorithms',
          description: 'Master essential data structures and algorithms for efficient problem-solving.',
          image_url: '/images/dsa.png',
          difficulty_level: 'Advanced',
          category_id: 2,
          order_index: 3,
          created_at: new Date().toISOString()
        }
      ];
      
      const course = mockCourses.find(c => c.id === id);
      return course || null;
    },
    
    // Topic functions
    async getTopicsByCourseId(courseId) {
      console.log(`Mock: Getting topics by course ID ${courseId} from ${this.courseId ? `course-specific database for course ${this.courseId}` : 'default database'}`);
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

const mockDb = createMockDatabaseAPI();

const db = {
  _realDb: mockDb,
  _initializing: false,
  _initialized: false,
  
  async _ensureInitialized() {
    if (this._initialized) {
      return this._realDb;
    }
    
    if (!this._initializing && typeof window === 'undefined') {
      this._initializing = true;
      try {
        this._realDb = await initializeDatabase();
        console.log('Real database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error.message);
        this._realDb = mockDb;
      } finally {
        this._initialized = true;
        this._initializing = false;
      }
    }
    
    return this._realDb;
  },
  
  async createUser(...args) {
    const db = await this._ensureInitialized();
    return db.createUser(...args);
  },
  
  async getUserByEmail(...args) {
    const db = await this._ensureInitialized();
    return db.getUserByEmail(...args);
  },
  
  async getUserById(...args) {
    const db = await this._ensureInitialized();
    return db.getUserById(...args);
  },
  
  async getAllCourses(...args) {
    const db = await this._ensureInitialized();
    return db.getAllCourses(...args);
  },
  
  async getCourseById(...args) {
    const db = await this._ensureInitialized();
    return db.getCourseById(...args);
  },
  
  async getTopicsByCourseId(...args) {
    const db = await this._ensureInitialized();
    return db.getTopicsByCourseId(...args);
  },
  
  async getLessonsByTopicId(...args) {
    const db = await this._ensureInitialized();
    return db.getLessonsByTopicId(...args);
  },
  
  async getProblemsByTopicId(...args) {
    const db = await this._ensureInitialized();
    return db.getProblemsByTopicId(...args);
  },
  
  async getUserProgress(...args) {
    const db = await this._ensureInitialized();
    return db.getUserProgress(...args);
  },
  
  async getUserXPHistory(...args) {
    const db = await this._ensureInitialized();
    return db.getUserXPHistory(...args);
  },
  
  close() {
    if (this._realDb && typeof this._realDb.close === 'function') {
      this._realDb.close();
    }
  }
};

if (typeof window === 'undefined') {
  db._ensureInitialized().catch(error => {
    console.error('Background database initialization failed:', error.message);
  });
}

export { initializeDatabase };
export default db;
