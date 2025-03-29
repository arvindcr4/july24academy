import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib';
import { getAuth } from '@/lib/auth';

export async function POST(
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

    // Check if user is authenticated
    const auth = getAuth(request);
    if (!auth?.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Enroll user in course
    const enrollment = await db.enrollUserInCourse(auth.userId, courseId);
    
    // Add XP for enrollment if this is a new enrollment
    if (enrollment && !enrollment.last_accessed_at) {
      await db.addXpToUser(auth.userId, 25, `Enrolled in new course`);
    }

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error('Course enrollment error:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}
