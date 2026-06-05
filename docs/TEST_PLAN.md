# Test Plan — Scientific Calculator

## Objective
Validate functional correctness of the calculator before release, maximise
coverage of the documented feature set, and leave a regression suite that
guards the build going forward.

## Scope
**In scope:** digit/operator input mapping, the four arithmetic operations,
operator precedence and parentheses, the five scientific functions
(sin, cos, tan, √, log), input validation, and error handling.

**Out of scope (absent from build):** memory keys, exponents, `ln`, inverse
trig, history, keyboard entry (display is disabled by design).

## Coverage strategy — sanity vs. regression
- **Sanity / smoke (`tests/smoke`)** — minimal "is it alive" checks run first.
  If these fail, deeper suites are meaningless. Always expected green.
- **Functional / regression (`tests/functional`)** — exhaustive behaviour
  checks grouped by capability. Includes both positive guards (locking in
  correct behaviour like precedence) and defect documentation.

## Handling known defects
Tests assert **correct** behaviour, not current behaviour. Where a defect
blocks a test, it is annotated `test.fail()` with the `BUG-ID`. Consequences:
- CI stays green (known defects are expected failures, not noise).
- The defect is documented executably, next to its assertion.
- When a bug is fixed, the test passes unexpectedly and Playwright flags it,
  forcing the annotation to be removed — a built-in fix-verification signal.

## Boundary & equivalence thinking (examples)
- Digits: every key 0–9 individually (caught the 3→0 mapping bug).
- Division: positive/positive, by zero, into zero (caught swap + Infinity).
- Trig: 0 (anchor valid in both unit systems), 90 (distinguishes deg/rad).
- Numbers: well-formed decimal, multiple decimal points, empty.
- Grouping: balanced vs. unbalanced parentheses.

## Environments
Chromium, Firefox and WebKit via the Playwright matrix, locally and in CI.

## Exit criteria
All sanity tests pass; no *unexpected* failures; every `test.fail()` maps to a
logged bug in `BUG_REPORT.md`. Release is gated on the four Critical bugs.
