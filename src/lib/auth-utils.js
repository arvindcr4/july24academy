// Authentication utilities for the July24Academy app
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Secret key for JWT signing - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'july24academy_secret_key';

/**
 * Hash a password using bcrypt
 * 
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 * 
 * @param {string} password - The plain text password to check
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} - Whether the password matches
 */
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token for a user
 * 
 * @param {Object} user - The user object
 * @returns {string} - The JWT token
 */
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify a JWT token
 * 
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} - The decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Get user information from a JWT token
 * 
 * @param {string} token - The JWT token
 * @returns {Object|null} - The user information or null if invalid
 */
export function getUserFromToken(token) {
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name
  };
}
