# Testing Guide

This document outlines how to run tests for both the frontend and backend components of the MSC Wound Care Admin Portal.

## Test Types

The project uses the following types of tests:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test how components work together
3. **End-to-End (E2E) Tests**: Test the full application workflow

## Running Backend Tests

### Unit Tests

Backend unit tests are written using Jest and test individual services, controllers, and modules.

```bash
# Run backend unit tests
npm run test:backend

# Run with coverage report
npm run test:backend:cov
```

### Backend E2E Tests

These test the API endpoints with an actual database.

```bash
cd server
npm run test:e2e
```

## Running Frontend Tests

### Unit Tests

Frontend components are tested with Vitest and React Testing Library.

```bash
# Run all frontend unit tests
npm run test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Frontend Integration Tests

These test frontend components with real API calls.

```bash
# Run using real API endpoints
npm run test:integration
```

## End-to-End Tests

E2E tests use Playwright to test the full application workflow, including both frontend and backend.

```bash
# Install Playwright browsers if not already installed
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests with debugging
npm run test:e2e:debug

# Run E2E tests with seeded test data
npm run test:e2e:seed
```

## Running All Tests

To run all tests at once:

Windows:
```powershell
scripts/run-tests.ps1
```

Linux/Mac:
```bash
bash scripts/run-tests.sh
```

## Test Coverage

Coverage reports are generated in these locations:

- Backend: `server/coverage`
- Frontend: `coverage`

## Test Data

For E2E and integration tests, you can seed the database with test data:

```bash
# Seed test data
npm run test:e2e:seed
```

This will create:
- Test users (admin and customer)
- Test customers
- Test products
- Test manufacturers

To clean up test data:
```bash
curl -X DELETE http://localhost:3000/test/cleanup
```

## Continuous Integration

Tests are run automatically on CI for:
- Pull requests to `develop` or `main`
- Pushes to `develop` or `main`

The CI workflow will fail if any test fails or if coverage drops below thresholds. 