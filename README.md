# Scientific Calculator — QA Automation Suite

End-to-end test automation for the
[RBIH Scientific Calculator](https://rbihubcodechallenge.github.io/calculator/index.html),
built with **Playwright + TypeScript**.

## Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) | Test framework + browser automation |
| TypeScript | Type-safe test authoring |
| Node.js 20 | Runtime |
| GitHub Actions | CI — 3-browser parallel matrix |
| Monocart Reporter | Rich HTML test report |
| GitHub Pages | Live report hosting |

## Quick Start
```bash
npm ci
npx playwright install        # downloads browser binaries (needs network)
npm test                      # run the full suite (all browsers)
npm run report                # open the Playwright HTML report
```

**Useful variants:**
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

> The monocart report is also uploaded as a CI artifact on every run.

## Project Layout
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
  BUG_REPORT.md               All findings with precise reproduction steps
  TEST_PLAN.md                Coverage approach, rationale, and gap analysis
  QA_REPORT.md                Summary report and ship recommendation
.github/workflows/ci.yml      CI: 3-browser matrix + Pages deployment
```

## Test Strategy & Defect Tracking

The suite clearly separates `smoke` (sanity) and `functional` (regression) testing.
Tests assert **correct** behaviour, including boundary and edge cases.

When a known bug blocks a test it is marked `test.fail()` with a `BUG-ID`. This ensures:

1. **CI reliability** — the pipeline stays green and trustworthy
2. **Executable documentation** — the defect lives next to its assertion, not in a spreadsheet
3. **Automated cleanup** — when a fix lands, Playwright flags the unexpected pass, signalling the annotation can be removed

## Findings

13 bugs found: 4 Critical, 1 High, 2 Medium, 6 Low. **Do not ship.**

| Resource | Link |
|----------|------|
| Bug tracker (GitHub Issues) | [Issues #1–#13](https://github.com/sudarsh/calculator-automation/issues) |
| Project board | [Scientific Calculator QA](https://github.com/users/sudarsh/projects/2) |
| Full bug report | [`docs/BUG_REPORT.md`](docs/BUG_REPORT.md) |
| QA report | [`docs/QA_REPORT.md`](docs/QA_REPORT.md) |
| UX simulation report (Simulr) | [`docs/simulr-ux-report.pdf`](docs/simulr-ux-report.pdf) |
