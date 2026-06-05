# Scientific Calculator — QA Automation Suite

End-to-end test automation for the
[RBIH Scientific Calculator](https://rbihubcodechallenge.github.io/calculator/index.html),
built with **Playwright + TypeScript**.

## Quick start
```bash
npm ci
npx playwright install        # downloads browser binaries (needs network)
npm test                      # run the full suite (all browsers)
npm run report                # open the HTML report
```

Useful variants:
```bash
npm run test:smoke            # fast sanity checks only
npm run test:functional       # full functional/regression suite
npm run test:headed           # watch it drive a real browser
BASE_URL=http://localhost:8080 npm test   # run against a local copy
```

## Reporting
Two reporters run on every test execution:

**Playwright HTML** (quick local view):
```bash
npm run report
```

**Allure** (rich report with bug tags, feature breakdown, history):
```bash
npm run allure:report         # generate + open in one step
# or separately:
npm run allure:generate       # generates allure-report/ from allure-results/
npm run allure:open           # opens the report in a browser
```

Allure results are uploaded as CI artifacts (`allure-results-<browser>`) on every run.

## Layout
```
pages/
  BasePage.ts                        Abstract base — shared Page ref + navigate()
  calculator/
    CalculatorPage.ts                Page Object for the calculator (feature 1)
  <feature2>/                        ← new feature page object slots here

tests/
  fixtures.ts                        Playwright fixtures — ready-navigated page objects
  smoke/
    sanity.spec.ts                   App-level "is it alive" checks
  functional/
    calculator/                      Specs for feature 1
      data.ts                        Parameterised test inputs (add a case = one line)
      arithmetic.spec.ts
      digit-input.spec.ts
      scientific.spec.ts
      input-validation.spec.ts
    <feature2>/                      ← new feature spec folder slots here

docs/
  BUG_REPORT.md                      Findings, severities, reproduction steps
  TEST_PLAN.md                       Coverage strategy and rationale
  QA_REPORT.md                       Narrative front door — exec summary, matrix, ship rec
.github/workflows/ci.yml             CI: 3-browser matrix, HTML report artifact
```

## How defects are represented
Tests assert **correct** behaviour. Tests blocked by a known bug are marked
`test.fail()` with a `BUG-ID` linking to `docs/BUG_REPORT.md`. This keeps CI
green while documenting every defect executably; a fix makes the test pass
unexpectedly and Playwright flags it for follow-up.

## Headline findings
4 Critical, 1 High, 1 Medium, 4 Low. **Recommendation: do not ship.**
See [`docs/BUG_REPORT.md`](docs/BUG_REPORT.md) for the full report.
