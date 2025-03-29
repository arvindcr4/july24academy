// This file seeds an initial admin user for July24Academy
// Using dynamic import to support ES modules from CommonJS
const bcrypt = require('bcryptjs');

async function seedAdminUser() {
  try {
    console.log('Importing database module...');
    // Dynamically import the ES module
    const { db } = await import('./src/lib/real-db.js');
    
    console.log('Checking for existing admin user...');
    
    // Check if admin user already exists
    const existingAdmin = await db.getUserByEmail('admin@july24academy.com');
    
    if (existingAdmin) {
      console.log('Admin user already exists, skipping creation');
      return;
    }
    
    console.log('Creating admin user...');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123!', salt);
    
    // Create admin user
    const adminUser = await db.createUser(
      'Admin User',
      'admin@july24academy.com',
      hashedPassword
    );
    
    console.log('Admin user created successfully:', adminUser.id);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    // Don't exit with error code to prevent build failure
    console.log('Continuing build process despite admin user creation failure');
  }
}

// Run the seed function
seedAdminUser();
