import { test, expect } from '../../fixtures';
import {
  ADDITION_CASES,
  MULTIPLICATION_CASES,
  PRECEDENCE_CASES,
  SUBTRACTION_CASES,
  DIVISION_CASES,
} from './data';

/**
 * CORE ARITHMETIC & OPERATOR PRECEDENCE
 * Addition, multiplication, precedence and grouping are CORRECT and are
 * locked down as regression guards. Subtraction is unreachable (BUG-002)
 * and division is defective (BUG-003). Both are documented as test.fail().
 */
test.describe('Arithmetic', () => {
  test.describe('Addition (regression guard)', () => {
    for (const { expr, expected, label } of ADDITION_CASES) {
      test(label, async ({ calc }) => {
        expect(await calc.evaluate(expr)).toBe(expected);
      });
    }
  });

  test.describe('Subtraction', () => {
    // BUG-002: the − key inserts ÷, so subtraction is entirely unreachable.
    for (const { expr, expected, label } of SUBTRACTION_CASES) {
      test.fail(`${label} [BUG-002]`, async ({ calc }) => {
        expect(await calc.evaluate(expr)).toBe(expected);
      });
    }
  });

  test.describe('Multiplication (regression guard)', () => {
    for (const { expr, expected, label } of MULTIPLICATION_CASES) {
      test(label, async ({ calc }) => {
        expect(await calc.evaluate(expr)).toBe(expected);
      });
    }
  });

  test.describe('Precedence & grouping (regression guard)', () => {
    for (const { expr, expected, label } of PRECEDENCE_CASES) {
      test(label, async ({ calc }) => {
        expect(await calc.evaluate(expr)).toBe(expected);
      });
    }
  });

  test.describe('Division', () => {
    // BUG-003: operands are swapped. 8 / 2 returns 0.25 (= 2 / 8).
    for (const { expr, expected, label } of DIVISION_CASES) {
      test.fail(`${label} [BUG-003]`, async ({ calc }) => {
        expect(await calc.evaluate(expr)).toBe(expected);
      });
    }

    // BUG-004: no divide-by-zero guard.
    test.fail('5 / 0 reports an error, not a number [BUG-004]', async ({ calc }) => {
      expect(await calc.evaluate('5/0')).toMatch(/error|infinity|undefined/i);
    });
    test.fail('0 / 5 = 0, not Infinity [BUG-003/004]', async ({ calc }) => {
      expect(await calc.evaluate('0/5')).toBe('0');
    });
  });
});
