// Simple test runner for production verification
// This runs Playwright tests in sequence and reports results

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define test suites to run
const testSuites = [
  'tests/smoke.spec.ts',
  'tests/api-connection.spec.ts',
  'tests/auth-flows.spec.ts'
];

console.log('🚀 Starting production verification tests...');
console.log('📋 Running with real API and production build');
console.log('-'.repeat(50));

// We'll use Playwright's built-in webserver functionality instead of starting our own servers
// This is defined in playwright.config.ts and will be handled automatically

let passedTests = 0;
let failedTests = 0;

// Run each test suite in sequence
for (const testSuite of testSuites) {
  const suiteName = path.basename(testSuite, '.spec.ts');
  
  console.log(`\n▶️  Running test suite: ${suiteName}`);
  
  try {
    // Use npx to run playwright directly with the production environment variables
    execSync(`npx playwright test ${testSuite}`, { 
      stdio: 'inherit',
      env: {
        ...process.env, 
        NODE_ENV: 'production',
        VITE_USE_REAL_API: 'true'
      }
    });
    
    console.log(`✅ ${suiteName} tests PASSED`);
    passedTests++;
  } catch (error) {
    console.error(`❌ ${suiteName} tests FAILED`);
    failedTests++;
  }
}

// Print summary
console.log('\n' + '='.repeat(50));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Passed test suites: ${passedTests}`);
console.log(`❌ Failed test suites: ${failedTests}`);
console.log(`📈 Success rate: ${Math.round((passedTests / testSuites.length) * 100)}%`);

// Set exit code based on test results
process.exit(failedTests > 0 ? 1 : 0); 