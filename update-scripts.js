// Update package.json scripts to include database seeding
// This script adds a postinstall hook to seed the admin user after deployment

const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.join(__dirname, 'package.json');

// Read the current package.json
const packageJson = require(packageJsonPath);

// Add the postinstall script if it doesn't exist
if (!packageJson.scripts.postinstall) {
  packageJson.scripts.postinstall = 'node seed-admin.js';
  
  // Add a seed script for manual seeding
  packageJson.scripts.seed = 'node seed-admin.js';
  
  // Write the updated package.json
  fs.writeFileSync(
    packageJsonPath, 
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('Added postinstall script to package.json');
} else {
  console.log('postinstall script already exists in package.json');
}
