# Scientific Calculator — QA Automation Suite

End-to-end test automation for the
[RBIH Scientific Calculator](https://rbihubcodechallenge.github.io/calculator/index.html),
built with **Playwright + TypeScript**.

## Quick start
```bash
npm ci
npx playwright install        # downloads browser binaries (needs network)
npm test                      # run the full suite (all browsers)
npm run report                # open the Playwright HTML report
```

Useful variants:
```bash
npm run test:smoke            # fast sanity checks only
npm run test:functional       # full functional/regression suite
npm run test:headed           # watch it drive a real browser
BASE_URL=http://localhost:8080 npm test   # run against a local copy
```

## Reports

**Live report (latest master run):**  
https://sudarsh.github.io/calculator-automation/

**Locally after a test run:**
```bash
npm run report:monocart       # opens monocart-report/index.html
npm run report                # opens the Playwright HTML report
```

The monocart report is also uploaded as a CI artifact on every run.

## Layout
```
pages/
  BasePage.ts                 Abstract base — shared Page ref and navigate()
  calculator/
    CalculatorPage.ts         Page Object for the calculator

tests/
  fixtures.ts                 Playwright fixtures — pre-navigated page objects
  smoke/
    sanity.spec.ts            Basic "is it alive" checks
  functional/
    calculator/
      data.ts                 Test input tables — add a case in one line
      arithmetic.spec.ts
      digit-input.spec.ts
      scientific.spec.ts
      input-validation.spec.ts

docs/
  BUG_REPORT.md               All findings with reproduction steps
  TEST_PLAN.md                Coverage approach and rationale
  QA_REPORT.md                Summary report with ship recommendation
.github/workflows/ci.yml      CI: 3-browser matrix + Pages deployment
```

## How defects are tracked

Tests assert correct behaviour. When a known bug blocks a test it gets
marked `test.fail()` with a `BUG-ID`. CI stays green, the defect is
documented as an executable test, and when the fix lands Playwright
flags the unexpected pass — so the annotation gets cleaned up automatically.

## Findings

12 bugs found: 4 Critical, 1 High, 1 Medium, 6 Low. **Do not ship.**  
See [`docs/BUG_REPORT.md`](docs/BUG_REPORT.md) for the full breakdown.
