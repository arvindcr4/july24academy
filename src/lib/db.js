// Environment-aware database configuration
// This file selects the appropriate database implementation based on the environment

const environment = process.env.NODE_ENV || 'development';

let db;

async function initDb() {
  if (environment === 'production') {
    // Use production database implementation on Render
    const productionDb = await import('./production-db');
    db = productionDb.default;
    console.log('Using production database configuration');
  } else {
    // Use development database implementation locally
    const realDb = await import('./real-db');
    db = realDb.default;
    console.log('Using development database configuration');
  }
  return db;
}

export const dbPromise = initDb();

export { db };
