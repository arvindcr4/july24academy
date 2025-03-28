import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
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

    // Add bookmark
    const bookmark = await db.addBookmark(auth.userId, courseId);

    return NextResponse.json({ success: true, bookmark });
  } catch (error) {
    console.error('Course bookmark error:', error);
    return NextResponse.json(
      { error: 'Failed to bookmark course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Find the bookmark
    const bookmark = await db.prepare(
      'SELECT id FROM user_bookmarks WHERE user_id = ? AND course_id = ?'
    ).bind(auth.userId, courseId).first();

    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    // Remove bookmark
    await db.removeBookmark(bookmark.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Course bookmark removal error:', error);
    return NextResponse.json(
      { error: 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}
