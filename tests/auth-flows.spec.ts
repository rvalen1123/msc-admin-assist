import { test, expect } from '@playwright/test';

// Authentication Flows tests
test('should display login form with all elements', async ({ page }) => {
  await page.goto('/login');
  
  // Verify all login form elements are visible
  await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});

test('should show validation errors for empty login fields', async ({ page }) => {
  await page.goto('/login');
  
  // Click login without entering credentials
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Verify validation messages appear
  await expect(page.getByText(/email is required/i)).toBeVisible({ timeout: 2000 });
  await expect(page.getByText(/password is required/i)).toBeVisible({ timeout: 2000 });
});

test('should show error with invalid credentials', async ({ page }) => {
  await page.goto('/login');
  
  // Fill in form with invalid credentials
  await page.locator('#email').fill('invalid@example.com');
  await page.locator('#password').fill('wrongpassword');
  
  // Submit the form
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Check for error message
  await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 5000 });
});

test('should redirect to the original URL after login if redirected to login', async ({ page }) => {
  // Try to access a protected page directly
  await page.goto('/customers');
  
  // Should be redirected to login
  await expect(page).toHaveURL(/\/login/i);
  
  // Login with valid credentials
  await page.locator('#email').fill('admin@example.com');
  await page.locator('#password').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Should be redirected back to the original page
  await expect(page).toHaveURL(/\/customers/i, { timeout: 5000 });
});

test('should login successfully with valid credentials', async ({ page }) => {
  await page.goto('/login');
  
  // Fill with valid test credentials
  await page.locator('#email').fill('admin@example.com');
  await page.locator('#password').fill('password123');
  
  // Intercept token storage - watch for localStorage setting
  await page.evaluate(() => {
    const originalSetItem = localStorage.setItem;
    window.tokensStored = false;
    
    localStorage.setItem = function(key, value) {
      if (key === 'auth_token' || key === 'refresh_token') {
        window.tokensStored = true;
      }
      originalSetItem.call(this, key, value);
    };
  });
  
  // Submit the form
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Check redirected to dashboard
  await expect(page).toHaveURL(/\/dashboard/i, { timeout: 5000 });
  
  // Verify that tokens were stored
  const tokensStored = await page.evaluate(() => window.tokensStored);
  expect(tokensStored).toBe(true);
  
  // Verify user appears logged in (e.g., user menu/avatar is visible)
  await expect(page.locator('header')).toContainText(/admin/i);
});

test('should log out successfully', async ({ page }) => {
  // First login
  await page.goto('/login');
  await page.locator('#email').fill('admin@example.com');
  await page.locator('#password').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Wait for dashboard to load
  await expect(page).toHaveURL(/\/dashboard/i, { timeout: 5000 });
  
  // Find and click the logout button/link (adjust selector based on your UI)
  await page.getByRole('button', { name: /profile|account|user/i }).click();
  await page.getByRole('menuitem', { name: /log out|sign out/i }).click();
  
  // Should be redirected to login page
  await expect(page).toHaveURL(/\/login/i, { timeout: 5000 });
  
  // Try to access protected page to confirm logout
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/i);
});

test('should maintain session across page navigation', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.locator('#email').fill('admin@example.com');
  await page.locator('#password').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Verify login was successful
  await expect(page).toHaveURL(/\/dashboard/i, { timeout: 5000 });
  
  // Navigate to various pages
  await page.getByRole('link', { name: /customers/i }).click();
  await expect(page).toHaveURL(/\/customers/i);
  
  await page.getByRole('link', { name: /orders/i }).click();
  await expect(page).toHaveURL(/\/orders/i);
  
  // Return to dashboard
  await page.getByRole('link', { name: /dashboard/i }).click();
  await expect(page).toHaveURL(/\/dashboard/i);
  
  // Verify still logged in by checking user-specific element
  await expect(page.locator('header')).toContainText(/admin/i);
});

test('should handle expired token refresh', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.locator('#email').fill('admin@example.com');
  await page.locator('#password').fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Verify login was successful
  await expect(page).toHaveURL(/\/dashboard/i, { timeout: 5000 });
  
  // Simulate token expiration by manipulating localStorage
  await page.evaluate(() => {
    // Set token expiry to a past timestamp
    localStorage.setItem('token_expiry', (Date.now() - 60000).toString());
  });
  
  // Watch for refresh token request
  const refreshPromise = page.waitForRequest(request => 
    request.url().includes('/api/auth/refresh')
  );
  
  // Navigate to another page to trigger API calls with expired token
  await page.getByRole('link', { name: /customers/i }).click();
  
  // Verify refresh token request was made
  const refreshRequest = await refreshPromise;
  expect(refreshRequest).toBeTruthy();
  
  // Verify we can still see customer data (token refresh worked)
  await expect(page.locator('tbody tr')).toBeVisible({ timeout: 10000 });
});
