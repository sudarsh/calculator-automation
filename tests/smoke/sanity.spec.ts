import { test, expect } from '../fixtures';

/**
 * SANITY / SMOKE SUITE
 * Fast "is the build even alive" checks. These must always be green;
 * a failure here means the calculator is fundamentally broken or undeployed
 * and there is no point running the deeper regression suites.
 */
test.describe('Sanity', () => {
  test('page loads with an empty display', async ({ calc }) => {
    await expect(calc.display).toBeVisible();
    expect(await calc.readDisplay()).toBe('');
  });

  test('a digit can be entered and shown', async ({ calc }) => {
    await calc.press('7');
    expect(await calc.readDisplay()).toBe('7');
  });

  test('a basic addition evaluates', async ({ calc }) => {
    expect(await calc.evaluate('2+2')).toBe('4');
  });

  test('clear empties the display', async ({ calc }) => {
    await calc.pressSequence('123');
    await calc.clear();
    expect(await calc.readDisplay()).toBe('');
  });

  test('all expected control buttons are present', async ({ page }) => {
    for (const label of ['C', '(', ')', '=', 'sin', 'cos', 'tan', '√', 'log']) {
      await expect(
        page.getByRole('button', { name: label, exact: true })
      ).toBeVisible();
    }
  });
});
