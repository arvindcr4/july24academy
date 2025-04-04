// Environment-aware database configuration
// This file selects the appropriate database implementation based on the environment

const environment = process.env.NODE_ENV || 'development';

const dbConnections = new Map();

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

export async function getCourseDb(courseId) {
  if (!courseId) {
    return db || await dbPromise;
  }
  
  const cacheKey = `course_${courseId}`;
  if (dbConnections.has(cacheKey)) {
    return dbConnections.get(cacheKey);
  }
  
  let courseDb;
  if (environment === 'production') {
    // Use production database implementation on Render
    const productionDb = await import('./production-db');
    courseDb = await productionDb.initializeDatabase(courseId);
    console.log(`Using production database configuration for course ${courseId}`);
  } else {
    // Use development database implementation locally
    const realDb = await import('./real-db');
    courseDb = await realDb.initializeDatabase(courseId);
    console.log(`Using development database configuration for course ${courseId}`);
  }
  
  dbConnections.set(cacheKey, courseDb);
  
  return courseDb;
}

export const dbPromise = initDb();

export { db };
