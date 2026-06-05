import { test, expect } from '../fixtures';

/**
 * CORE ARITHMETIC & OPERATOR PRECEDENCE
 * Addition, multiplication, precedence and grouping are CORRECT and are
 * locked down as regression guards. Subtraction is unreachable (BUG-002)
 * and division is defective (BUG-003). Both are documented as test.fail().
 */
test.describe('Arithmetic', () => {
  test.describe('Addition (regression guard - passes today)', () => {
    test('2 + 2 = 4', async ({ calc }) => {
      expect(await calc.evaluate('2+2')).toBe('4');
    });
    test('decimals: 1.5 + 2.5 = 4', async ({ calc }) => {
      expect(await calc.evaluate('1.5+2.5')).toBe('4');
    });
  });

  test.describe('Subtraction', () => {
    // BUG-002: the − key inserts ÷, so "5-3" is evaluated as "5÷3 ≈ 1.667".
    // Subtraction is entirely unreachable through the UI until BUG-002 is fixed.
    test.fail('5 - 3 = 2 [BUG-002]', async ({ calc }) => {
      expect(await calc.evaluate('5-3')).toBe('2');
    });
    test.fail('10 - 4 = 6 [BUG-002]', async ({ calc }) => {
      expect(await calc.evaluate('10-4')).toBe('6');
    });
  });

  test.describe('Multiplication (regression guard - passes today)', () => {
    test('6 * 7 = 42', async ({ calc }) => {
      expect(await calc.evaluate('6*7')).toBe('42');
    });
  });

  test.describe('Precedence & grouping (regression guard - passes today)', () => {
    test('2 + 3 * 4 = 14 (multiplication first)', async ({ calc }) => {
      expect(await calc.evaluate('2+3*4')).toBe('14');
    });
    test('(2 + 3) * 4 = 20 (parentheses first)', async ({ calc }) => {
      expect(await calc.evaluate('(2+3)*4')).toBe('20');
    });
  });

  test.describe('Division', () => {
    // BUG-003: operands are swapped. 8 / 2 returns 0.25 (= 2 / 8).
    test.fail('8 / 2 = 4 [BUG-003]', async ({ calc }) => {
      expect(await calc.evaluate('8/2')).toBe('4');
    });
    test.fail('100 / 4 = 25 [BUG-003]', async ({ calc }) => {
      expect(await calc.evaluate('100/4')).toBe('25');
    });

    // BUG-004: no divide-by-zero guard. Because of the operand swap, "5 / 0"
    // is computed as 0 / 5 = 0 (silently wrong), while "0 / 5" yields Infinity.
    test.fail('5 / 0 reports an error, not a number [BUG-004]', async ({ calc }) => {
      const result = await calc.evaluate('5/0');
      expect(result).toMatch(/error|infinity|undefined/i);
    });
    test.fail('0 / 5 = 0, not Infinity [BUG-003/004]', async ({ calc }) => {
      expect(await calc.evaluate('0/5')).toBe('0');
    });
  });
});
