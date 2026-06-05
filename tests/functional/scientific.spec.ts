import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

/**
 * SCIENTIFIC FUNCTIONS: sin, cos, tan, sqrt, log.
 * sqrt and log10 are correct. sin is hardcoded; trig unit (deg vs rad) is
 * unspecified and currently radians. These are documented per finding.
 */
test.describe('Scientific functions', () => {
  let calc: CalculatorPage;
  test.beforeEach(async ({ page }) => {
    calc = new CalculatorPage(page);
    await calc.goto();
  });

  test.describe('Square root (correct)', () => {
    test('sqrt(9) = 3', async () => {
      await calc.enterNumber('9');
      await calc.applyFunction(CalculatorPage.SQRT);
      expect(await calc.readDisplay()).toBe('3');
    });
    // BUG-007 (low): sqrt of a negative yields NaN rather than an error.
    // Automation is blocked: entering a negative requires the − key, which is
    // broken (BUG-002). Confirmed manually — enter any negative result and
    // press √ to reproduce. Remove this skip once BUG-002 is resolved.
    test.skip('sqrt(negative) reports an error, not NaN [BUG-007]', async () => {
      // Requires a working minus key (BUG-002) to enter a negative operand.
    });
  });

  test.describe('Logarithm (correct - base 10)', () => {
    test('log(100) = 2', async () => {
      await calc.enterNumber('100');
      await calc.applyFunction('log');
      expect(await calc.readDisplay()).toBe('2');
    });
    test('log(1) = 0', async () => {
      await calc.enterNumber('1');
      await calc.applyFunction('log');
      expect(await calc.readDisplay()).toBe('0');
    });
  });

  test.describe('Trigonometry', () => {
    // BUG-005: sin() is hardcoded to 1 for every input.
    test.fail('sin(0) = 0 [BUG-005]', async () => {
      await calc.enterNumber('0');
      await calc.applyFunction('sin');
      expect(await calc.readDisplay()).toBe('0');
    });

    // BUG-006: trig operates in radians with no unit indication. Most users
    // of a "scientific calculator" expect degrees, or at least a stated unit.
    // cos(90) in degrees = 0; here cos(90 rad) ~= -0.448.
    test.fail('cos(90 degrees) = 0 [BUG-006]', async () => {
      await calc.enterNumber('90');
      await calc.applyFunction('cos');
      expect(Number(await calc.readDisplay())).toBeCloseTo(0, 5);
    });

    // cos(0) = 1 holds in both unit systems - a useful positive anchor.
    test('cos(0) = 1', async () => {
      await calc.enterNumber('0');
      await calc.applyFunction('cos');
      expect(await calc.readDisplay()).toBe('1');
    });
  });
});
