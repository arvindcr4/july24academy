// Updated user route with proper JWT token verification
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { cookies } from 'next/headers';
import { verifyToken, getUserFromToken } from '@/lib/auth-utils';

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
    
    // Verify the token and get user information
    const userData = getUserFromToken(token);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = userData.id;
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
    
    // Calculate stats
    const totalXP = xpHistory.reduce((sum, entry) => sum + entry.amount, 0);
    const dailyStreak = calculateDailyStreak(xpHistory);
    const completedLessons = progress.filter(p => p.completed).length;
    
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalXP,
        dailyStreak,
        completedLessons,
        totalLessons: progress.length,
      },
      progress,
      recentActivity: xpHistory.slice(0, 5) // Get 5 most recent activities
    });
  } catch (error) {
    console.error('User data error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user data' },
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
