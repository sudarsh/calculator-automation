import { test, expect } from '../fixtures';
import { CalculatorPage } from '../../pages/calculator/CalculatorPage';

/**
 * INPUT VALIDATION & EDGE CASES
 * How the calculator handles malformed, empty, boundary, and operator-edge
 * input. These probe robustness rather than happy-path math.
 */
test.describe('Input validation & edge cases', () => {
  test('incomplete expression "2+" surfaces an Error', async ({ calc }) => {
    await calc.pressSequence('2+');
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  // BUG-008 (low): pressing "=" on an empty display shows "undefined".
  test.fail('equals on empty display does not show "undefined" [BUG-008]', async ({ calc }) => {
    await calc.equals();
    const v = await calc.readDisplay();
    expect(v).not.toBe('undefined');
  });

  // BUG-009 (low): malformed number "2.3.4" is silently accepted (parses 2.3).
  test.fail('malformed number "2.3.4" is rejected [BUG-009]', async ({ calc }) => {
    await calc.pressSequence('2.3.4');
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  // BUG-010 (low): unbalanced parentheses "(2+3" evaluate silently to 5.
  test.fail('unbalanced parentheses "(2+3" is rejected [BUG-010]', async ({ calc }) => {
    await calc.pressSequence('(2+3');
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  test('applying a function to empty input shows Error', async ({ calc }) => {
    await calc.applyFunction('log');
    expect(await calc.readDisplay()).toBe('Error');
  });

  test('log(0) shows Error — log of zero is undefined', async ({ calc }) => {
    await calc.enterNumber('0');
    await calc.applyFunction('log');
    expect(await calc.readDisplay()).toBe('Error');
  });

  test('leading operator "+" without a left operand shows Error', async ({ calc }) => {
    await calc.press(CalculatorPage.PLUS);
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  test('consecutive operators "2++" show Error', async ({ calc }) => {
    await calc.press('2');
    await calc.press(CalculatorPage.PLUS);
    await calc.press(CalculatorPage.PLUS);
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  test('result can be reused: clearing after a result resets state', async ({ calc }) => {
    await calc.evaluate('2+2');
    await calc.clear();
    expect(await calc.readDisplay()).toBe('');
  });
});
