import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '../../../utils/test-utils';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import SubmissionsPage from '../../../pages/SubmissionsPage';

// This test uses the real API endpoints if VITE_USE_REAL_API is true
// Otherwise it uses MSW to mock the responses
const USE_REAL_API = process.env.VITE_USE_REAL_API === 'true';

const mockSubmissions = [
  {
    id: '1',
    templateId: 'onboarding-1',
    userId: 'user-1',
    data: { name: 'Test Patient', condition: 'Wound', date: '2025-03-30' },
    status: 'submitted',
    submittedAt: '2025-03-30T10:00:00Z',
  },
  {
    id: '2',
    templateId: 'insurance-1',
    userId: 'user-1',
    data: { provider: 'TestInsurance', policy: '12345-ABC' },
    status: 'processing',
    submittedAt: '2025-03-29T14:30:00Z',
  }
];

// Only set up mocks if we're not using the real API
const server = !USE_REAL_API
  ? setupServer(
      rest.get('http://localhost:3000/forms/submissions', (req, res, ctx) => {
        return res(ctx.json(mockSubmissions));
      }),
      rest.delete('http://localhost:3000/forms/submissions/:id', (req, res, ctx) => {
        const { id } = req.params;
        return res(ctx.json({ id, deleted: true }));
      })
    )
  : null;

describe('Form Submissions Integration', () => {
  // Set up and tear down the MSW server if we're not using the real API
  if (!USE_REAL_API && server) {
    beforeAll(() => server.listen());
    afterAll(() => server.close());
  }

  // Mock localStorage for auth token
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'fake-jwt-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true
    });
  });

  it('displays form submissions', async () => {
    render(<SubmissionsPage />);
    
    // Wait for submissions to load
    await waitFor(() => {
      expect(screen.getByText(/Test Patient/i)).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Verify submissions are displayed
    expect(screen.getByText(/Test Patient/i)).toBeInTheDocument();
    expect(screen.getByText(/TestInsurance/i)).toBeInTheDocument();
    
    // Verify status badges
    expect(screen.getByText(/submitted/i)).toBeInTheDocument();
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
  });

  it('allows filtering submissions', async () => {
    render(<SubmissionsPage />);
    
    // Wait for submissions to load
    await waitFor(() => {
      expect(screen.getByText(/Test Patient/i)).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Filter by status
    const statusFilter = screen.getByLabelText(/status/i);
    await userEvent.selectOptions(statusFilter, 'submitted');
    
    // Verify filtering works
    await waitFor(() => {
      expect(screen.getByText(/Test Patient/i)).toBeInTheDocument();
      expect(screen.queryByText(/TestInsurance/i)).not.toBeInTheDocument();
    });
  });

  it('allows deleting a submission', async () => {
    render(<SubmissionsPage />);
    
    // Wait for submissions to load
    await waitFor(() => {
      expect(screen.getByText(/Test Patient/i)).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Find and click delete button for the first submission
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await userEvent.click(deleteButtons[0]);
    
    // Confirm deletion in the modal
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);
    
    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/successfully deleted/i)).toBeInTheDocument();
    });
  });
}); 