# Bug Report — Scientific Calculator

**Build under test:** https://rbihubcodechallenge.github.io/calculator/index.html
**Tested by:** sudarsh
**Method:** Black-box exploratory testing + automated Playwright regression suite
**Release recommendation:** **DO NOT SHIP.** Multiple critical defects make core
arithmetic and data entry unreliable.

---

## Severity summary

| ID | Title | Severity | Area |
|----|-------|----------|------|
| BUG-001 | "3" key inputs the digit "0" | Critical | Input |
| BUG-002 | "−" (minus) key inputs "÷" (division) | Critical | Input |
| BUG-003 | Division operands are swapped (`a ÷ b` computes `b ÷ a`) | Critical | Math |
| BUG-004 | No divide-by-zero handling (returns `Infinity`) | High | Math |
| BUG-005 | `sin(x)` always returns `1` for any input | Critical | Scientific |
| BUG-006 | Trig functions use radians with no unit indication | Medium | Scientific |
| BUG-007 | `√` of a negative returns `NaN` instead of an error | Low | Scientific |
| BUG-008 | `=` on empty input displays `undefined` | Low | Validation |
| BUG-009 | Malformed number `2.3.4` is silently accepted | Low | Validation |
| BUG-010 | Unbalanced parentheses are silently accepted | Low | Validation |
| BUG-011 | `log(0)` returns `-Infinity` instead of an error | Low | Validation |
| BUG-012 | Invalid expressions (leading/consecutive operators) return `NaN` | Low | Validation |
| BUG-013 | `(expr)*n` form does not evaluate — `)` finalises the sub-expression early | Medium | Math |

> **Verified-correct (no defect):** operator precedence (`2+4*5 = 22`),
> parentheses when the operator precedes the group (`2*(4+5) = 18`),
> addition, multiplication, `√` of non-negatives, and `log` (base-10
> for valid inputs). These are covered by passing regression guards.

---

## Critical

### BUG-001 — The "3" key inputs the digit "0"
- **Severity:** Critical
- **Steps to reproduce:**
  1. Open the calculator.
  2. Press the button labelled **3**.
- **Expected:** Display shows `3`.
- **Actual:** Display shows `0`. The digit `3` cannot be entered at all,
  and there is no other key that produces it.
- **Impact:** Any calculation involving the digit 3 is silently wrong. This
  corrupts user input with no error or visual cue — the most dangerous class
  of bug for a calculator.

### BUG-002 — The "−" (minus) key inputs "÷" (division)
- **Severity:** Critical
- **Steps to reproduce:**
  1. Press **1**, then the **−** button.
- **Expected:** Display shows `1-` (a subtraction operator).
- **Actual:** Display shows `1/`. Subtraction is impossible; the minus key
  performs division.
- **Impact:** An entire arithmetic operation (subtraction) is unreachable
  through the UI, and pressing minus produces a wrong, plausible-looking result.

### BUG-003 — Division operands are swapped
- **Severity:** Critical
- **Steps to reproduce:**
  1. Enter `8 ÷ 2` and press `=`.
- **Expected:** `4`.
- **Actual:** `0.25` (the engine computes `2 ÷ 8`).
- **Impact:** Every division returns the reciprocal ratio. Confirmed against the
  evaluator: `100 ÷ 4 → 0.04`. Division is unusable.

### BUG-005 — `sin(x)` always returns 1
- **Severity:** Critical
- **Steps to reproduce:**
  1. Enter `0`, press **sin**.
- **Expected:** `0`.
- **Actual:** `1`. The result is a hardcoded constant; every input returns `1`.
- **Impact:** The `sin` function is non-functional and returns confidently wrong
  values, which is worse than erroring out.

---

## High

### BUG-004 — No divide-by-zero handling
- **Severity:** High
- **Steps to reproduce:** Enter `0 ÷ 5`, press `=`.
- **Expected:** A user-facing `Error` (or guarded message).
- **Actual:** `Infinity`. (Note: due to BUG-003's operand swap, `5 ÷ 0` instead
  yields `0`, masking the division-by-zero entirely — equally wrong.)
- **Impact:** Mathematically undefined operations leak raw JS values to the user.

---

## Medium

### BUG-006 — Trig functions operate in radians with no unit shown
- **Severity:** Medium
- **Steps to reproduce:** Enter `90`, press **cos**.
- **Expected (degrees):** `0`. **Actual:** `-0.448...` (radians).
- **Impact:** Users of a "scientific calculator" overwhelmingly expect degrees,
  or at minimum an explicit DEG/RAD indicator. As built, results are correct
  radians but misleading with no labelling. Needs a product decision + a unit
  toggle or label.

---

## Low

### BUG-007 — `√` of a negative returns `NaN`
- Enter a negative operand and press **√** → `NaN` instead of `Error`.
  (Compounded by lack of unary-minus support; see notes.)

### BUG-008 — `=` on empty display shows `undefined`
- Press `=` with nothing entered → `undefined`. Expected: empty or `Error`.

### BUG-009 — Malformed number `2.3.4` accepted silently
- Entering `2.3.4` then `=` yields `2.3` (extra decimal dropped) instead of an
  `Error`. No guard against multiple decimal points.

### BUG-010 — Unbalanced parentheses accepted silently
- `(2+3` then `=` returns `5` with no error. Missing closing parenthesis is
  silently tolerated.

### BUG-013 — `(expr)*n` form does not evaluate correctly
- **Severity:** Medium
- **Steps to reproduce:**
  1. Enter `(2+4)*5` and press `=`.
- **Expected:** `30`.
- **Actual:** `6` — the calculator evaluates `(2+4)` immediately when `)` is
  pressed and discards the subsequent `*5`.
- **Impact:** Any expression where a parenthesised group is the left operand
  of a multiplication silently returns the wrong result. The reverse form
  `n*(expr)` (e.g. `2*(4+5)`) works correctly — the bug is specific to the
  `)` key finalising evaluation before the outer operator is applied.
- **Workaround:** Write the multiplier before the parenthesised group.

---

### BUG-011 — `log(0)` returns `-Infinity` instead of `Error`
- Enter `0`, press **log** → `-Infinity`. `log(0)` is mathematically undefined
  (approaches negative infinity); the raw JS value leaks to the display.
- **Expected:** `Error`. **Same class as BUG-004** (undefined operations must
  not leak internal JS values to users).

### BUG-012 — Invalid expressions return `NaN` instead of `Error`
- Affects two cases:
  - Press **+** then **=** with nothing entered → `NaN` (leading operator, no left operand).
  - Enter `2`, press **+** twice, press **=** → `NaN` (consecutive operators).
- **Expected:** `Error`. Raw `NaN` leaking to the display is the same class of
  defect as BUG-008 (`undefined`) and BUG-004 (`Infinity`).

---

## Additional observations (not bugs / forward-looking)
- **No keyboard input:** the display is a `disabled` input; only on-screen
  buttons work. Worth confirming as intended for accessibility (keyboard users).
- **No `=` / continued-calculation contract:** behaviour of chaining after a
  result is undocumented; recommend a defined spec.
- **No unary minus / negative number entry**, no exponent, no `ln`, no memory
  keys — acceptable for current scope but worth noting against the product spec.
- **Recommendation:** treat BUG-001, 002, 003, 005 as release blockers. The two
  input-mapping bugs (001/002) are one-line HTML fixes; the division swap (003)
  and `sin` hardcode (005) are localized logic fixes. A focused fix + re-run of
  this suite should clear the gate.
