import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib';

export async function GET(request: NextRequest) {
  try {
    // Get all course categories
    const categories = await db.getAllCourseCategories();
    
    // For each category, get the courses count
    const categoriesWithDetails = await Promise.all(
      categories.map(async (category) => {
        const courses = await db.getCoursesByCategory(category.id);
        
        return {
          ...category,
          coursesCount: courses.length
        };
      })
    );
    
    return NextResponse.json(categoriesWithDetails);
  } catch (error) {
    console.error('Categories error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve course categories' },
      { status: 500 }
    );
  }
}
