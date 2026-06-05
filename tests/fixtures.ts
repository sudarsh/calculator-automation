import { test as base } from '@playwright/test';
import { CalculatorPage } from '../pages/calculator/CalculatorPage';

/**
 * Central fixture registry for all page objects.
 *
 * Each fixture navigates to the feature's entry page before the test body
 * runs, so specs receive a ready-to-use page object — no beforeEach wiring.
 *
 * Adding a new feature:
 *   import { Feature2Page } from '../pages/feature2/Feature2Page';
 *   feature2: async ({ page }, use) => { const f = new Feature2Page(page); await f.goto(); await use(f); }
 */

type Fixtures = {
  calc: CalculatorPage;
};

export const test = base.extend<Fixtures>({
  calc: async ({ page }, use) => {
    const calc = new CalculatorPage(page);
    await calc.goto();
    await use(calc);
  },
});

export { expect } from '@playwright/test';
