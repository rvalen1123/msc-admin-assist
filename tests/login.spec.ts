import { test, expect } from '@playwright/test';

test.describe('Login functionality', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    // Check that the form elements are visible
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in the form with invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for error message
    await expect(page.getByText(/invalid email or password/i)).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Use test credentials (would be provided by test environment)
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check that we're redirected to the dashboard
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 5000 });
    
    // Verify that we see dashboard elements
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });
}); 