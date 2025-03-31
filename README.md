# MSC Wound Care Admin Portal

A full-stack application for MSC Wound Care administration, featuring a React frontend and NestJS backend.

## Project Structure

```
.
├── server/                # NestJS backend
│   └── ...                # See server/README.md for details
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and services
│   │   ├── api.ts         # API client with interceptors
│   │   └── services/      # API service functions
│   ├── pages/             # Page components
│   └── types/             # TypeScript type definitions
└── ...                    # Root configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd msc-admin-assist
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd server && npm install
   ```

3. Set up environment variables:
   ```bash
   # For backend
   cp server/.env.example server/.env
   # Edit server/.env with your configuration

   # For frontend
   cp .env.development .env.local
   # Edit .env.local with your configuration
   ```

4. Set up the database:
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Start the development servers:
   ```bash
   # From the project root
   npm run dev:all
   ```

## Development

- `npm run dev` - Start frontend development server
- `npm run dev:backend` - Start backend development server
- `npm run dev:all` - Start both frontend and backend servers
- `npm run build` - Build the frontend
- `npm run build:dev` - Build the frontend for development
- `npm run build:backend` - Build the backend
- `npm run build:all` - Build both frontend and backend
- `npm run lint` - Lint frontend code
- `npm run lint:backend` - Lint backend code
- `npm run lint:all` - Lint both frontend and backend code

## Testing

See [docs/testing.md](docs/testing.md) for detailed testing documentation.

- `npm run test` - Run frontend tests
- `npm run test:coverage` - Run frontend tests with coverage
- `npm run test:backend` - Run backend tests
- `npm run test:backend:cov` - Run backend tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:e2e:seed` - Run end-to-end tests with test data seeding
- `npm run test:all` - Run all tests (frontend and backend)

## Authentication

The application uses JWT for authentication. The authentication flow is:

1. User logs in with email/password through the `/auth/login` endpoint
2. Backend validates credentials and returns a JWT token
3. Frontend stores the token in localStorage
4. JWT token is included in subsequent API requests
5. Protected routes check for valid token before rendering

## API Integration

The frontend communicates with the backend using a set of service functions built on top of Axios:

- `customerService` - Manages customer data
- `productService` - Manages product data
- `formService` - Manages form templates and submissions
- `orderService` - Manages orders and order items

Each service provides methods for CRUD operations and additional business logic.

## Deployment

### Frontend

The frontend is built as a static site and can be deployed to:
- Azure Static Web Apps
- Vercel
- Netlify
- Any static file hosting

### Backend

The backend is containerized with Docker and can be deployed to:
- Azure Container Apps
- AWS ECS
- Google Cloud Run
- Any Kubernetes cluster

See `server/README.md` for detailed backend deployment instructions.

## License

This project is private and confidential. All rights reserved.

## Project Overview

This is a full-stack application consisting of:
- Frontend: React/TypeScript application
- Backend: NestJS/TypeScript API
- Database: PostgreSQL
- Infrastructure: Azure Cloud Services

## Architecture

### Container Architecture
The application is containerized into two main services:

1. Frontend Container (`msc-frontend`)
   - Serves the React application
   - Runs on port 80
   - Environment variables:
     - `REACT_APP_API_URL`
     - `REACT_APP_AUTH_DOMAIN`
     - `REACT_APP_AUTH_CLIENT_ID`

2. Backend Container (`msc-api`)
   - Hosts the NestJS API
   - Runs on port 3000
   - Environment variables:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `JWT_EXPIRATION`
     - `AZURE_STORAGE_CONNECTION_STRING`
     - `AZURE_STORAGE_CONTAINER`
     - `SENDGRID_API_KEY`
     - `REDIS_URL`
     - `FRONTEND_URL`

### Infrastructure Components
- Azure Resource Group: `msc-wound-care`
- Azure Container Registry: `mscwoundcare.azurecr.io`
- Azure Container Apps Environment: `msc-env`
- Azure Container Apps:
  - Frontend: `msc-frontend`
  - Backend: `msc-api`

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
- Docker containerization for both frontend and backend
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

4. Create Azure Container Apps for both frontend and backend:
   ```bash
   # Create backend container app
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

   # Create frontend container app
   az containerapp create \
     --name msc-frontend \
     --resource-group msc-wound-care \
     --environment msc-env \
     --registry-server mscwoundcare.azurecr.io \
     --registry-username $ACR_USERNAME \
     --registry-password $ACR_PASSWORD \
     --target-port 80 \
     --env-vars \
       REACT_APP_API_URL=$API_URL \
       REACT_APP_AUTH_DOMAIN=$AUTH_DOMAIN \
       REACT_APP_AUTH_CLIENT_ID=$AUTH_CLIENT_ID
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
   - Builds both frontend and backend applications

2. Push to `main` branch:
   - Triggers CI pipeline
   - Builds and pushes Docker containers
   - Deploys to staging environment
   - Sends notification to Slack

3. Create release branch:
   - Triggers CI pipeline
   - Deploys to production environment
   - Sends notification to Slack

### Local Development
To test the CI/CD pipeline locally:

```bash
# Build and run backend container
cd server
docker build -t msc-wound-care-api .
docker run -p 3000:3000 --env-file .env msc-wound-care-api

# Build and run frontend container
cd ../client
docker build -t msc-wound-care-frontend .
docker run -p 80:80 --env-file .env msc-wound-care-frontend
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
