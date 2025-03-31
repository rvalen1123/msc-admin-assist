# MSC Admin Portal Deployment Guide

This guide outlines the process for deploying the MSC Admin Portal application to production environments.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Azure CLI (for Azure deployment)
- Azure account with appropriate permissions
- Azure SQL Database instance

## Local Production Build

To build the application for production locally:

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd msc-admin-assist
   ```

2. Install dependencies:
   ```bash
   npm install
   cd server && npm install
   cd ..
   ```

3. Create production environment files:
   - Copy `.env.production.example` to `.env.production` in server directory
   - Update the environment variables with your production values

4. Build the application:
   ```bash
   npm run build:production
   ```
   
   This script:
   - Builds the React frontend
   - Builds the NestJS backend
   - Generates the Prisma client
   - Copies the frontend build to the server's public directory
   - Creates a production-ready package in the `server/dist` directory

5. Start the production server locally:
   ```bash
   npm run start:production:install
   ```

## Azure Deployment

To deploy the application to Azure:

1. Ensure you have the Azure CLI installed and you're logged in:
   ```bash
   az login
   ```

2. Set the environment variable for SQL password (or update the script):
   ```bash
   export AZURE_SQL_ADMIN_PASSWORD=your-secure-password
   ```

3. Run the Azure deployment script:
   ```bash
   npm run deploy:azure
   ```

   This script:
   - Creates or ensures existence of Azure resource group
   - Sets up Azure SQL Server and database
   - Creates App Service Plan and App Service
   - Configures application settings
   - Packages and deploys the application
   - Restarts the App Service

4. After deployment, your application will be available at:
   ```
   https://<app-service-name>.azurewebsites.net
   ```

## Database Migrations

For production database migrations:

1. Update your Prisma schema in `/server/prisma/schema.prisma`
2. Generate a migration:
   ```bash
   cd server
   npm run prisma:migrate
   ```
3. Apply the migration to production:
   ```bash
   cd server
   AZURE_SQL_CONNECTION_STRING=your-production-connection-string npm run prisma:migrate
   ```

## Environment Variables

Set these environment variables in your Azure App Service configuration:

### Core Settings
- `NODE_ENV` - Set to "production"
- `PORT` - The port for the application (default: 8080 in Azure)
- `AZURE_SQL_CONNECTION_STRING` - Connection string to Azure SQL Database
- `AZURE_SQL_SHADOW_CONNECTION_STRING` - Optional shadow database connection string

### Authentication
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time (e.g., "1d")
- `JWT_REFRESH_EXPIRES_IN` - JWT refresh token expiration time (e.g., "7d")

### Security
- `RATE_LIMIT_TTL` - Rate limiting period in seconds
- `RATE_LIMIT_MAX` - Maximum requests per TTL period

### Optional Services
- `SENDGRID_API_KEY` - API key for SendGrid email service
- `AWS_S3_BUCKET` - S3 bucket name if using AWS S3
- `AWS_S3_REGION` - AWS region for S3
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key

## Maintenance

### Monitoring
- Monitor application logs in Azure App Service
- Set up Application Insights for deeper monitoring

### Backup
- Regularly backup your Azure SQL Database
- Enable automatic backups in Azure

### Updating
- Pull the latest changes from the repository
- Run the deployment script again to update the application

## Troubleshooting

### Common Issues
1. Database connection failures:
   - Check connection strings
   - Verify IP whitelisting in Azure SQL firewall
   - Check that the SQL user has appropriate permissions

2. Application won't start:
   - Check logs in Azure App Service
   - Verify all required environment variables are set
   - Check Node.js version compatibility

3. Frontend not loading properly:
   - Clear browser cache
   - Check console for JavaScript errors
   - Verify static assets are being served correctly

### Getting Help
- Review the error logs in Azure App Service
- Check the application source code
- Contact the development team
