# MSC Wound Care Admin Portal - Backend

This is the backend service for the MSC Wound Care Admin Portal, built with NestJS and TypeScript.

## Project Structure

```
server/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── aws.config.ts
│   ├── modules/               # Feature modules
│   │   ├── auth/             # Authentication module
│   │   ├── users/            # User management
│   │   ├── customers/        # Customer management
│   │   ├── products/         # Product management
│   │   ├── forms/            # Form management
│   │   ├── orders/           # Order management
│   │   └── common/           # Shared module
│   ├── prisma/               # Prisma schema and migrations
│   │   └── schema.prisma
│   ├── common/               # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── types/                # TypeScript type definitions
│   ├── app.module.ts         # Root module
│   └── main.ts               # Application entry point
├── test/                     # Test files
├── .env                      # Environment variables
├── .env.example             # Example environment variables
├── package.json             # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── Dockerfile              # Container configuration
```

## Container Configuration

The backend service is containerized using Docker. The container configuration is defined in `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Container Environment Variables

Required environment variables for the container:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRATION` - JWT token expiration time
- `AZURE_STORAGE_CONNECTION_STRING` - Azure Storage connection string
- `AZURE_STORAGE_CONTAINER` - Azure Storage container name
- `SENDGRID_API_KEY` - SendGrid API key
- `REDIS_URL` - Redis connection string
- `FRONTEND_URL` - Frontend application URL (for CORS)

### Building and Running the Container

```bash
# Build the container
docker build -t msc-wound-care-api .

# Run the container
docker run -p 3000:3000 \
  --env-file .env \
  msc-wound-care-api
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Seed the database with test data:
   ```bash
   npx prisma db seed
   ```
   This will create:
   - Admin user (admin@test.com / admin123)
   - Sales representatives (salesrep1@test.com, salesrep2@test.com / salesrep123)
   - Sample manufacturers
   - Sample products
   - Sample customers
   - Sample orders
   - Sample form templates and submissions

5. Start the development server:
   ```bash
   npm run start:dev
   ```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Development

- `npm run start:dev` - Start development server with hot-reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

## Database Migrations

To create a new migration:
```bash
npx prisma migrate dev --name <migration-name>
```

To apply migrations:
```bash
npx prisma migrate deploy
```

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRATION` - JWT token expiration time
- `AZURE_STORAGE_CONNECTION_STRING` - Azure Storage connection string
- `AZURE_STORAGE_CONTAINER` - Azure Storage container name
- `SENDGRID_API_KEY` - SendGrid API key
- `REDIS_URL` - Redis connection string
- `FRONTEND_URL` - Frontend application URL (for CORS)

## Project Progress

### Completed Features ✅

#### Authentication Module
- [x] JWT Strategy implementation
- [x] JWT Auth Guard
- [x] Login endpoint
- [x] Token refresh endpoint
- [x] Role-based authentication

#### Users Module
- [x] User entity with role-based access
- [x] Sales Representative entity
- [x] User CRUD operations
- [x] Sales Rep management
- [x] Password hashing and validation
- [x] DTOs for user operations
- [x] Swagger documentation

#### Products Module
- [x] Product entity with manufacturer relationship
- [x] Product CRUD operations
- [x] Price history tracking
- [x] Manufacturer-specific product queries
- [x] DTOs for product operations
- [x] Swagger documentation
- [x] Comprehensive test coverage
- [x] Role-based access control

#### Customers Module
- [x] Customer entity with contact relationships
- [x] Customer CRUD operations
- [x] Contact management
- [x] DTOs for customer operations
- [x] Swagger documentation
- [x] Test coverage
- [x] Role-based access control

#### Forms Module
- [x] Form template entity and DTOs
- [x] Form submission handling
- [x] DocuSeal API integration
- [x] PDF processing capabilities
- [x] Role-based access control
- [x] Swagger documentation
- [x] Error handling and logging
- [x] Form status management
- [x] PDF generation and download

#### Orders Module
- [x] Order entity with customer and sales rep relationships
- [x] Order item entity with product relationships
- [x] Order CRUD operations
- [x] Order status management with timestamps
- [x] Unique order number generation
- [x] Role-based access control
- [x] Swagger documentation
- [x] Error handling and logging
- [x] Transaction support for data consistency
- [x] Validation and business rules
- [x] Comprehensive unit tests
- [x] Controller tests
- [x] E2E tests with authentication
- [x] Test coverage for all endpoints
- [x] Mock data and fixtures
- [x] Error scenario testing

### In Progress 🚧

#### Database Setup
- [x] Initial database schema
- [x] Database migrations
- [x] Seed data for development
- [x] Database backup strategy
- [x] Database indexes for optimization

#### Additional Modules
- [x] Orders Module
  - [x] Order management
  - [x] Order status tracking
  - [ ] Invoice generation
  - [ ] Payment integration

#### Common Module
- [x] Error handling
- [x] Logging
- [x] Validation pipes
- [x] Response interceptors
- [ ] Rate limiting
- [ ] Caching strategy

### Pending ⏳

#### Testing
- [x] Unit tests for Products module
- [x] Integration tests for Products module
- [x] Unit tests for Customers module
- [x] Integration tests for Customers module
- [x] Unit tests for Forms module
- [x] Integration tests for Forms module
- [x] E2E tests for Forms module
- [x] Unit tests for Orders module
- [x] Controller tests for Orders module
- [x] E2E tests for Orders module
- [ ] Performance testing
- [ ] Security testing

