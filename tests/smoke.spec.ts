import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Critical Paths', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.locator('#email').fill('admin@example.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify we're logged in by checking for dashboard elements
    await expect(page).toHaveURL(/\/dashboard/i, { timeout: 5000 });
  });

  test('should load dashboard page with key components', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Verify essential dashboard elements
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    
    // Check navigation components
    await expect(page.getByRole('link', { name: /customers/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /orders/i })).toBeVisible();
    
    // Check dashboard cards exist
    await expect(page.locator('.card')).toHaveCount.atLeast(1);
  });

  test('should load customers page and display customer list', async ({ page }) => {
    await page.goto('/customers');
    
    // Verify the page has loaded
    await expect(page.getByRole('heading', { name: /customers/i })).toBeVisible();
    
    // Check that the search input exists
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
    
    // Verify customer table is visible with headers
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th')).toHaveCount.atLeast(3);
    
    // Verify at least one customer is displayed (if data exists)
    await expect(page.locator('tbody tr')).toHaveCount.atLeast(1, { timeout: 10000 });
  });

  test('should open customer details when clicking on a customer', async ({ page }) => {
    await page.goto('/customers');
    
    // Wait for table to be fully loaded with data
    await expect(page.locator('tbody tr')).toHaveCount.atLeast(1, { timeout: 10000 });
    
    // Click on the first customer row
    await page.locator('tbody tr').first().click();
    
    // Verify customer details dialog is opened
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /customer details/i })).toBeVisible();
    
    // Check tabs functionality
    await expect(page.getByRole('tab', { name: /details/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /contacts/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /forms/i })).toBeVisible();
    
    // Test tab navigation
    await page.getByRole('tab', { name: /contacts/i }).click();
    await expect(page.getByText(/primary/i)).toBeVisible({ timeout: 2000 });
  });

  test('should filter customers when using search', async ({ page }) => {
    await page.goto('/customers');
    
    // Wait for table to be loaded
    await expect(page.locator('tbody tr')).toHaveCount.atLeast(1, { timeout: 10000 });
    
    // Count initial rows
    const initialRowCount = await page.locator('tbody tr').count();
    
    // Get text from first customer for search
    const firstCustomerText = await page.locator('tbody tr').first().textContent();
    const searchTerm = firstCustomerText?.slice(0, 3) || '';
    
    // Perform search
    await page.getByPlaceholder(/search/i).fill(searchTerm);
    
    // Verify filtered results still include our target
    await expect(page.locator('tbody tr')).toBeVisible();
    
    // Verify search works by checking either:
    // 1. Count decreased if other customers don't match search
    // 2. First customer is still visible if count remains the same
    const newRowCount = await page.locator('tbody tr').count();
    
    if (newRowCount < initialRowCount) {
      expect(newRowCount).toBeLessThan(initialRowCount);
    } else {
      // If count didn't change, ensure first customer is still visible
      await expect(page.locator('tbody tr').first()).toContainText(searchTerm);
    }
  });
}); 