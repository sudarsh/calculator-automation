/**
 * Test data for the Scientific Calculator.
 * Adding a new case is one line here — no new test block needed.
 */

export const ADDITION_CASES = [
  { expr: '2+2',     expected: '4',  label: '2 + 2 = 4' },
  { expr: '1.5+2.5', expected: '4',  label: 'decimals: 1.5 + 2.5 = 4' },
];

export const MULTIPLICATION_CASES = [
  { expr: '6*7', expected: '42', label: '6 * 7 = 42' },
];

// Deliberately avoid digit 3 (BUG-001: inserts 0) so precedence guards
// are not silently invalidated by an unrelated input-mapping bug.
// Parentheses case uses n*(expr) form — (expr)*n causes the calculator
// to finalize the inner expression at ) before applying the outer *.
export const PRECEDENCE_CASES = [
  { expr: '2+4*5',   expected: '22', label: '2 + 4 * 5 = 22 (multiplication first)' },
  { expr: '2*(4+5)', expected: '18', label: '2 * (4 + 5) = 18 (parentheses first)' },
];

// BUG-002: subtraction unreachable — minus key inserts division.
export const SUBTRACTION_CASES = [
  { expr: '5-3',  expected: '2', label: '5 - 3 = 2' },
  { expr: '10-4', expected: '6', label: '10 - 4 = 6' },
];

// BUG-003: operands are swapped.
export const DIVISION_CASES = [
  { expr: '8/2',   expected: '4',  label: '8 / 2 = 4' },
  { expr: '100/4', expected: '25', label: '100 / 4 = 25' },
];

export const SQRT_CASES = [
  { input: '9', expected: '3', label: 'sqrt(9) = 3' },
];

export const LOG_CASES = [
  { input: '100', expected: '2', label: 'log(100) = 2' },
  { input: '1',   expected: '0', label: 'log(1) = 0' },
];
