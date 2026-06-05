import { test, expect } from '../../fixtures';
import { CalculatorPage } from '../../../pages/calculator/CalculatorPage';

/**
 * BUTTON / INPUT MAPPING
 * Verifies that each key inserts what its label promises. Tests assert
 * CORRECT behaviour; defect-blocked tests are annotated test.fail() with
 * a BUG-ID so CI stays green and auto-alerts when a fix lands.
 */
test.describe('Digit & operator button mapping', () => {
  for (const d of ['0', '1', '2', '4', '5', '6', '7', '8', '9']) {
    test(`digit ${d} inserts ${d}`, async ({ calc }) => {
      await calc.press(d);
      expect(await calc.readDisplay()).toBe(d);
    });
  }

  // BUG-001: the "3" key inserts "0".
  test.fail('digit 3 inserts 3 [BUG-001]', async ({ calc }) => {
    await calc.press('3');
    expect(await calc.readDisplay()).toBe('3');
  });

  // BUG-002: the "−" key inserts "/" (division) instead of a minus.
  test.fail('minus key inserts a minus operator [BUG-002]', async ({ calc }) => {
    await calc.press('1');
    await calc.press(CalculatorPage.MINUS);
    expect(await calc.readDisplay()).not.toContain('/');
  });

  test('plus key inserts + operator', async ({ calc }) => {
    await calc.press('1');
    await calc.press(CalculatorPage.PLUS);
    expect(await calc.readDisplay()).toBe('1+');
  });

  test('multiply key inserts * operator', async ({ calc }) => {
    await calc.press('1');
    await calc.press(CalculatorPage.MULTIPLY);
    expect(await calc.readDisplay()).toBe('1*');
  });

  test('divide key inserts / operator', async ({ calc }) => {
    await calc.press('1');
    await calc.press(CalculatorPage.DIVIDE);
    expect(await calc.readDisplay()).toBe('1/');
  });
});
