# MSC Admin Assistant Testing Suite

This directory contains automated tests for verifying the application is ready for production deployment.

## Test Categories

### 1. Smoke Tests (`smoke.spec.ts`)

Critical path tests that verify basic functionality works:
- Dashboard page loads with key components
- Customers page loads and displays customer list
- Customer details can be opened and viewed
- Customer search functionality works

### 2. API Connection Tests (`api-connection.spec.ts`)

Tests that verify the application can connect to the real backend:
- Customer data retrieval from API
- Error handling when API encounters issues
- Token refresh mechanism when tokens expire
- Dashboard statistics loading from API

### 3. Authentication Flow Tests (`auth-flows.spec.ts`)

Tests that verify authentication works correctly:
- Login form validation
- Error handling with invalid credentials
- Successful login with valid credentials
- Session maintenance across page navigation
- Logout functionality
- Automatic token refresh when tokens expire

## Running Tests

### For Production Verification

To verify the application is ready for production deployment, run:

```bash
# Run all critical tests against the real API
npm run test:prod
```

This will execute all tests in sequence and provide a summary of results.

### For Development Testing

During development, you can run specific test categories:

```bash
# Run smoke tests only
npx playwright test tests/smoke.spec.ts

# Run API tests only
npx playwright test tests/api-connection.spec.ts

# Run auth tests only
npx playwright test tests/auth-flows.spec.ts

# Run with UI mode for debugging
npx playwright test --ui
```

## Test Environment Setup

These tests require:

1. The application to be built and running locally:
   ```bash
   npm run build
   npm run preview
   ```

2. A running backend API:
   ```bash
   cd server
   npm run start
   ```

3. Test credentials as defined in the tests (admin@example.com/password123)

## Troubleshooting Common Issues

- **API Connection Failures**: Verify that the backend is running and accessible at the URL defined in `.env.production`
- **Authentication Failures**: Check that test credentials are properly set up in the test environment
- **Timeout Errors**: May indicate slower network or API responses; adjust timeout values if needed
- **Test Runner Script Issues**: If encountering errors with the test runner, ensure that the script file extension (.cjs) is correct for CommonJS in a project with "type": "module" set in package.json

## Test Runner Implementation

The test runner script (`simple-test-runner.cjs`) is implemented using CommonJS since the main project uses ES modules. 
It sequentially runs each test suite and reports on their success or failure.

To modify the test runner:
1. Find the script at `tests/setup/simple-test-runner.cjs`
2. Edit the `testSuites` array to add or remove test suites
3. Run with `node tests/setup/simple-test-runner.cjs` or `npm run test:prod`

## Extending Tests

When adding new features, consider:
1. Adding smoke tests for critical user paths
2. Adding API tests for new backend endpoints
3. Updating authentication tests if auth flow changes 