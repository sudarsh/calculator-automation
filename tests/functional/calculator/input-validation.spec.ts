import { test, expect } from '../../fixtures';
import { CalculatorPage } from '../../../pages/calculator/CalculatorPage';

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

  // BUG-008: pressing "=" on an empty display shows "undefined".
  test.fail('equals on empty display does not show "undefined" [BUG-008]', async ({ calc }) => {
    await calc.equals();
    expect(await calc.readDisplay()).not.toBe('undefined');
  });

  // BUG-009: malformed number "2.3.4" is silently accepted (parses 2.3).
  test.fail('malformed number "2.3.4" is rejected [BUG-009]', async ({ calc }) => {
    await calc.pressSequence('2.3.4');
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  // BUG-010: unbalanced parentheses "(2+3" evaluate silently to 5.
  test.fail('unbalanced parentheses "(2+3" is rejected [BUG-010]', async ({ calc }) => {
    await calc.pressSequence('(2+3');
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  test('applying a function to empty input shows Error', async ({ calc }) => {
    await calc.applyFunction('log');
    expect(await calc.readDisplay()).toBe('Error');
  });

  // BUG-011: log(0) leaks -Infinity instead of showing Error.
  // log(0) is mathematically undefined; raw JS values must not reach the UI.
  test.fail('log(0) shows Error — log of zero is undefined [BUG-011]', async ({ calc }) => {
    await calc.enterNumber('0');
    await calc.applyFunction('log');
    expect(await calc.readDisplay()).toBe('Error');
  });

  // BUG-012: invalid expressions leak NaN instead of showing Error.
  // Affects leading operator and consecutive operators — same evaluator gap.
  test.fail('leading operator "+" without a left operand shows Error [BUG-012]', async ({ calc }) => {
    await calc.press(CalculatorPage.PLUS);
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  test.fail('consecutive operators "2++" show Error [BUG-012]', async ({ calc }) => {
    await calc.press('2');
    await calc.press(CalculatorPage.PLUS);
    await calc.press(CalculatorPage.PLUS);
    await calc.equals();
    expect(await calc.readDisplay()).toBe('Error');
  });

  test('clearing after a result resets state', async ({ calc }) => {
    await calc.evaluate('2+2');
    await calc.clear();
    expect(await calc.readDisplay()).toBe('');
  });
});
