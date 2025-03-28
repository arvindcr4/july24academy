import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Get all courses
    const courses = await db.getAllCourses();
    
    // For each course, get the topics count and lessons count
    const coursesWithDetails = await Promise.all(
      courses.map(async (course) => {
        const topics = await db.getTopicsByCourseId(course.id);
        let totalLessons = 0;
        
        // Count lessons in each topic
        for (const topic of topics) {
          const lessons = await db.getLessonsByTopicId(topic.id);
          totalLessons += lessons.length;
        }
        
        return {
          ...course,
          topicsCount: topics.length,
          lessonsCount: totalLessons
        };
      })
    );
    
    return NextResponse.json(coursesWithDetails);
  } catch (error) {
    console.error('Courses error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve courses' },
      { status: 500 }
    );
  }
}
