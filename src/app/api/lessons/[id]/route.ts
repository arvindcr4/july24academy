import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lessonId = parseInt(params.id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID' },
        { status: 400 }
      );
    }
    
    // Get lesson details
    const lesson = await db.getLessonById(lessonId);
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }
    
    // Get topic and course information
    const topic = await db.getTopicById(lesson.topic_id);
    const course = topic ? await db.getCourseById(topic.course_id) : null;
    
    // Get prerequisites with details
    const prerequisites = await db.getLessonPrerequisitesWithDetails(lessonId);
    
    // Get key points for the lesson
    const keyPoints = await db.getLessonKeyPoints(lessonId);
    
    // Get next lesson in sequence
    const nextLesson = await db.getNextLesson(lessonId, lesson.topic_id);
    
    // Check if user has completed this lesson
    const token = cookies().get('auth_token')?.value;
    let userProgress = null;
    let userStreak = 0;
    
    if (token) {
      // Extract user ID from token (simplified)
      const tokenParts = token.split('_');
      if (tokenParts.length >= 2) {
        const userId = parseInt(tokenParts[1]);
        userProgress = await db.getLessonProgress(userId, lessonId);
        userStreak = await db.getCurrentStreak(userId);
        
        // Update user's streak if they're active today
        await db.updateDailyStreak(userId);
      }
    }
    
    return NextResponse.json({
      lesson,
      topic,
      course,
      prerequisites,
      keyPoints,
      nextLesson,
      userProgress,
      userStreak
    });
  } catch (error) {
    console.error('Lesson details error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve lesson details' },
      { status: 500 }
    );
  }
}
