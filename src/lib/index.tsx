// This file re-exports the auth context and database to ensure proper importing
// This helps Next.js resolve imports correctly

// Export AuthProvider and useAuth
export { AuthProvider, useAuth } from './auth-context';

// Export database client and utilities
export { db } from './db';
