import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { getAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get course topics
    const topics = await db.getTopicsByCourseId(courseId);

    // Get course category
    const category = course.category_id ? 
      await db.prepare('SELECT * FROM course_categories WHERE id = ?').bind(course.category_id).first() : 
      null;
    
    // Get course authors
    const authors = await db.getCourseAuthors(courseId);
    
    // Get course tags
    const tags = await db.getCourseTags(courseId);
    
    // Get course resources
    const resources = await db.getCourseResources(courseId);
    
    // Get course reviews
    const reviews = await db.getCourseReviews(courseId);
    
    // Get lessons count and structure
    const topicsWithLessons = await Promise.all(
      topics.map(async (topic) => {
        const lessons = await db.getLessonsByTopicId(topic.id);
        return {
          ...topic,
          lessons: lessons.results || []
        };
      })
    );

    // Check if user is authenticated and get enrollment status
    const auth = getAuth(request);
    let enrollment = null;
    let userProgress = null;
    
    if (auth?.userId) {
      // Get enrollment status
      enrollment = await db.prepare(
        'SELECT * FROM course_enrollments WHERE user_id = ? AND course_id = ?'
      ).bind(auth.userId, courseId).first();
      
      // Get user progress for this course
      userProgress = await db.prepare(`
        SELECT 
          COUNT(DISTINCT l.id) as total_lessons,
          COUNT(DISTINCT CASE WHEN up.completed = TRUE THEN l.id END) as completed_lessons
        FROM lessons l
        JOIN topics t ON l.topic_id = t.id
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
        WHERE t.course_id = ?
      `).bind(auth.userId, courseId).first();
    }

    return NextResponse.json({
      ...course,
      category,
      authors: authors?.results || [],
      tags: tags?.results || [],
      resources: resources?.results || [],
      reviews: reviews?.results || [],
      topics: topicsWithLessons,
      enrollment,
      userProgress
    });
  } catch (error) {
    console.error('Course details error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve course details' },
      { status: 500 }
    );
  }
}
