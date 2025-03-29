// This file re-exports the auth context to ensure proper importing
// This helps Next.js resolve the auth context import correctly

// Export AuthProvider and useAuth
export { AuthProvider, useAuth } from './auth-context';

// Export any other auth-related utilities
export { default as AuthContext } from './auth-context';
