# QA Report — Scientific Calculator

**Build under test:** https://rbihubcodechallenge.github.io/calculator/index.html  
**Tested by:** sudarsh  
**Method:** Black-box exploratory testing + Playwright/TypeScript automated regression suite  
**Suite:** 48 tests across 3 browsers (144 total) — see [`BUG_REPORT.md`](BUG_REPORT.md) for full defect details

---

## Executive Summary

**Recommendation: DO NOT SHIP.**

The build has four Critical defects that make core functionality either broken or silently wrong:

- **BUG-001** — The digit `3` key inserts `0`. Any calculation involving the digit 3 is corrupted with no visible signal.
- **BUG-002** — The minus `−` key inserts division `÷`. Subtraction is entirely unreachable through the UI.
- **BUG-003** — Division operands are swapped. `8 ÷ 2` returns `0.25` instead of `4`.
- **BUG-005** — `sin(x)` always returns `1` regardless of input. The function is non-functional.

These four alone disqualify release. BUG-001 and BUG-002 are one-line HTML fixes. BUG-003 and BUG-005 are localised logic fixes. A targeted fix cycle followed by a full suite re-run should clear the gate.

---

## Exploratory Testing Summary

Testing was conducted black-box against the live deployment. The approach:

1. **Happy-path sweep** — every visible button pressed individually, verifying the display response matched the label. This immediately surfaced BUG-001 (digit 3 → 0) and BUG-002 (minus → division).

2. **Arithmetic operations** — all four operations tested with representative inputs. Addition and multiplication were correct. Division was confirmed broken via `8÷2 → 0.25` and `100÷4 → 0.04`, revealing the operand-swap pattern (BUG-003). Subtraction was impossible to test correctly due to BUG-002.

3. **Boundary and error cases** — empty input, trailing operators, unbalanced parentheses, malformed decimals, divide-by-zero. Surfaced BUG-004 (Infinity on `0÷5`), BUG-008 (`undefined` on empty equals), BUG-009 (silent decimal acceptance), BUG-010 (silent unbalanced parens).

4. **Scientific functions** — each function tested with a known anchor value and a boundary/error case. `sin(0)` returned `1` (should be `0`), confirming hardcoding — BUG-005. `cos(90)` returned `~-0.448` not `0`, confirming radians without unit indication — BUG-006. `tan` showed the same unit issue. `log` and `√` were correct for valid inputs.

5. **Confirmation** — every finding was reproduced at least twice before logging. The automated suite encodes each reproduction as an executable test.

---

## Coverage & Traceability Matrix

| Area | Cases tested | Result | Deliberately not tested | Reason |
|------|-------------|--------|------------------------|--------|
| Digit input (0–9) | Each key individually | 9 pass, 1 fail (BUG-001: key 3) | — | Full key-by-key coverage |
| Operator mapping | +, −, ×, ÷ buttons | 3 pass, 1 fail (BUG-002: minus) | — | Full operator coverage |
| Addition | 2 cases (integer, decimal) | Pass | Large numbers, negative sums | Out of scope for basic smoke |
| Subtraction | 2 cases | Fail — BUG-002 blocks all subtraction | Negative results | Blocked by BUG-002 |
| Multiplication | 1 case | Pass | Multi-digit, large numbers | Regression guard sufficient |
| Operator precedence | 2 cases (+×, parens) | Pass | Nested parens, mixed ops | Core cases covered |
| Division | 4 cases (normal ×2, ÷0, 0÷n) | Fail — BUG-003/004 | Decimal results | Bug blocks all cases |
| `sin` | sin(0) | Fail — BUG-005 | sin(90), sin(180) | All inputs return 1; additional cases add no signal |
| `cos` | cos(0) anchor, cos(90°) unit check | 1 pass, 1 fail (BUG-006) | cos(180) | Unit-system bug confirmed; more cases redundant |
| `tan` | tan(0) anchor, tan(45°) unit check | 1 pass, 1 fail (BUG-006) | tan(90) undefined | Same unit-system pattern confirmed |
| `√` | √9, √(negative) | 1 pass, 1 skip | √0, √(decimal) | Negative blocked by BUG-002; basic case passes |
| `log` (base 10) | log(100), log(1), log(0) boundary | 2 pass, 1 pending | log(0.5), large values | Core domain covered |
| Input validation | Empty =, trailing op, double op, leading op, malformed decimal, unbalanced parens | 3 pass, 4 fail (BUG-008–010) | Extremely long input, all function + empty combos | Low risk; basic robustness covered |
| Keyboard input | — | Not tested | All | Display is `disabled` by design — keyboard entry not supported |
| Chained calculations | Result reuse after clear | Pass | Result → next expression (no clear) | Behaviour unspecified; tested the documented path |
| Memory / exponents / `ln` | — | Not tested | All | Not present in the build |

---

## How the Automation Scales

The suite is structured so adding a second feature costs near zero:

**`BasePage` (abstract class)** — `pages/BasePage.ts` holds the shared `Page` reference and `navigate()`. Every feature page object extends it and implements `goto()`. No boilerplate to copy.

**Feature page object folder** — `pages/calculator/CalculatorPage.ts` is feature 1. A new feature drops into `pages/<feature2>/Feature2Page.ts extends BasePage`. Zero changes to existing files.

**Fixtures** — `tests/fixtures.ts` uses `test.extend()` to expose `calc` as a ready-navigated fixture. Specs receive it as a parameter — no `beforeEach`, no `new Page()` scattered across files. Adding feature 2: one fixture entry, one new spec folder.

**Feature spec folder + data layer** — `tests/functional/calculator/` is the spec boundary for feature 1. `data.ts` inside it holds all parameterised inputs; adding a test case is one line in a table. A new feature adds `tests/functional/<feature2>/` with its own `data.ts`.

The pattern: one folder, one fixture entry, one data file — per feature. No rewiring of anything that already exists.

---

## Remediation Notes

| Priority | Bug | Fix effort | Verification |
|----------|-----|-----------|--------------|
| P0 | BUG-001 — digit 3 → 0 | One-line HTML fix (button value attribute) | Re-run `digit-input.spec.ts` — `test.fail()` will flip to pass |
| P0 | BUG-002 — minus → division | One-line HTML fix (button value attribute) | Re-run `digit-input.spec.ts` + unblocks subtraction and BUG-007 tests |
| P0 | BUG-003 — division operands swapped | Localised JS fix in evaluator | Re-run `arithmetic.spec.ts` division block |
| P0 | BUG-005 — sin hardcoded to 1 | Localised JS fix in sin handler | Re-run `scientific.spec.ts` trig block |
| P1 | BUG-004 — no divide-by-zero guard | Add guard in evaluator | Re-run division edge cases |
| P2 | BUG-006 — radians, no unit label | Product decision: add DEG/RAD toggle or label | Update `test.fail()` assertions once unit is defined |
| P3 | BUG-008/009/010 — validation gaps | Input sanitisation in evaluator | Re-run `input-validation.spec.ts` |

Once BUG-001 and BUG-002 are fixed, the `test.skip` on BUG-007 (`sqrt(negative)`) becomes automatable — remove the skip and add the assertion.

Full details, reproduction steps, and severity rationale: [`BUG_REPORT.md`](BUG_REPORT.md).
