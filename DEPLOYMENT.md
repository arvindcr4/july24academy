# July24Academy - Deployment README

## Overview
This document provides instructions for deploying the July24Academy application to Render.com.

## Prerequisites
- A Render.com account
- Git repository access

## Deployment Steps

### 1. Push Changes to GitHub
Ensure all changes are committed and pushed to the GitHub repository:
```
git add .
git commit -m "Implement secure authentication and prepare for Render deployment"
git push
```

### 2. Deploy to Render
1. Log in to your Render.com account
2. Click "New" and select "Blueprint"
3. Connect your GitHub repository
4. Select the repository containing July24Academy
5. Render will automatically detect the `render.yaml` file and configure the services
6. Review the configuration and click "Apply"

### 3. Environment Variables
The following environment variables are configured in the `render.yaml` file:
- `NODE_ENV`: Set to "production"
- `JWT_SECRET`: Automatically generated secure token
- `DB_PATH`: Set to "/var/data/july24academy.db"

### 4. Database
The application uses SQLite with a persistent disk mounted at `/var/data`.

### 5. Monitoring
After deployment, monitor the application logs in the Render dashboard to ensure everything is working correctly.

## Troubleshooting

### Authentication Issues
If users are unable to register or log in:
1. Check the application logs for errors
2. Verify the JWT_SECRET is properly set
3. Ensure the database is accessible and properly initialized

### Database Issues
If database errors occur:
1. Check if the disk is properly mounted
2. Verify the database path is correct
3. Check file permissions for the database file

## Security Notes
- Password hashing is implemented using bcrypt
- JWT tokens are used for authentication
- All authentication routes have been secured
- HTTPS is enforced by Render.com

## Contact
For deployment issues, contact: arvindcr4@gmail.com
