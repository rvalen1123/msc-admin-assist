# MSC Wound Care Admin Portal - Backend

[![CI](https://github.com/[your-org]/msc-admin-assist/actions/workflows/ci.yml/badge.svg)](https://github.com/[your-org]/msc-admin-assist/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/[your-org]/msc-admin-assist/branch/main/graph/badge.svg)](https://codecov.io/gh/[your-org]/msc-admin-assist)
[![Statements](https://img.shields.io/badge/statements-92.26%25-brightgreen.svg?style=flat)](https://codecov.io/gh/[your-org]/msc-admin-assist)
[![Branches](https://img.shields.io/badge/branches-60%25-yellow.svg?style=flat)](https://codecov.io/gh/[your-org]/msc-admin-assist)
[![Functions](https://img.shields.io/badge/functions-95%25-brightgreen.svg?style=flat)](https://codecov.io/gh/[your-org]/msc-admin-assist)
[![Lines](https://img.shields.io/badge/lines-91.89%25-brightgreen.svg?style=flat)](https://codecov.io/gh/[your-org]/msc-admin-assist)

This is the backend service for the MSC Wound Care Admin Portal, built with NestJS and TypeScript.

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
   npx prisma migrate deploy
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Testing

Run unit tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

Run all tests with coverage:
```bash
npm run test:ci
```

Generate coverage badges:
```bash
npm run test:badge
```

### Test Coverage Configuration

The project uses Jest for testing and has a comprehensive coverage configuration:

- **Coverage Thresholds**: We maintain minimum coverage thresholds for statements, branches, functions, and lines of code. These thresholds are module-specific to ensure appropriate coverage for each part of the application.

- **Coverage Reports**: The following coverage reports are generated:
  - JSON summary for badges and metrics
  - LCOV for integration with external tools
  - HTML reports for local viewing
  - Clover XML format for CI integration

- **CI Integration**: Coverage reports are automatically uploaded to Codecov on every CI run, allowing for historical tracking and visualization of coverage trends.

- **Coverage Badges**: Coverage badges are automatically generated and updated in the README to provide visibility into the current test coverage.

### Adding Tests

When adding new features, follow these guidelines for test coverage:

1. **Unit Tests**: Each service and controller should have corresponding unit tests.
2. **E2E Tests**: Critical API endpoints should have E2E tests.
3. **Coverage Goals**: 
   - Services: 90% statement coverage, 70% branch coverage
   - Controllers: 90% statement coverage
   - Infrastructure code: At least 60% coverage

## Development

- `npm run start:dev` - Start development server with hot-reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Lint code

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