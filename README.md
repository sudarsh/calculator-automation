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

## Layout
```
pages/CalculatorPage.ts   Page Object Model — all DOM coupling lives here
tests/smoke/              Sanity / smoke checks (must always pass)
tests/functional/         Functional + regression suites, grouped by capability
docs/BUG_REPORT.md        Findings, severities, reproduction steps
docs/TEST_PLAN.md         Coverage strategy and rationale
.github/workflows/ci.yml  CI: 3-browser matrix, HTML report artifact
```

## How defects are represented
Tests assert **correct** behaviour. Tests blocked by a known bug are marked
`test.fail()` with a `BUG-ID` linking to `docs/BUG_REPORT.md`. This keeps CI
green while documenting every defect executably; a fix makes the test pass
unexpectedly and Playwright flags it for follow-up.

## Headline findings
4 Critical, 1 High, 1 Medium, 4 Low. **Recommendation: do not ship.**
See [`docs/BUG_REPORT.md`](docs/BUG_REPORT.md) for the full report.
