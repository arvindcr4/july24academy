// Environment-aware database configuration
// This file selects the appropriate database implementation based on the environment

const environment = process.env.NODE_ENV || 'development';

let dbModule;

if (environment === 'production') {
  // Use production database implementation on Render
  dbModule = require('./production-db');
  console.log('Using production database configuration');
} else {
  // Use development database implementation locally
  dbModule = require('./real-db');
  console.log('Using development database configuration');
}

// Export the appropriate database implementation
export const db = dbModule.db;
