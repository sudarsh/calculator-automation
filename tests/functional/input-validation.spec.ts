import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

/**
 * INPUT VALIDATION & EDGE CASES
 * How the calculator handles malformed, empty and boundary input. These
 * probe robustness rather than happy-path math.
 */
test.describe('Input validation & edge cases', () => {
  let calc: CalculatorPage;
  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  test('incomplete expression "2+" surfaces an Error', async () => {
    await calc.pressSequence('2+');
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  // BUG-008 (low): pressing "=" on an empty display shows "undefined".
  test.fail('equals on empty display does not show "undefined" [BUG-008]', async () => {
    await calc.equals();
    const v = await calc.readDisplay();
    expect(v).not.toBe('undefined');
  });

  // BUG-009 (low): malformed number "2.3.4" is silently accepted (parses 2.3).
  test.fail('malformed number "2.3.4" is rejected [BUG-009]', async () => {
    await calc.pressSequence('2.3.4');
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  // BUG-010 (low): unbalanced parentheses "(2+3" evaluate silently to 5.
  test.fail('unbalanced parentheses "(2+3" is rejected [BUG-010]', async () => {
    await calc.pressSequence('(2+3');
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  test('applying a function to empty input shows Error', async () => {
    await calc.applyFunction('log');
    expect(await calc.readDisplay()).toBe('Error');
  });

  test('result can be reused: clearing after a result resets state', async () => {
    await calc.evaluate('2+2');
    await calc.clear();
    expect(await calc.readDisplay()).toBe('');
  });
});
