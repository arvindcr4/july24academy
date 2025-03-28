import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { cookies } from 'next/headers';

// Simple token generation for demo purposes
// In production, use a proper JWT library with secure keys
function generateToken(userId: number): string {
  return `token_${userId}_${Date.now()}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would hash the password and compare with stored hash
    // This is simplified for demo purposes
    const user = await db.getUserByEmail(email);
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate token and set cookie
    const token = generateToken(user.id);
    
    // Set cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
