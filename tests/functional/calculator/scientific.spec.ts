import { test, expect } from '../../fixtures';
import { CalculatorPage } from '../../../pages/calculator/CalculatorPage';
import { SQRT_CASES, LOG_CASES } from './data';

/**
 * SCIENTIFIC FUNCTIONS: sin, cos, tan, sqrt, log.
 * sqrt and log10 are correct. sin is hardcoded (BUG-005); trig unit is
 * radians with no indication (BUG-006). Both documented as test.fail().
 */
test.describe('Scientific functions', () => {
  test.describe('Square root (correct)', () => {
    for (const { input, expected, label } of SQRT_CASES) {
      test(label, async ({ calc }) => {
        await calc.enterNumber(input);
        await calc.applyFunction(CalculatorPage.SQRT);
        expect(await calc.readDisplay()).toBe(expected);
      });
    }
    // BUG-007: sqrt of a negative yields NaN rather than an error.
    // Blocked until BUG-002 (minus key) is fixed to allow negative input.
    test.skip('sqrt(negative) reports an error, not NaN [BUG-007]', async () => {
      // Requires a working minus key (BUG-002) to enter a negative operand.
    });
  });

  test.describe('Logarithm (correct - base 10)', () => {
    for (const { input, expected, label } of LOG_CASES) {
      test(label, async ({ calc }) => {
        await calc.enterNumber(input);
        await calc.applyFunction('log');
        expect(await calc.readDisplay()).toBe(expected);
      });
    }
  });

  test.describe('Trigonometry', () => {
    // BUG-005: sin() is hardcoded to 1 for every input.
    test.fail('sin(0) = 0 [BUG-005]', async ({ calc }) => {
      await calc.enterNumber('0');
      await calc.applyFunction('sin');
      expect(await calc.readDisplay()).toBe('0');
    });

    // BUG-006: trig operates in radians with no unit indication.
    // cos(90) in degrees = 0; cos(90 rad) ≈ -0.448.
    test.fail('cos(90 degrees) = 0 [BUG-006]', async ({ calc }) => {
      await calc.enterNumber('90');
      await calc.applyFunction('cos');
      // 5 decimal places of precision to avoid floating-point noise
      expect(Number(await calc.readDisplay())).toBeCloseTo(0, 5);
    });

    // cos(0) = 1 holds in both unit systems — positive anchor.
    test('cos(0) = 1', async ({ calc }) => {
      await calc.enterNumber('0');
      await calc.applyFunction('cos');
      expect(await calc.readDisplay()).toBe('1');
    });

    // tan(0) = 0 holds in both unit systems — baseline check.
    test('tan(0) = 0', async ({ calc }) => {
      await calc.enterNumber('0');
      await calc.applyFunction('tan');
      expect(await calc.readDisplay()).toBe('0');
    });

    // BUG-006: tan(45°) = 1 in degrees; in radians tan(45) ≈ 1.619.
    test.fail('tan(45 degrees) = 1 [BUG-006]', async ({ calc }) => {
      await calc.enterNumber('45');
      await calc.applyFunction('tan');
      expect(Number(await calc.readDisplay())).toBeCloseTo(1, 5);
    });
  });
});
