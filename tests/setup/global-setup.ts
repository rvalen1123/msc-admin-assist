import { FullConfig } from '@playwright/test';
import axios from 'axios';

/**
 * This script runs before all tests to set up the test environment.
 * It seeds the database with test data.
 */
async function globalSetup(config: FullConfig) {
  // Only seed data if we're using the real API
  if (process.env.SEED_TEST_DATA !== 'true') {
    console.log('Skipping test data seeding (SEED_TEST_DATA != true)');
    return;
  }

  console.log('Setting up test data...');
  const apiUrl = 'http://localhost:3000';
  
  try {
    // Create test data
    await axios.post(`${apiUrl}/test/seed`, {
      users: [
        {
          email: 'admin@example.com',
          password: 'password123',
          name: 'Admin User',
          role: 'admin',
        },
        {
          email: 'user@example.com',
          password: 'password123',
          name: 'Regular User',
          role: 'customer',
        }
      ],
      customers: [
        {
          firstName: 'Customer',
          lastName: '1',
          email: 'customer1@example.com',
          phone: '555-123-4567',
          address: '123 Main St',
        },
        {
          firstName: 'Customer',
          lastName: '2',
          email: 'customer2@example.com',
          phone: '555-987-6543',
          address: '456 Elm St',
        }
      ],
      products: [
        {
          name: 'Product 1',
          manufacturerId: 'test-manufacturer',
          description: 'Test product 1',
          price: 99.99,
          qCode: 'Q1234',
        },
        {
          name: 'Product 2',
          manufacturerId: 'test-manufacturer',
          description: 'Test product 2',
          price: 149.99,
          qCode: 'Q5678',
        }
      ],
      manufacturers: [
        {
          id: 'test-manufacturer',
          name: 'Test Manufacturer',
        }
      ]
    });
    
    console.log('Test data setup complete!');
  } catch (error) {
    console.error('Failed to seed test data:', error);
    throw error; // Fail the tests if we can't set up test data
  }
}

export default globalSetup; 