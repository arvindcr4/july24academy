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

    // Get request body
    const body = await request.json();
    const { rating, reviewText } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Add review
    const review = await db.addCourseReview(auth.userId, courseId, rating, reviewText || '');

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Course review error:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}
