import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object for the Scientific Calculator.
 *
 * All DOM coupling lives here. Tests speak in domain language
 * ("enter 8, press divide, press 6, read the result") and never touch
 * selectors directly, so a markup change is a one-file fix.
 *
 * NOTE: buttons are addressed by their *visible label*, exactly as a
 * human user perceives them. This is deliberate: if a button is wired to
 * the wrong action (e.g. the "3" key inserting "0"), the page object still
 * "presses 3" and the test asserts the user-visible outcome. That is how
 * the suite surfaces mislabel bugs instead of hiding them.
 */
export class CalculatorPage {
  readonly page: Page;
  readonly display: Locator;

  // Visible labels exactly as rendered (note the typographic symbols).
  static readonly DIVIDE = '\u00F7'; // ÷
  static readonly MULTIPLY = '\u00D7'; // ×
  static readonly MINUS = '\u2212'; // −
  static readonly PLUS = '+';
  static readonly SQRT = '\u221A'; // √
  static readonly EQUALS = '=';
  static readonly CLEAR = 'C';

  constructor(page: Page) {
    this.page = page;
    this.display = page.locator('#display');
  }

  async goto(): Promise<void> {
    await this.page.goto('/calculator/index.html');
    await expect(this.display).toBeVisible();
  }

  /** Click any button by its visible label. */
  async press(label: string): Promise<void> {
    await this.page.getByRole('button', { name: label, exact: true }).click();
  }

  // Maps ASCII shorthand to the typographic symbols rendered on the buttons.
  private static readonly ASCII_MAP: Record<string, string> = {
    '*': CalculatorPage.MULTIPLY,
    '/': CalculatorPage.DIVIDE,
    '-': CalculatorPage.MINUS,
  };

  /** Type a multi-character sequence of labels, e.g. "8/2" or "8\u00F72". */
  async pressSequence(sequence: string): Promise<void> {
    for (const ch of sequence) {
      await this.press(CalculatorPage.ASCII_MAP[ch] ?? ch);
    }
  }

  /** Enter each digit of a number string (does not handle operators). */
  async enterNumber(value: string): Promise<void> {
    for (const ch of value) {
      await this.press(ch);
    }
  }

  async clear(): Promise<void> {
    await this.press(CalculatorPage.CLEAR);
  }

  async equals(): Promise<void> {
    await this.press(CalculatorPage.EQUALS);
  }

  /** Apply a scientific function button (sin, cos, tan, √, log). */
  async applyFunction(label: string): Promise<void> {
    await this.press(label);
  }

  async readDisplay(): Promise<string> {
    return (await this.display.inputValue()).trim();
  }

  /** Convenience: enter expression, press equals, return the result string. */
  async evaluate(expression: string): Promise<string> {
    await this.pressSequence(expression);
    await this.equals();
    return this.readDisplay();
  }
}
