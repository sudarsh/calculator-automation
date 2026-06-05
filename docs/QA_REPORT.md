# QA Report — Scientific Calculator

**Build:** https://rbihubcodechallenge.github.io/calculator/index.html  
**Tested by:** sudarsh  
**Suite:** 48 tests × 3 browsers — full defect detail in [`BUG_REPORT.md`](BUG_REPORT.md)

---

## Bottom line

**Don't ship this.** There are four blockers that make the calculator unreliable for basic use, plus nine lower-severity issues found during broader exploration.

The digit `3` key inserts `0` instead (BUG-001) — so any expression with a 3 is silently wrong, no error shown. The minus key inserts division instead of subtraction (BUG-002), making subtraction completely unreachable. Division itself has the operands swapped — `8 ÷ 2` gives `0.25` (BUG-003). And `sin()` is hardcoded to always return `1` regardless of input (BUG-005).

BUG-001 and BUG-002 look like copy-paste mistakes in the HTML — the button value attributes are probably just wired to the wrong handlers, should be a quick fix. BUG-003 and BUG-005 are logic bugs that need actual code changes, but they're localized. Fix those four, re-run the suite, and we can talk about shipping.

---

## How I tested it

Started by just clicking every button and watching what the display showed. That's how BUG-001 and BUG-002 turned up immediately — pressing `3` showed `0`, pressing `−` showed `/` on the display. Hard to miss once you actually use the thing.

From there I went through each operation systematically. Addition and multiplication checked out fine. Division was broken — `8÷2` kept giving `0.25` which is `2÷8`, so clearly the operands are flipped. Subtraction I couldn't even test properly because the minus key was wired wrong.

For the scientific functions I used anchor values — inputs where the answer is obvious regardless of unit system. `cos(0) = 1` whether you're in degrees or radians, `tan(0) = 0` same story. Those passed. `cos(90)` is where the unit issue shows up — should be 0 in degrees but the calculator gives `-0.448` because it's using radians with no label anywhere (BUG-006). For `sin`, I pressed `sin(0)` expecting `0` and got `1`. Tried a few other inputs, all returned `1`. It's hardcoded.

The edge cases I tested: empty input hitting equals, trailing operators, malformed decimals, unbalanced parentheses. A few of these surface raw JS values like `undefined`, `NaN`, `Infinity` on the display instead of a clean `Error` message. Not blockers but definitely rough edges.

Everything I found manually is now encoded as an automated test, so these can be verified in one run when fixes come in.

---

## Coverage summary

| Area | What I tested | Result | What I skipped and why |
|------|--------------|--------|------------------------|
| Digit input (0–9) | Each key individually | 9/10 pass — BUG-001 on key 3 | Nothing skipped |
| Operator mapping | All four operator buttons | 3/4 pass — BUG-002 on minus | Nothing skipped |
| Addition | Integer and decimal | Pass | Large numbers — low risk |
| Subtraction | 2 cases | Blocked by BUG-002 | Negative results — blocked anyway |
| Multiplication | Basic case | Pass | Edge cases — one regression guard is enough here |
| Precedence & grouping | `2+4*5`, `2*(4+5)` | Pass | Nested parens — core cases cover the pattern |
| Division | 4 cases including ÷0 | All fail — BUG-003/004 | Decimal division — bug makes all cases moot |
| `sin` | sin(0) | Fail — BUG-005 | More inputs pointless — everything returns 1 |
| `cos` | Anchor (0°) + unit check (90°) | 1 pass, 1 fail (BUG-006) | cos(180) — unit bug already confirmed |
| `tan` | Anchor (0°) + unit check (45°) | 1 pass, 1 fail (BUG-006) | tan(90) — same unit pattern as cos |
| `√` | √9, negative input | 1 pass, 1 skipped | Negative test needs working minus key (BUG-002) |
| `log` | log(100), log(1), log(0) | 2 pass, 1 fail (BUG-011) | log of fractions — happy path covered |
| Input validation | Empty =, bad operators, malformed decimal, unbalanced parens, log(0) | 3 pass, 6 fail (BUG-008–012) | Extreme inputs — covered the realistic cases |
| Keyboard input | — | Not tested | Display is `disabled` — keyboard isn't supported |
| Memory / exponents / ln | — | Not tested | Not in the build |

---

## On the automation structure

I set this up so it doesn't fall apart when a second feature gets added. There's a `BasePage` class that all page objects extend — it holds the browser page reference and navigation helper. `CalculatorPage` lives in `pages/calculator/` as feature one. Adding another feature means a new folder there, no touching existing files.

Tests get a ready-navigated `calc` object through Playwright's fixture system (`tests/fixtures.ts`) rather than setting it up in every `beforeEach`. The test inputs themselves live in `data.ts` inside the feature folder — adding a new arithmetic case is literally one line in a table.

The folder structure makes it obvious where things go: `pages/<feature>/`, `tests/functional/<feature>/`, one fixture entry. That's the whole pattern.

---

## What needs fixing

The two HTML bugs (BUG-001, BUG-002) should take minutes once someone looks at the button value attributes. When those are fixed, the subtraction tests and the `sqrt(negative)` test will automatically unblock.

BUG-003 (division swap) and BUG-005 (sin hardcoded) need logic changes but are isolated to their handlers. BUG-004 and the NaN/Infinity validation issues (BUG-008 through BUG-012) can probably be handled in one pass through the evaluator with some input guards.

BUG-006 (radians vs degrees) needs a product call before we can write a passing test — either add a DEG/RAD toggle or document that radians is intentional.

Full reproduction steps: [`BUG_REPORT.md`](BUG_REPORT.md).

All bugs are filed as GitHub Issues with severity labels and priority — [view the tracker](https://github.com/sudarsh/calculator-automation/issues) or the [project board](https://github.com/users/sudarsh/projects/2).

---

## Supplementary: UX Simulation Testing

As additional coverage beyond functional regression, I ran the calculator through **Simulr** — a UX testing tool I've been building as a personal project. Simulr uses AI personas to simulate real user behaviour, navigate the app autonomously, and produce a UX scorecard across four dimensions.

**Persona used:** Confident Explorer — navigates fast, trusts the UI, tries things without reading.

**Overall score: 4/10**

| Dimension | Score | Finding |
|---|---|---|
| Task Completion & Flow | 3/10 | Core arithmetic failed entirely — the persona couldn't complete a basic calculation |
| Visual Clarity | 7/10 | Clean dark theme, good layout — the UI looks professional |
| Error Handling | 2/10 | Raw `undefined` exposed directly; no guidance on what went wrong or how to recover |
| Accessibility | 5/10 | No ARIA labels, no visible focus indicators, no keyboard navigation |

**What this surfaced beyond the Playwright suite:**
- Buttons show no visual state change when pressed — users get no confirmation their input registered
- No visual differentiation between number buttons, operators, and scientific functions — increases cognitive load
- The display being a text input field confused the persona into trying to type directly into it
- Accessibility gaps (ARIA, focus management) are entirely outside what functional automation tests

The full report is in [`docs/simulr-ux-report.pdf`](simulr-ux-report.pdf).
