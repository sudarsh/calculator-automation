import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

/**
 * CORE ARITHMETIC & OPERATOR PRECEDENCE
 * Addition, multiplication, precedence and grouping are CORRECT and are
 * locked down as regression guards. Division is defective (operands
 * swapped) and is documented with failing-as-expected tests.
 */
test.describe('Arithmetic', () => {
  let calc: CalculatorPage;
  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  test.describe('Addition (regression guard - passes today)', () => {
    test('2 + 2 = 4', async () => {
      expect(await calc.evaluate('2+2')).toBe('4');
    });
    test('decimals: 1.5 + 2.5 = 4', async () => {
      expect(await calc.evaluate('1.5+2.5')).toBe('4');
    });
  });

  test.describe('Multiplication (regression guard - passes today)', () => {
    test('6 * 7 = 42', async () => {
      expect(await calc.evaluate('6*7')).toBe('42');
    });
  });

  test.describe('Precedence & grouping (regression guard - passes today)', () => {
    test('2 + 3 * 4 = 14 (multiplication first)', async () => {
      expect(await calc.evaluate('2+3*4')).toBe('14');
    });
    test('(2 + 3) * 4 = 20 (parentheses first)', async () => {
      expect(await calc.evaluate('(2+3)*4')).toBe('20');
    });
  });

  test.describe('Division', () => {
    // BUG-003: operands are swapped. 8 / 2 returns 0.25 (= 2 / 8).
    test.fail('8 / 2 = 4 [BUG-003]', async () => {
      expect(await calc.evaluate('8/2')).toBe('4');
    });
    test.fail('100 / 4 = 25 [BUG-003]', async () => {
      expect(await calc.evaluate('100/4')).toBe('25');
    });

    // BUG-004: no divide-by-zero guard. Because of the operand swap, "5 / 0"
    // is computed as 0 / 5 = 0 (silently wrong), while "0 / 5" yields Infinity.
    test.fail('5 / 0 reports an error, not a number [BUG-004]', async () => {
      const result = await calc.evaluate('5/0');
      expect(result).toMatch(/error|infinity|undefined/i);
    });
    test.fail('0 / 5 = 0, not Infinity [BUG-003/004]', async () => {
      expect(await calc.evaluate('0/5')).toBe('0');
    });
  });
});
