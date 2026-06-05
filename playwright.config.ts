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
  /* Fail the build on CI if test.only is left in the source. */
  forbidOnly: !!process.env.CI,
  /* Retry once on CI to absorb transient network flake against the live site. */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallelism inside a file; keep files parallel. */
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github'], ['list']]
    : [['html', { open: 'never' }], ['list']],
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
