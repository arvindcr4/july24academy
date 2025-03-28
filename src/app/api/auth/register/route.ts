import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // In a real app, you would hash the password before storing
    // This is simplified for demo purposes
    const newUser = await db.createUser({
      name,
      email,
      password,
      created_at: new Date().toISOString()
    });
    
    // Generate token and set cookie (same as login)
    const token = `token_${newUser.id}_${Date.now()}`;
    
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
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
