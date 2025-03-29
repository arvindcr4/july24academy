import { createClient } from '@vercel/postgres';

// Database Types
interface BaseModel {
  id: string;
  created_at: Date;
  updated_at?: Date;
}

export interface User extends BaseModel {
  name: string;
  email: string;
  password_hash: string;
  role: string;
  xp_total: number;
}

export interface Course extends BaseModel {
  title: string;
  description: string;
  image_url: string;
  difficulty_level: string;
  category_id: string;
  order_index: number;
  is_featured: boolean;
}

export interface Topic extends BaseModel {
  course_id: string;
  title: string;
  description: string;
  order_index: number;
}

export interface Lesson extends BaseModel {
  topic_id: string;
  title: string;
  content: string;
  difficulty: number;
  xp_reward: number;
  order_index: number;
}

// Database client
export const db = createClient({
  connectionString: process.env.POSTGRES_URL
});

// Helper function
async function executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await db.query<T>(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// User functions
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await executeQuery<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return users[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function createUser(data: {
  email: string;
  name: string;
  password_hash: string;
}): Promise<User | null> {
  try {
    const users = await executeQuery<User>(
      `INSERT INTO users (email, name, password_hash, role, xp_total)
       VALUES ($1, $2, $3, 'user', 0)
       RETURNING *`,
      [data.email, data.name, data.password_hash]
    );
    return users[0] || null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Course functions
export async function getAllCourses(): Promise<Course[]> {
  try {
    return await executeQuery<Course>('SELECT * FROM courses ORDER BY order_index, id');
  } catch (error) {
    console.error('Error getting all courses:', error);
    return [];
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const courses = await executeQuery<Course>('SELECT * FROM courses WHERE id = $1', [id]);
    return courses[0] || null;
  } catch (error) {
    console.error('Error getting course by id:', error);
    return null;
  }
}

export async function getTopicsByCourseId(courseId: string): Promise<Topic[]> {
  try {
    return await executeQuery<Topic>(
      'SELECT * FROM topics WHERE course_id = $1 ORDER BY order_index',
      [courseId]
    );
  } catch (error) {
    console.error('Error getting topics by course id:', error);
    return [];
  }
}

export async function getLessonsByTopicId(topicId: string): Promise<Lesson[]> {
  try {
    return await executeQuery<Lesson>(
      'SELECT * FROM lessons WHERE topic_id = $1 ORDER BY order_index',
      [topicId]
    );
  } catch (error) {
    console.error('Error getting lessons by topic id:', error);
    return [];
  }
}

