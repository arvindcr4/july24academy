// Database connection and utilities
import { createClient } from '@vercel/postgres';

// Create a database client
export const db = createClient({
  connectionString: process.env.POSTGRES_URL || 'postgres://default:default@localhost:5432/july24academy'
});

// Export all the database utility functions
export * from './database';

// Export a default db object for compatibility with existing code
export default db;
