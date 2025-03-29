// Convert seed-admin.js to CommonJS format
// This file seeds an initial admin user for July24Academy

const bcrypt = require('bcryptjs');
const { db } = require('./src/lib/real-db');

async function seedAdminUser() {
  try {
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
    const adminUser = await db.createUser({
      name: 'Admin User',
      email: 'admin@july24academy.com',
      password: hashedPassword,
      created_at: new Date().toISOString()
    });
    
    console.log('Admin user created successfully:', adminUser.id);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    // Close the database connection
    db.close();
  }
}

// Run the seed function
seedAdminUser();
