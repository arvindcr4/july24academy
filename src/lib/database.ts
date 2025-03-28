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
  key_points: Database;
  prerequisites: Database;
  daily_streaks: Database;
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
    'INSERT INTO xp_history (user_id, amount, source, earned_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
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

// New function to get key points for a lesson
export async function getLessonKeyPoints(db: D1Database, lessonId: number) {
  return db.prepare(
    'SELECT * FROM key_points WHERE lesson_id = ? ORDER BY order_index'
  ).bind(lessonId).all();
}

// New function to get prerequisites for a lesson with details
export async function getLessonPrerequisitesWithDetails(db: D1Database, lessonId: number) {
  return db.prepare(`
    SELECT p.*, l.title as prerequisite_title, l.id as prerequisite_id
    FROM prerequisites p
    JOIN lessons l ON p.prerequisite_lesson_id = l.id
    WHERE p.lesson_id = ?
    ORDER BY p.order_index
  `).bind(lessonId).all();
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

// New function to update daily streak
export async function updateDailyStreak(db: D1Database, userId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get the last streak record
  const lastStreak = await db.prepare(`
    SELECT * FROM daily_streaks 
    WHERE user_id = ? 
    ORDER BY streak_date DESC 
    LIMIT 1
  `).bind(userId).first();
  
  if (!lastStreak) {
    // First time user, create new streak
    await db.prepare(`
      INSERT INTO daily_streaks (user_id, streak_count, streak_date) 
      VALUES (?, 1, CURRENT_DATE)
    `).bind(userId).run();
    return 1;
  }
  
  const lastStreakDate = new Date(lastStreak.streak_date);
  lastStreakDate.setHours(0, 0, 0, 0);
  
  // Check if already logged in today
  if (lastStreakDate.getTime() === today.getTime()) {
    return lastStreak.streak_count;
  }
  
  // Check if yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastStreakDate.getTime() === yesterday.getTime()) {
    // Continue streak
    const newStreakCount = lastStreak.streak_count + 1;
    await db.prepare(`
      INSERT INTO daily_streaks (user_id, streak_count, streak_date) 
      VALUES (?, ?, CURRENT_DATE)
    `).bind(userId, newStreakCount).run();
    
    // Award bonus XP for streak milestones
    if (newStreakCount % 7 === 0) {
      // Weekly milestone
      await updateUserXP(db, userId, 50, `${newStreakCount} day streak bonus!`);
    } else if (newStreakCount % 30 === 0) {
      // Monthly milestone
      await updateUserXP(db, userId, 200, `${newStreakCount} day streak bonus!`);
    } else {
      // Regular streak continuation
      await updateUserXP(db, userId, 5, `Daily streak continued: ${newStreakCount} days`);
    }
    
    return newStreakCount;
  } else {
    // Streak broken, start new streak
    await db.prepare(`
      INSERT INTO daily_streaks (user_id, streak_count, streak_date) 
      VALUES (?, 1, CURRENT_DATE)
    `).bind(userId).run();
    return 1;
  }
}

// New function to get user's current streak
export async function getCurrentStreak(db: D1Database, userId: number) {
  const streak = await db.prepare(`
    SELECT streak_count FROM daily_streaks 
    WHERE user_id = ? 
    ORDER BY streak_date DESC 
    LIMIT 1
  `).bind(userId).first();
  
  return streak ? streak.streak_count : 0;
}

// Enhanced dashboard data function
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
  
  // Get current streak
  const currentStreak = await getCurrentStreak(db, userId);
  
  // Get weekly XP
  const weeklyXP = await db.prepare(`
    SELECT SUM(amount) as weekly_xp
    FROM xp_history
    WHERE user_id = ? AND earned_at >= datetime('now', '-7 days')
  `).bind(userId).first();
  
  // Get recommended next lessons
  const recommendedLessons = await db.prepare(`
    SELECT l.*, t.title as topic_title, c.title as course_title
    FROM lessons l
    JOIN topics t ON l.topic_id = t.id
    JOIN courses c ON t.course_id = c.id
    LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
    WHERE up.id IS NULL OR up.completed = FALSE
    ORDER BY l.difficulty, l.order_index
    LIMIT 3
  `).bind(userId).all();
  
  return {
    user,
    recentProgress: recentProgress.results,
    xpHistory: xpHistory.results,
    courseProgress: courseProgress.results,
    currentStreak,
    weeklyXP: weeklyXP ? weeklyXP.weekly_xp || 0 : 0,
    recommendedLessons: recommendedLessons.results
  };
}

// New function to record practice problem attempts with timing
export async function recordPracticeAttempt(db: D1Database, userId: number, problemId: number, answer: string, isCorrect: boolean, timeSpentSeconds: number) {
  return db.prepare(`
    INSERT INTO practice_attempts (
      user_id, problem_id, answer, is_correct, time_spent_seconds, attempted_at
    ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    RETURNING id
  `).bind(userId, problemId, answer, isCorrect ? 1 : 0, timeSpentSeconds).first();
}

// New function to get practice problem statistics
export async function getPracticeProblemStats(db: D1Database, userId: number, problemId: number) {
  return db.prepare(`
    SELECT 
      COUNT(*) as total_attempts,
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_attempts,
      AVG(time_spent_seconds) as avg_time_spent
    FROM practice_attempts
    WHERE user_id = ? AND problem_id = ?
  `).bind(userId, problemId).first();
}

// New function to add XP to user
export async function addXpToUser(db: D1Database, userId: number, amount: number, source: string) {
  return updateUserXP(db, userId, amount, source);
}

// New function to get user's learning pace
export async function getUserLearningPace(db: D1Database, userId: number) {
  const completedLessons = await db.prepare(`
    SELECT COUNT(*) as count
    FROM user_progress
    WHERE user_id = ? AND completed = TRUE
  `).bind(userId).first();
  
  const firstCompletionDate = await db.prepare(`
    SELECT MIN(completed_at) as first_date
    FROM user_progress
    WHERE user_id = ? AND completed = TRUE
  `).bind(userId).first();
  
  const lastCompletionDate = await db.prepare(`
    SELECT MAX(completed_at) as last_date
    FROM user_progress
    WHERE user_id = ? AND completed = TRUE
  `).bind(userId).first();
  
  if (!firstCompletionDate?.first_date || !lastCompletionDate?.last_date) {
    return {
      lessonsPerDay: 0,
      totalCompletedLessons: completedLessons?.count || 0,
      daysActive: 0
    };
  }
  
  const firstDate = new Date(firstCompletionDate.first_date);
  const lastDate = new Date(lastCompletionDate.last_date);
  const daysActive = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  return {
    lessonsPerDay: (completedLessons?.count || 0) / daysActive,
    totalCompletedLessons: completedLessons?.count || 0,
    daysActive
  };
}
