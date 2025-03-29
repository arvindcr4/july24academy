// This file re-exports the auth context to ensure proper importing
// This helps Next.js resolve the auth context import correctly

export { AuthProvider, useAuth } from './auth-context';
