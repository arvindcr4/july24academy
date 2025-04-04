// Test script for the course database integration
// This script will create the database and insert the course content

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Import course content
const tracks = require('./src/course_content/course_tracks');
const dataStructuresTopics = require('./src/course_content/data_structures_topics');
const interviewFundamentalsTopics = require('./src/course_content/interview_fundamentals_topics');
const algorithmsTopics = require('./src/course_content/algorithms_topics');
const systemDesignTopics = require('./src/course_content/system_design_topics');
const languageSpecificTopics = require('./src/course_content/language_specific_topics');
const arraysAndStringsLessons = require('./src/course_content/arrays_strings_lessons');
const arraysAndStringsProblems = require('./src/course_content/arrays_strings_problems');
const linkedListsLessons = require('./src/course_content/linked_lists_lessons');
const linkedListsProblems = require('./src/course_content/linked_lists_problems');
const stacksQueuesLessons = require('./src/course_content/stacks_queues_lessons');
const stacksQueuesProblems = require('./src/course_content/stacks_queues_problems');

// Database path
const dbPath = path.join(__dirname, 'july24academy_test.db');

// Delete existing database if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Deleted existing test database');
}

// Initialize database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to the test database.');
  
  // Begin database operations
  initializeDatabase();
});

// Initialize database schema
function initializeDatabase() {
  console.log('Initializing database schema...');
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
      console.error('Error enabling foreign keys:', err.message);
      return;
    }
    
    // Create tables
    createTables();
  });
}

