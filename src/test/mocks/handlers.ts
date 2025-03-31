// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

// Define your mock API handlers here
// These will intercept requests made during tests and return mock responses

export const handlers = [
  // Example handler for forms API
  http.get('/api/forms', () => {
    return HttpResponse.json([
      { id: 1, name: 'Form 1' },
      { id: 2, name: 'Form 2' },
    ])
  }),

  // Example handler for Docuseal API
  http.get('/api/docuseal/*', () => {
    return HttpResponse.json({ success: true })
  }),

  // Example handler for customers API
  http.get('/api/customers', () => {
    return HttpResponse.json([
      { id: 1, name: 'Customer 1' },
      { id: 2, name: 'Customer 2' },
    ])
  }),

  // Add more handlers as needed based on your API endpoints
];
