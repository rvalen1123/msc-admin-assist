import { test, expect } from '@playwright/test';

test.describe('API Connection Tests', () => {
  // Set a longer timeout for API calls
  test.setTimeout(30000);

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.locator('#email').fill('admin@example.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify we're logged in by checking for dashboard elements
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 5000 });
  });

  test('should successfully retrieve customer data from API', async ({ page }) => {
    await page.goto('/customers');
    
    // Intercept API requests to customers endpoint
    const customerRequestPromise = page.waitForRequest(request => 
      request.url().includes('/api/customers') && 
      request.method() === 'GET'
    );
    
    // Intercept API response from customers endpoint
    const customerResponsePromise = page.waitForResponse(response => 
      response.url().includes('/api/customers') && 
      response.request().method() === 'GET'
    );
    
    // Wait for the page to load API data
    await expect(page.locator('tbody tr')).toBeVisible({ timeout: 10000 });
    
    // Verify that the API request was made
    const customerRequest = await customerRequestPromise;
    expect(customerRequest).toBeTruthy();
    
    // Verify that the API response was successful
    const customerResponse = await customerResponsePromise;
    expect(customerResponse.status()).toBe(200);
    
    // Check that the response contains data
    const responseData = await customerResponse.json();
    expect(responseData).toBeTruthy();
    expect(Array.isArray(responseData)).toBe(true);
    
    // Verify the data was rendered on the page
    const customerCount = await page.locator('tbody tr').count();
    expect(responseData.length).toBeGreaterThanOrEqual(customerCount);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept and mock a failed API response
    await page.route('**/api/customers', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    await page.goto('/customers');
    
    // Verify that error state is shown
    await expect(page.getByText(/error loading customers/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/internal server error/i)).toBeVisible();
  });

  test('should refresh token when API returns 401', async ({ page }) => {
    // First, spy on the API request/response for the auth refresh endpoint
    const refreshPromise = page.waitForRequest(request => 
      request.url().includes('/api/auth/refresh')
    );
    
    // Mock a 401 response for the first customers request
    let requestCount = 0;
    await page.route('**/api/customers', route => {
      if (requestCount === 0) {
        // First request returns 401
        requestCount++;
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Token expired' })
        });
      } else {
        // Second request (after token refresh) continues to actual API
        route.continue();
      }
    });
    
    // Mock a successful token refresh
    await page.route('**/api/auth/refresh', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          tokens: {
            accessToken: 'new-token-12345',
            refreshToken: 'new-refresh-token-12345',
            expiresIn: 3600
          }
        })
      });
    });
    
    await page.goto('/customers');
    
    // Wait for refresh request to occur
    const refreshRequest = await refreshPromise;
    expect(refreshRequest).toBeTruthy();
    
    // Verify that the page loads successfully after token refresh
    await expect(page.locator('tbody tr')).toBeVisible({ timeout: 10000 });
  });

  test('should load dashboard with stats from API', async ({ page }) => {
    // Intercept API requests to dashboard stats endpoint
    const statsRequestPromise = page.waitForRequest(request => 
      request.url().includes('/api/stats') || 
      request.url().includes('/api/dashboard')
    );
    
    await page.goto('/dashboard');
    
    // Verify that the API request was made
    const statsRequest = await statsRequestPromise;
    expect(statsRequest).toBeTruthy();
    
    // Check if dashboard cards are populated with data
    await expect(page.locator('.card')).toHaveCount.atLeast(1);
    
    // Verify numbers/stats are displayed (any content with digits)
    await expect(page.locator('.card:has-text(/\\d+/)')).toBeVisible();
  });
}); 