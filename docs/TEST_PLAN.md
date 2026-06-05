# Test Plan — Scientific Calculator

## Objective
Validate functional correctness of the calculator before release, maximise
coverage of the documented feature set, and leave a regression suite that
guards the build going forward.

## Scope
**In scope:** digit/operator input mapping, all four arithmetic operations,
operator precedence and parentheses, the five scientific functions
(sin, cos, tan, √, log), input validation, and error handling.

**Out of scope (absent from build):** memory keys, exponents, `ln`, inverse
trig, history, keyboard entry (display is `disabled` by design).

## Sanity vs. regression

**Smoke (`tests/smoke/`)** — five checks that verify the page loads, a digit
can be entered, basic addition works, clear resets state, and all expected
buttons are present. If any of these fail the build is fundamentally broken
and running the full suite is pointless.

**Functional (`tests/functional/calculator/`)** — grouped by feature area.
Each spec covers the happy path, relevant boundary cases, and known defects.
Passing tests lock in correct behaviour as regression guards. Tests blocked
by a known bug are marked `test.fail()` with a `BUG-ID` so CI stays green
and the fix is automatically verified when the annotation gets removed.

## Boundary and equivalence thinking

- **Digits:** every key 0–9 individually — found BUG-001 (key 3 inserts 0)
- **Operators:** each operator button mapped individually — found BUG-002 (minus inserts division)
- **Subtraction:** documented as test.fail() since BUG-002 makes it unreachable
- **Division:** positive÷positive, n÷0, 0÷n — found BUG-003 (swap) and BUG-004 (Infinity)
- **Trig:** anchor value at 0 (valid in both unit systems), 45°/90° to distinguish deg vs rad — confirmed BUG-006 on cos and tan
- **Scientific domain boundaries:** log(0), sqrt(negative) — found BUG-011; sqrt blocked by BUG-002
- **Input guards:** empty input, trailing operator, leading operator, consecutive operators, malformed decimal, unbalanced parentheses — found BUG-008 through BUG-012
- **Parentheses form:** `n*(expr)` works; `(expr)*n` does not — found BUG-013

## Test data

Arithmetic and scientific inputs live in `tests/functional/calculator/data.ts`
rather than inline in specs. Adding a new case is one line in the table.
Expressions deliberately avoid digit 3 in regression guards to prevent
BUG-001 from silently invalidating unrelated tests.

## Environments
Chromium, Firefox, and WebKit via the Playwright 3-browser matrix, locally
and in CI. Cross-browser runs have surfaced behaviour differences — BUG-011
and BUG-012 were first caught when CI ran against Firefox and WebKit.

## Exit criteria
All smoke tests pass. No unexpected failures (a `test.fail()` that passes
means a bug was fixed and the annotation needs removing). Every `test.fail()`
maps to a logged bug in `BUG_REPORT.md`. Release is gated on the four
Critical bugs: BUG-001, BUG-002, BUG-003, BUG-005.
