// Updated register route with proper password hashing and JWT token generation
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib';
import { cookies } from 'next/headers';
import { hashPassword, generateToken } from '@/lib/auth-utils';

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
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(password);
    
    const newUser = await db.createUser({
      name,
      email,
      password: hashedPassword, // Store hashed password
      created_at: new Date().toISOString()
    });
    
    // Generate JWT token
    const token = generateToken(newUser);
    
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