// Create necessary tables
function createTables() {
  // Create tracks table
  db.run(`
    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      order_index INTEGER
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tracks table:', err.message);
      return;
    }
    
    // Create topics table
    db.run(`
      CREATE TABLE IF NOT EXISTS topics (
        id INTEGER PRIMARY KEY,
        track_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        order_index INTEGER,
        estimated_hours REAL,
        FOREIGN KEY (track_id) REFERENCES tracks (id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating topics table:', err.message);
        return;
      }
      
      // Create lessons table
      db.run(`
        CREATE TABLE IF NOT EXISTS lessons (
          id INTEGER PRIMARY KEY,
          topic_id INTEGER,
          title TEXT NOT NULL,
          description TEXT,
          order_index INTEGER,
          estimated_minutes INTEGER,
          xp_reward INTEGER,
          content TEXT,
          FOREIGN KEY (topic_id) REFERENCES topics (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating lessons table:', err.message);
          return;
        }
        
        // Create problems table
        db.run(`
          CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY,
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
        `, (err) => {
          if (err) {
            console.error('Error creating problems table:', err.message);
            return;
          }
          
          // Create user_progress table
          db.run(`
            CREATE TABLE IF NOT EXISTS user_progress (
              user_id INTEGER,
              lesson_id INTEGER,
              problem_id INTEGER,
              completed BOOLEAN DEFAULT 0,
              xp_earned INTEGER DEFAULT 0,
              completion_date DATETIME,
              PRIMARY KEY (user_id, lesson_id, problem_id)
            )
          `, (err) => {
            if (err) {
              console.error('Error creating user_progress table:', err.message);
              return;
            }
            
            // Insert course content
            insertCourseContent();
          });
        });
      });
    });
  });
}

// Insert course content into database
function insertCourseContent() {
  console.log('Inserting course content...');
  
  // Begin transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Insert tracks
    const trackStmt = db.prepare('INSERT OR REPLACE INTO tracks (id, title, description, icon, order_index) VALUES (?, ?, ?, ?, ?)');
    tracks.forEach(track => {
      trackStmt.run(track.id, track.title, track.description, track.icon, track.order_index);
    });
    trackStmt.finalize();
    
    // Insert topics
    const topicStmt = db.prepare('INSERT OR REPLACE INTO topics (id, track_id, title, description, icon, order_index, estimated_hours) VALUES (?, ?, ?, ?, ?, ?, ?)');
    
    // Data Structures topics
    dataStructuresTopics.forEach(topic => {
      topicStmt.run(topic.id, topic.track_id, topic.title, topic.description, topic.icon, topic.order_index, topic.estimated_hours);
    });
    
    // Interview Fundamentals topics
    interviewFundamentalsTopics.forEach(topic => {
      topicStmt.run(topic.id, topic.track_id, topic.title, topic.description, topic.icon, topic.order_index, topic.estimated_hours);
    });
    
    // Algorithms topics
    algorithmsTopics.forEach(topic => {
      topicStmt.run(topic.id, topic.track_id, topic.title, topic.description, topic.icon, topic.order_index, topic.estimated_hours);
    });
    
    // System Design topics
    systemDesignTopics.forEach(topic => {
      topicStmt.run(topic.id, topic.track_id, topic.title, topic.description, topic.icon, topic.order_index, topic.estimated_hours);
    });
    
    // Language-Specific topics
    languageSpecificTopics.forEach(topic => {
      topicStmt.run(topic.id, topic.track_id, topic.title, topic.description, topic.icon, topic.order_index, topic.estimated_hours);
    });
    
    topicStmt.finalize();
    
    // Insert lessons
    const lessonStmt = db.prepare('INSERT OR REPLACE INTO lessons (id, topic_id, title, description, order_index, estimated_minutes, xp_reward, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    
    // Arrays and Strings lessons
    arraysAndStringsLessons.forEach(lesson => {
      lessonStmt.run(lesson.id, lesson.topic_id, lesson.title, lesson.description, lesson.order_index, lesson.estimated_minutes, lesson.xp_reward, lesson.content);
    });
    
    // Linked Lists lessons
    linkedListsLessons.forEach(lesson => {
      lessonStmt.run(lesson.id, lesson.topic_id, lesson.title, lesson.description, lesson.order_index, lesson.estimated_minutes, lesson.xp_reward, lesson.content);
    });
    
    // Stacks and Queues lessons
    stacksQueuesLessons.forEach(lesson => {
      lessonStmt.run(lesson.id, lesson.topic_id, lesson.title, lesson.description, lesson.order_index, lesson.estimated_minutes, lesson.xp_reward, lesson.content);
    });
    
    lessonStmt.finalize();
    
    // Insert problems
    const problemStmt = db.prepare(`
      INSERT OR REPLACE INTO problems (
        id, topic_id, title, description, difficulty, estimated_minutes, xp_reward, 
        starter_code, test_cases, constraints, input_format, output_format, 
        time_complexity, space_complexity, hints, solution
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Arrays and Strings problems
    arraysAndStringsProblems.forEach(problem => {
      problemStmt.run(
        problem.id, 
        problem.topic_id, 
        problem.title, 
        problem.description, 
        problem.difficulty, 
        problem.estimated_minutes, 
        problem.xp_reward,
        problem.details.starter_code,
        problem.details.test_cases,
        problem.details.constraints,
        problem.details.input_format,
        problem.details.output_format,
        problem.details.time_complexity,
        problem.details.space_complexity,
        JSON.stringify(problem.hints),
        problem.solution
      );
    });
    
    // Linked Lists problems
    linkedListsProblems.forEach(problem => {
      problemStmt.run(
        problem.id, 
        problem.topic_id, 
        problem.title, 
        problem.description, 
        problem.difficulty, 
        problem.estimated_minutes, 
        problem.xp_reward,
        problem.details.starter_code,
        problem.details.test_cases,
        problem.details.constraints,
        problem.details.input_format,
        problem.details.output_format,
        problem.details.time_complexity,
        problem.details.space_complexity,
        JSON.stringify(problem.hints),
        problem.solution
      );
    });
    
    // Stacks and Queues problems
    stacksQueuesProblems.forEach(problem => {
      problemStmt.run(
        problem.id, 
        problem.topic_id, 
        problem.title, 
        problem.description, 
        problem.difficulty, 
        problem.estimated_minutes, 
        problem.xp_reward,
        problem.details.starter_code,
        problem.details.test_cases,
        problem.details.constraints,
        problem.details.input_format,
        problem.details.output_format,
        problem.details.time_complexity,
        problem.details.space_complexity,
        JSON.stringify(problem.hints),
        problem.solution
      );
    });
    
    problemStmt.finalize();
    
    // Commit transaction
    db.run('COMMIT', (err) => {
      if (err) {
        console.error('Error committing transaction:', err.message);
        return;
      }
      
      console.log('Course content successfully inserted into database.');
      
      // Verify data was inserted correctly
      verifyDataInsertion();
    });
  });
}

// Verify data was inserted correctly
function verifyDataInsertion() {
  console.log('\nVerifying data insertion...');
  
  // Check tracks
  db.all('SELECT COUNT(*) as count FROM tracks', [], (err, rows) => {
    if (err) {
      console.error('Error counting tracks:', err.message);
      return;
    }
    console.log(`Tracks: ${rows[0].count}`);
    
    // Check topics
    db.all('SELECT COUNT(*) as count FROM topics', [], (err, rows) => {
      if (err) {
        console.error('Error counting topics:', err.message);
        return;
      }
      console.log(`Topics: ${rows[0].count}`);
      
      // Check lessons
      db.all('SELECT COUNT(*) as count FROM lessons', [], (err, rows) => {
        if (err) {
          console.error('Error counting lessons:', err.message);
          return;
        }
        console.log(`Lessons: ${rows[0].count}`);
        
        // Check problems
        db.all('SELECT COUNT(*) as count FROM problems', [], (err, rows) => {
          if (err) {
            console.error('Error counting problems:', err.message);
            return;
          }
          console.log(`Problems: ${rows[0].count}`);
          
          // Sample data from each table
          console.log('\nSample data from each table:');
          
          // Sample track
          db.get('SELECT * FROM tracks LIMIT 1', [], (err, row) => {
            if (err) {
              console.error('Error getting sample track:', err.message);
              return;
            }
            console.log('Sample track:', row);
            
            // Sample topic
            db.get('SELECT * FROM topics LIMIT 1', [], (err, row) => {
              if (err) {
                console.error('Error getting sample topic:', err.message);
                return;
              }
              console.log('Sample topic:', row);
              
              // Sample lesson
              db.get('SELECT id, topic_id, title, order_index, estimated_minutes, xp_reward FROM lessons LIMIT 1', [], (err, row) => {
                if (err) {
                  console.error('Error getting sample lesson:', err.message);
                  return;
                }
                console.log('Sample lesson:', row);
                
                // Sample problem
                db.get('SELECT id, topic_id, title, difficulty, estimated_minutes, xp_reward FROM problems LIMIT 1', [], (err, row) => {
                  if (err) {
                    console.error('Error getting sample problem:', err.message);
                    return;
                  }
                  console.log('Sample problem:', row);
                  
                  console.log('\nDatabase verification complete!');
                  
                  // Close database connection
                  db.close((err) => {
                    if (err) {
                      console.error('Error closing database:', err.message);
                      return;
                    }
                    console.log('Database connection closed.');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}
