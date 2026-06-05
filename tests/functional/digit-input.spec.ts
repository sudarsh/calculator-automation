import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

/**
 * BUTTON / INPUT MAPPING
 * Verifies that each key inserts what its label promises. These tests
 * assert CORRECT behaviour; ones blocked by a known defect are annotated
 * test.fail() with a BUG-ID so CI stays green AND auto-alerts the day the
 * fix lands (Playwright reports an unexpected pass).
 */
test.describe('Digit & operator button mapping', () => {
  let calc: CalculatorPage;
  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  // Digits 0,1,2,4,5,6,7,8,9 map correctly.
  for (const d of ['0', '1', '2', '4', '5', '6', '7', '8', '9']) {
    test(`digit ${d} inserts ${d}`, async () => {
      await calc.press(d);
      expect(await calc.readDisplay()).toBe(d);
    });
  }

  // BUG-001: the "3" key inserts "0".
  test.fail('digit 3 inserts 3 [BUG-001]', async () => {
    await calc.press('3');
    expect(await calc.readDisplay()).toBe('3');
  });

  // BUG-002: the "−" key inserts "/" (division) instead of a minus.
  test.fail('minus key inserts a minus operator [BUG-002]', async () => {
    await calc.press('1');
    await calc.press(CalculatorPage.MINUS);
    expect(await calc.readDisplay()).toBe('1\u2212'.replace('\u2212', '-'));
    // Expected display to contain a subtraction operator after "1".
    expect(await calc.readDisplay()).toMatch(/1-?/);
    expect(await calc.readDisplay()).not.toContain('/');
  });

  test('plus, multiply and divide keys insert their operators', async () => {
    await calc.press('1');
    await calc.press(CalculatorPage.PLUS);
    expect(await calc.readDisplay()).toBe('1+');
    await calc.clear();
    await calc.press('1');
    await calc.press(CalculatorPage.MULTIPLY);
    expect(await calc.readDisplay()).toBe('1*');
    await calc.clear();
    await calc.press('1');
    await calc.press(CalculatorPage.DIVIDE);
    expect(await calc.readDisplay()).toBe('1/');
  });
});
