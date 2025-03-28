import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const courseId = parseInt(params.id);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      );
    }
    
    // Get course details
    const course = await db.getCourseById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Get topics for this course
    const topics = await db.getTopicsByCourseId(courseId);
    
    // For each topic, get the lessons
    const topicsWithLessons = await Promise.all(
      topics.map(async (topic) => {
        const lessons = await db.getLessonsByTopicId(topic.id);
        return {
          ...topic,
          lessons
        };
      })
    );
    
    return NextResponse.json({
      ...course,
      topics: topicsWithLessons
    });
  } catch (error) {
    console.error('Course details error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve course details' },
      { status: 500 }
    );
  }
}
