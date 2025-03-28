import { Database } from '@cloudflare/d1';

// Define the database interface
export interface DB {
  users: Database;
  courses: Database;
  topics: Database;
  lessons: Database;
  practice_problems: Database;
  user_progress: Database;
  xp_history: Database;
}

// Helper function to execute SQL queries
export async function executeQuery(db: D1Database, query: string, params?: any[]) {
  try {
    const result = await db.prepare(query).bind(...(params || [])).all();
    return result;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// User-related database functions
export async function getUserByEmail(db: D1Database, email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
}

export async function createUser(db: D1Database, email: string, username: string, passwordHash: string) {
  return db.prepare(
    'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?) RETURNING *'
  ).bind(email, username, passwordHash).first();
}

export async function updateUserXP(db: D1Database, userId: number, amount: number, source: string) {
  // Add XP to user's total
  await db.prepare(
    'UPDATE users SET xp_total = xp_total + ? WHERE id = ?'
  ).bind(amount, userId).run();
  
  // Record in XP history
  return db.prepare(
    'INSERT INTO xp_history (user_id, amount, source) VALUES (?, ?, ?)'
  ).bind(userId, amount, source).run();
}

// Course-related database functions
export async function getAllCourses(db: D1Database) {
  return db.prepare('SELECT * FROM courses ORDER BY id').all();
}

export async function getCourseById(db: D1Database, courseId: number) {
  return db.prepare('SELECT * FROM courses WHERE id = ?').bind(courseId).first();
}

export async function getTopicsByCourseId(db: D1Database, courseId: number) {
  return db.prepare(
    'SELECT * FROM topics WHERE course_id = ? ORDER BY order_index'
  ).bind(courseId).all();
}

// Lesson-related database functions
export async function getLessonsByTopicId(db: D1Database, topicId: number) {
  return db.prepare(
    'SELECT * FROM lessons WHERE topic_id = ? ORDER BY order_index'
  ).bind(topicId).all();
}

export async function getLessonById(db: D1Database, lessonId: number) {
  return db.prepare('SELECT * FROM lessons WHERE id = ?').bind(lessonId).first();
}

export async function getPracticeProblems(db: D1Database, lessonId: number) {
  return db.prepare(
    'SELECT * FROM practice_problems WHERE lesson_id = ? ORDER BY difficulty'
  ).bind(lessonId).all();
}

// Progress tracking functions
export async function markLessonComplete(db: D1Database, userId: number, lessonId: number) {
  // Check if already completed
  const existing = await db.prepare(
    'SELECT * FROM user_progress WHERE user_id = ? AND lesson_id = ?'
  ).bind(userId, lessonId).first();
  
  if (existing) {
    if (!existing.completed) {
      // Update existing record
      await db.prepare(
        'UPDATE user_progress SET completed = TRUE, completed_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(existing.id).run();
      
      // Get lesson XP reward
      const lesson = await getLessonById(db, lessonId);
      if (lesson) {
        await updateUserXP(db, userId, lesson.xp_reward, `Completed lesson: ${lesson.title}`);
      }
    }
    return existing.id;
  } else {
    // Create new record
    const result = await db.prepare(
      'INSERT INTO user_progress (user_id, lesson_id, completed, completed_at) VALUES (?, ?, TRUE, CURRENT_TIMESTAMP) RETURNING id'
    ).bind(userId, lessonId).first();
    
    // Get lesson XP reward
    const lesson = await getLessonById(db, lessonId);
    if (lesson) {
      await updateUserXP(db, userId, lesson.xp_reward, `Completed lesson: ${lesson.title}`);
    }
    
    return result?.id;
  }
}

export async function getUserProgress(db: D1Database, userId: number) {
  return db.prepare(`
    SELECT up.*, l.title as lesson_title, t.title as topic_title, c.title as course_title
    FROM user_progress up
    JOIN lessons l ON up.lesson_id = l.id
    JOIN topics t ON l.topic_id = t.id
    JOIN courses c ON t.course_id = c.id
    WHERE up.user_id = ?
    ORDER BY up.completed_at DESC
  `).bind(userId).all();
}

export async function getUserXPHistory(db: D1Database, userId: number, limit: number = 10) {
  return db.prepare(`
    SELECT * FROM xp_history
    WHERE user_id = ?
    ORDER BY earned_at DESC
    LIMIT ?
  `).bind(userId, limit).all();
}

export async function getDashboardData(db: D1Database, userId: number) {
  // Get user data
  const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
  
  // Get recent progress
  const recentProgress = await db.prepare(`
    SELECT up.*, l.title as lesson_title, t.title as topic_title, c.title as course_title
    FROM user_progress up
    JOIN lessons l ON up.lesson_id = l.id
    JOIN topics t ON l.topic_id = t.id
    JOIN courses c ON t.course_id = c.id
    WHERE up.user_id = ? AND up.completed = TRUE
    ORDER BY up.completed_at DESC
    LIMIT 5
  `).bind(userId).all();
  
  // Get XP history
  const xpHistory = await db.prepare(`
    SELECT * FROM xp_history
    WHERE user_id = ?
    ORDER BY earned_at DESC
    LIMIT 10
  `).bind(userId).all();
  
  // Get course progress
  const courseProgress = await db.prepare(`
    SELECT 
      c.id as course_id, 
      c.title as course_title,
      COUNT(DISTINCT l.id) as total_lessons,
      COUNT(DISTINCT CASE WHEN up.completed = TRUE THEN up.lesson_id END) as completed_lessons
    FROM courses c
    JOIN topics t ON c.id = t.course_id
    JOIN lessons l ON t.id = l.topic_id
    LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
    GROUP BY c.id
    ORDER BY c.id
  `).bind(userId).all();
  
  return {
    user,
    recentProgress: recentProgress.results,
    xpHistory: xpHistory.results,
    courseProgress: courseProgress.results
  };
}
