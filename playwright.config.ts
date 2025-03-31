import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current file's directory path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  
  globalSetup: path.join(__dirname, 'tests/setup/global-setup.ts'),
  
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:8080',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'cd server && npm run start:dev',
      url: 'http://localhost:3000/api',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
}); 