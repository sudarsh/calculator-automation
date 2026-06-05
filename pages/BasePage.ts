import { type Page } from '@playwright/test';

/**
 * Abstract base for all page objects in this suite.
 *
 * Holds the shared Page reference and a navigate() helper so every feature
 * page object gets them for free. Adding a new feature:
 *   1. Create pages/<feature>/<Feature>Page.ts extending BasePage
 *   2. Implement goto() with the feature's entry path
 *   3. Register a fixture in tests/fixtures.ts
 *   4. Create tests/functional/<feature>/ for its specs
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  abstract goto(): Promise<void>;
}
