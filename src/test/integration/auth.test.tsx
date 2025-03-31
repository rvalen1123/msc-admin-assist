import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../../pages/LoginPage';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// This test uses the real API endpoints if VITE_USE_REAL_API is true
// Otherwise it uses MSW to mock the responses
const USE_REAL_API = process.env.VITE_USE_REAL_API === 'true';

// Only set up mocks if we're not using the real API
const server = !USE_REAL_API
  ? setupServer(
      rest.post('http://localhost:3000/auth/login', (req, res, ctx) => {
        return res(
          ctx.json({
            token: 'fake-jwt-token',
            user: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              role: 'admin',
            },
          })
        );
      })
    )
  : null;

describe('Authentication Integration', () => {
  // Set up and tear down the MSW server if we're not using the real API
  if (!USE_REAL_API && server) {
    beforeAll(() => server.listen());
    afterAll(() => server.close());
  }

  it('allows users to log in', async () => {
    render(<LoginPage />);
    
    // Fill out the login form
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'test@example.com'
    );
    await userEvent.type(
      screen.getByLabelText(/password/i),
      'password123'
    );
    
    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Should redirect or show success (depends on implementation)
    await waitFor(() => {
      // This expectation will vary based on your actual implementation
      // For example, you might check for a success message, or that the user is redirected
      expect(localStorage.getItem('auth_token')).toBeTruthy();
    });
  });
}); 