#### Documentation
- [x] API documentation for Products module
- [x] API documentation for Customers module
- [x] API documentation for Forms module
- [x] Development guidelines
- [x] Deployment guide
- [ ] API versioning strategy
- [ ] Database schema documentation

#### Infrastructure
- [x] CI/CD pipeline setup
- [x] Docker containerization
- [ ] Azure Container Apps deployment
- [ ] Monitoring setup (Azure Monitor + Application Insights)
- [ ] Log aggregation (Azure Log Analytics)
- [x] Backup and recovery procedures

## Next Steps

1. Orders Module Development
   - ~~Design order and order item entities~~
   - ~~Implement order management endpoints~~
   - ~~Add order status tracking~~
   - [ ] Invoice generation
   - [ ] Payment integration

2. Database Improvements
   - ~~Create comprehensive seed data~~
   - ~~Implement database backup strategy~~
   - ~~Add database indexes for optimization~~
   - [ ] Set up database monitoring

3. Testing Infrastructure
   - Set up E2E testing environment
   - Implement performance testing
   - Add security testing suite
   - Configure test coverage reporting

4. Documentation
   - ~~Create detailed development guidelines~~
   - ~~Document deployment procedures~~
   - [ ] Add API versioning documentation
   - [ ] Create database schema documentation

5. Infrastructure Setup
   - ~~Configure CI/CD pipeline~~
   - ~~Set up Docker containers~~
   - [ ] Deploy to Azure Container Apps
   - [ ] Configure Azure monitoring
   - [ ] Set up Azure logging

6. Security Enhancements
   - Implement rate limiting
   - Add request validation
   - Set up security headers
   - Configure CORS policies

7. Performance Optimization
   - Implement caching strategy
   - Optimize database queries
   - Add response compression
   - Configure CDN integration 

## CI/CD Configuration

The project uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline includes:

### Continuous Integration
- Automated testing (unit, integration, and e2e)
- Code linting
- Build verification
- Database migration testing

### Continuous Deployment
- Automated deployment to staging (main branch)
- Automated deployment to production (release branches)
- Docker containerization
- Azure Container Apps deployment
- Slack notifications for deployment status

### Required Secrets
The following secrets need to be configured in GitHub:
- `AZURE_CREDENTIALS` - Azure service principal credentials (JSON)
- `ACR_LOGIN_SERVER` - Azure Container Registry login server
- `ACR_USERNAME` - Azure Container Registry username
- `ACR_PASSWORD` - Azure Container Registry password
- `AZURE_RESOURCE_GROUP` - Azure resource group name
- `AZURE_CONTAINER_APP_NAME` - Azure Container App name
- `AZURE_CONTAINER_APP_ENV` - Azure Container App environment name
- `SLACK_WEBHOOK_URL` - Slack webhook URL for notifications

### Azure Infrastructure Setup

1. Create an Azure Resource Group:
   ```bash
   az group create --name msc-wound-care --location eastus
   ```

2. Create an Azure Container Registry:
   ```bash
   az acr create --resource-group msc-wound-care --name mscwoundcare --sku Basic
   ```

3. Create an Azure Container App environment:
   ```bash
   az containerapp env create --name msc-env --resource-group msc-wound-care
   ```

4. Create an Azure Container App:
   ```bash
   az containerapp create \
     --name msc-api \
     --resource-group msc-wound-care \
     --environment msc-env \
     --registry-server mscwoundcare.azurecr.io \
     --registry-username $ACR_USERNAME \
     --registry-password $ACR_PASSWORD \
     --target-port 3000 \
     --env-vars \
       DATABASE_URL=$DATABASE_URL \
       JWT_SECRET=$JWT_SECRET \
       JWT_EXPIRATION=$JWT_EXPIRATION \
       AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING \
       AZURE_STORAGE_CONTAINER=$AZURE_STORAGE_CONTAINER \
       SENDGRID_API_KEY=$SENDGRID_API_KEY \
       REDIS_URL=$REDIS_URL \
       FRONTEND_URL=$FRONTEND_URL
   ```

5. Create a service principal for GitHub Actions:
   ```bash
   az ad sp create-for-rbac --name "msc-wound-care-github" --role contributor \
     --scopes /subscriptions/<subscription-id>/resourceGroups/msc-wound-care \
     --sdk-auth
   ```

6. Enable Azure Container Registry admin access:
   ```bash
   az acr update -n mscwoundcare --admin-enabled true
   ```

7. Get ACR credentials:
   ```bash
   az acr credential show --name mscwoundcare
   ```

### Deployment Process
1. Push to `develop` branch:
   - Triggers CI pipeline
   - Runs tests and linting
   - Builds application

2. Push to `main` branch:
   - Triggers CI pipeline
   - Deploys to staging environment
   - Sends notification to Slack

3. Create release branch:
   - Triggers CI pipeline
   - Deploys to production environment
   - Sends notification to Slack

### Local Development
To test the CI/CD pipeline locally:

```bash
# Build Docker image
docker build -t msc-wound-care .

# Run container with environment variables
docker run -p 3000:3000 \
  --env-file .env \
  msc-wound-care
```

### Monitoring and Logging
The application uses Azure Monitor and Application Insights for monitoring and logging:

1. Enable Application Insights:
   ```bash
   az monitor app-insights component create \
     --app msc-api \
     --location eastus \
     --resource-group msc-wound-care
   ```

2. Configure logging:
   ```bash
   az containerapp update \
     --name msc-api \
     --resource-group msc-wound-care \
     --logs-destination application-insights \
     --logs-workspace-id <workspace-id>
   ``` 