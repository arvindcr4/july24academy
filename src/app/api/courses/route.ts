import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib';

export async function GET(request: NextRequest) {
  try {
    // Get all courses
    const courses = await db.getAllCourses();
    
    // For each course, get the topics count, lessons count, and additional details
    const coursesWithDetails = await Promise.all(
      courses.map(async (course) => {
        const topics = await db.getTopicsByCourseId(course.id);
        let totalLessons = 0;
        
        // Count lessons in each topic
        for (const topic of topics) {
          const lessons = await db.getLessonsByTopicId(topic.id);
          totalLessons += lessons.length;
        }
        
        // Get course category
        const category = course.category_id ? 
          await db.prepare('SELECT * FROM course_categories WHERE id = ?').bind(course.category_id).first() : 
          null;
        
        // Get course authors
        const authors = await db.getCourseAuthors(course.id);
        
        // Get course tags
        const tags = await db.getCourseTags(course.id);
        
        return {
          ...course,
          topicsCount: topics.length,
          lessonsCount: totalLessons,
          category: category || null,
          authors: authors?.results || [],
          tags: tags?.results || []
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
