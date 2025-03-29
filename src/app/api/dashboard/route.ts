import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Extract user ID from token (simplified)
    const tokenParts = token.split('_');
    if (tokenParts.length < 2 || !tokenParts[1]) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = parseInt(tokenParts[1]);
    const user = await db.getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user progress data
    const progress = await db.getUserProgress(userId);
    const xpHistory = await db.getUserXPHistory(userId);
    
    // Get courses the user is enrolled in
    const userCourses = await db.getUserCourses(userId);
    
    // Get detailed course information
    const coursesWithProgress = await Promise.all(
      userCourses.map(async (userCourse) => {
        const course = await db.getCourseById(userCourse.course_id);
        const topics = await db.getTopicsByCourseId(userCourse.course_id);
        
        // Calculate course progress
        let completedLessons = 0;
        let totalLessons = 0;
        
        for (const topic of topics) {
          const lessons = await db.getLessonsByTopicId(topic.id);
          totalLessons += lessons.length;
          
          for (const lesson of lessons) {
            const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
            if (lessonProgress && lessonProgress.completed) {
              completedLessons++;
            }
          }
        }
        
        const progressPercentage = totalLessons > 0 
          ? Math.round((completedLessons / totalLessons) * 100) 
          : 0;
        
        // Get next lesson to continue
        let nextLesson = null;
        let nextLessonTopic = null;
        
        for (const topic of topics) {
          const lessons = await db.getLessonsByTopicId(topic.id);
          for (const lesson of lessons) {
            const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
            if (!lessonProgress || !lessonProgress.completed) {
              nextLesson = lesson;
              nextLessonTopic = topic;
              break;
            }
          }
          if (nextLesson) break;
        }
        
        return {
          ...course,
          progress: progressPercentage,
          completedLessons,
          totalLessons,
          nextLesson,
          nextLessonTopic
        };
      })
    );
    
    // Calculate stats
    const totalXP = xpHistory.reduce((sum, entry) => sum + entry.amount, 0);
    const dailyStreak = calculateDailyStreak(xpHistory);
    const completedLessonsCount = progress.filter(p => p.completed).length;
    
    // Get recent activity
    const recentActivity = await db.getUserRecentActivity(userId, 5);
    
    // Get recommended courses
    const allCourses = await db.getAllCourses();
    const enrolledCourseIds = userCourses.map(uc => uc.course_id);
    const recommendedCourses = allCourses
      .filter(course => !enrolledCourseIds.includes(course.id))
      .slice(0, 2); // Get top 2 recommendations
    
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalXP,
        dailyStreak,
        completedLessons: completedLessonsCount,
        totalLessons: progress.length,
      },
      courses: coursesWithProgress,
      recentActivity,
      recommendedCourses
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve dashboard data' },
      { status: 500 }
    );
  }
}

// Helper function to calculate daily streak
function calculateDailyStreak(xpHistory: any[]): number {
  if (xpHistory.length === 0) return 0;
  
  // Sort by date descending
  const sortedHistory = [...xpHistory].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  // Check if there's activity today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const latestActivity = new Date(sortedHistory[0].created_at);
  latestActivity.setHours(0, 0, 0, 0);
  
  if (latestActivity.getTime() < today.getTime()) {
    return 0; // Streak broken if no activity today
  }
  
  // Count consecutive days
  let streak = 1;
  let currentDate = today;
  
  for (let i = 1; i < sortedHistory.length; i++) {
    const activityDate = new Date(sortedHistory[i].created_at);
    activityDate.setHours(0, 0, 0, 0);
    
    // Check if this activity was on the previous day
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    
    if (activityDate.getTime() === previousDay.getTime()) {
      streak++;
      currentDate = previousDay;
    } else if (activityDate.getTime() < previousDay.getTime()) {
      break; // Streak ended
    }
  }
  
  return streak;
}
