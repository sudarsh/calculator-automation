import { defineConfig, devices } from '@playwright/test';

/**
 * Base URL is overridable so the same suite can run against the live
 * GitHub Pages deployment (default) or a local copy in an air-gapped CI.
 *   BASE_URL=http://localhost:8080 npx playwright test
 */
const BASE_URL =
  process.env.BASE_URL ?? 'https://rbihubcodechallenge.github.io';

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [
        ['html', { open: 'never' }],
        ['github'],
        ['list'],
        ['monocart-reporter', { name: 'Scientific Calculator QA', outputFile: 'monocart-report/index.html' }],
      ]
    : [
        ['html', { open: 'never' }],
        ['list'],
        ['monocart-reporter', { name: 'Scientific Calculator QA', outputFile: 'monocart-report/index.html' }],
      ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
