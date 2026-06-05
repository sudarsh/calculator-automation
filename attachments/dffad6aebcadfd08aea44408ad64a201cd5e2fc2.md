# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional/calculator/digit-input.spec.ts >> Digit & operator button mapping >> digit 3 inserts 3 [BUG-001]
- Location: tests/functional/calculator/digit-input.spec.ts:19:8

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "3"
Received: "0"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - textbox [disabled] [ref=e3]: "0"
  - generic [ref=e4]:
    - button "C" [ref=e5] [cursor=pointer]
    - button "(" [ref=e6] [cursor=pointer]
    - button ")" [ref=e7] [cursor=pointer]
    - button "÷" [ref=e8] [cursor=pointer]
    - button "7" [ref=e9] [cursor=pointer]
    - button "8" [ref=e10] [cursor=pointer]
    - button "9" [ref=e11] [cursor=pointer]
    - button "×" [ref=e12] [cursor=pointer]
    - button "4" [ref=e13] [cursor=pointer]
    - button "5" [ref=e14] [cursor=pointer]
    - button "6" [ref=e15] [cursor=pointer]
    - button "−" [ref=e16] [cursor=pointer]
    - button "1" [ref=e17] [cursor=pointer]
    - button "2" [ref=e18] [cursor=pointer]
    - button "3" [active] [ref=e19] [cursor=pointer]
    - button "+" [ref=e20] [cursor=pointer]
    - button "0" [ref=e21] [cursor=pointer]
    - button "." [ref=e22] [cursor=pointer]
    - button "=" [ref=e23] [cursor=pointer]
    - button "sin" [ref=e24] [cursor=pointer]
    - button "cos" [ref=e25] [cursor=pointer]
    - button "tan" [ref=e26] [cursor=pointer]
    - button "√" [ref=e27] [cursor=pointer]
    - button "log" [ref=e28] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '../../fixtures';
  2  | import { CalculatorPage } from '../../../pages/calculator/CalculatorPage';
  3  | 
  4  | /**
  5  |  * BUTTON / INPUT MAPPING
  6  |  * Verifies that each key inserts what its label promises. Tests assert
  7  |  * CORRECT behaviour; defect-blocked tests are annotated test.fail() with
  8  |  * a BUG-ID so CI stays green and auto-alerts when a fix lands.
  9  |  */
  10 | test.describe('Digit & operator button mapping', () => {
  11 |   for (const d of ['0', '1', '2', '4', '5', '6', '7', '8', '9']) {
  12 |     test(`digit ${d} inserts ${d}`, async ({ calc }) => {
  13 |       await calc.press(d);
  14 |       expect(await calc.readDisplay()).toBe(d);
  15 |     });
  16 |   }
  17 | 
  18 |   // BUG-001: the "3" key inserts "0".
  19 |   test.fail('digit 3 inserts 3 [BUG-001]', async ({ calc }) => {
  20 |     await calc.press('3');
> 21 |     expect(await calc.readDisplay()).toBe('3');
     |                                      ^ Error: expect(received).toBe(expected) // Object.is equality
  22 |   });
  23 | 
  24 |   // BUG-002: the "−" key inserts "/" (division) instead of a minus.
  25 |   test.fail('minus key inserts a minus operator [BUG-002]', async ({ calc }) => {
  26 |     await calc.press('1');
  27 |     await calc.press(CalculatorPage.MINUS);
  28 |     expect(await calc.readDisplay()).not.toContain('/');
  29 |   });
  30 | 
  31 |   test('plus key inserts + operator', async ({ calc }) => {
  32 |     await calc.press('1');
  33 |     await calc.press(CalculatorPage.PLUS);
  34 |     expect(await calc.readDisplay()).toBe('1+');
  35 |   });
  36 | 
  37 |   test('multiply key inserts * operator', async ({ calc }) => {
  38 |     await calc.press('1');
  39 |     await calc.press(CalculatorPage.MULTIPLY);
  40 |     expect(await calc.readDisplay()).toBe('1*');
  41 |   });
  42 | 
  43 |   test('divide key inserts / operator', async ({ calc }) => {
  44 |     await calc.press('1');
  45 |     await calc.press(CalculatorPage.DIVIDE);
  46 |     expect(await calc.readDisplay()).toBe('1/');
  47 |   });
  48 | });
  49 | 
```