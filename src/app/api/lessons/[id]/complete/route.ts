import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib';
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
    
    // Update daily streak
    const currentStreak = await db.updateDailyStreak(userId);
    
    // Get updated user stats
    const userProgress = await db.getUserProgress(userId);
    const xpHistory = await db.getUserXPHistory(userId);
    const totalXP = xpHistory.reduce((sum, entry) => sum + entry.amount, 0);
    const completedLessons = userProgress.filter(p => p.completed).length;
    
    // Get user's learning pace
    const learningPace = await db.getUserLearningPace(userId);
    
    // Get next recommended lesson
    const nextLesson = await db.getNextLesson(lessonId, lesson.topic_id);
    
    return NextResponse.json({
      success: true,
      message: 'Lesson completed successfully',
      xpEarned: xpAmount,
      stats: {
        totalXP,
        currentStreak,
        completedLessons,
        totalLessons: userProgress.length,
        learningPace: learningPace.lessonsPerDay,
        estimatedCompletion: calculateEstimatedCompletion(learningPace)
      },
      nextLesson
    });
  } catch (error) {
    console.error('Lesson completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    );
  }
}

// Helper function to calculate estimated completion date
function calculateEstimatedCompletion(learningPace: any): string {
  if (!learningPace || learningPace.lessonsPerDay <= 0) {
    return 'Unknown';
  }
  
  const remainingLessons = 30 - learningPace.totalCompletedLessons; // Assuming 30 lessons total
  if (remainingLessons <= 0) {
    return 'Completed';
  }
  
  const daysToCompletion = Math.ceil(remainingLessons / learningPace.lessonsPerDay);
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + daysToCompletion);
  
  return completionDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
