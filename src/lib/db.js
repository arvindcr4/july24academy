// Mock database client for development and testing
// In production, this would connect to a real database

import * as dbFunctions from './database';

// Create a mock database client that implements all the functions from database.ts
const db = Object.keys(dbFunctions).reduce((acc, key) => {
  // Skip the interface and type definitions
  if (key === 'DB' || key === 'executeQuery') return acc;
  
  // Add each function to the db object
  acc[key] = (...args) => {
    console.log(`Called ${key} with args:`, args);
    
    // Mock implementation for testing
    if (key === 'getAllCourses') {
      return { results: [] };
    }
    
    if (key === 'getAllCourseCategories') {
      return { results: [] };
    }
    
    if (key.startsWith('get')) {
      return { results: [] };
    }
    
    return { success: true };
  };
  
  return acc;
}, {});

export { db };
