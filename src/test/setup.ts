// src/test/setup.ts
import '@testing-library/jest-dom';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Only import and use mock server if we're not using the real API
const USE_REAL_API = process.env.VITE_USE_REAL_API === 'true';

if (!USE_REAL_API) {
  import('./mocks/server').then(({ server }) => {
    // Establish API mocking before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    
    // Reset any request handlers that we may add during the tests,
    // so they don't affect other tests
    afterEach(() => {
      server.resetHandlers();
    });
    
    // Clean up after the tests are finished
    afterAll(() => server.close());
  });
}

// Clean up React Testing Library after each test
afterEach(() => {
  cleanup();
}); 