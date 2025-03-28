import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lessonId = parseInt(params.id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID' },
        { status: 400 }
      );
    }
    
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
    
    // Get lesson details
    const lesson = await db.getLessonById(lessonId);
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Check if already completed
    const existingProgress = await db.getLessonProgress(userId, lessonId);
    
    if (existingProgress && existingProgress.completed) {
      return NextResponse.json({
        success: true,
        message: 'Lesson already completed',
        xpEarned: 0,
        alreadyCompleted: true
      });
    }
    
    // Mark lesson as completed
    const xpAmount = lesson.xp_value || 15; // Default XP value if not specified
    
    await db.completeLessonForUser(userId, lessonId);
    await db.addXpToUser(userId, xpAmount, `Completed lesson: ${lesson.title}`);
    
    // Get updated user stats
    const userProgress = await db.getUserProgress(userId);
    const xpHistory = await db.getUserXPHistory(userId);
    const totalXP = xpHistory.reduce((sum, entry) => sum + entry.amount, 0);
    const dailyStreak = calculateDailyStreak(xpHistory);
    const completedLessons = userProgress.filter(p => p.completed).length;
    
    return NextResponse.json({
      success: true,
      message: 'Lesson completed successfully',
      xpEarned: xpAmount,
      stats: {
        totalXP,
        dailyStreak,
        completedLessons,
        totalLessons: userProgress.length,
      }
    });
  } catch (error) {
    console.error('Lesson completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    );
  }
}

// Helper function to calculate daily streak (same as in user route)
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
