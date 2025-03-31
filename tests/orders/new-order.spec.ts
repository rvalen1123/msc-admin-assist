import { test, expect } from '@playwright/test';

test.describe('Order Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('admin@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/dashboard/i);
  });

  test('should navigate to order page and display order form', async ({ page }) => {
    // Navigate to orders page
    await page.getByRole('link', { name: /orders/i }).click();
    await expect(page).toHaveURL(/orders/i);
    
    // Check that the page has loaded
    await expect(page.getByRole('heading', { name: /orders/i })).toBeVisible();
    
    // Click on create new order button
    await page.getByRole('button', { name: /new order/i }).click();
    
    // Check that the form is displayed
    await expect(page.getByText(/create new order/i)).toBeVisible();
    await expect(page.getByLabel(/customer/i)).toBeVisible();
    await expect(page.getByLabel(/product/i)).toBeVisible();
  });

  test('should create a new order successfully', async ({ page }) => {
    // Navigate to orders page
    await page.getByRole('link', { name: /orders/i }).click();
    
    // Click on create new order button
    await page.getByRole('button', { name: /new order/i }).click();
    
    // Fill out the form
    await page.getByLabel(/customer/i).click();
    await page.getByText(/Select a customer/i).click();
    await page.getByText(/Customer 1/i).click();
    
    // Add a product
    await page.getByLabel(/product/i).click();
    await page.getByText(/Select a product/i).click();
    await page.getByText(/Product 1/i).click();
    
    // Set quantity
    await page.getByLabel(/quantity/i).fill('2');
    
    // Add to order
    await page.getByRole('button', { name: /add to order/i }).click();
    
    // Verify product was added to order
    await expect(page.getByText(/Product 1/i)).toBeVisible();
    await expect(page.getByText(/2 x/i)).toBeVisible();
    
    // Submit the order
    await page.getByRole('button', { name: /submit order/i }).click();
    
    // Verify success message
    await expect(page.getByText(/order created successfully/i)).toBeVisible();
    
    // Verify we're back at the orders list with our new order
    await expect(page).toHaveURL(/orders/i);
    await expect(page.getByText(/pending/i)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Navigate to orders page
    await page.getByRole('link', { name: /orders/i }).click();
    
    // Click on create new order button
    await page.getByRole('button', { name: /new order/i }).click();
    
    // Try to submit without filling anything
    await page.getByRole('button', { name: /submit order/i }).click();
    
    // Verify validation errors
    await expect(page.getByText(/please select a customer/i)).toBeVisible();
    await expect(page.getByText(/please add at least one product/i)).toBeVisible();
  });
}); 