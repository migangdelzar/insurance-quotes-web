# Final re-review: app-first PWA UX

| Field | Value |
|---|---|
| Scope | `origin/main..HEAD` |
| Reviewed head | `a4a3779a476d1771357ffe3b5702cc4d467fc2e3` |
| Review date | 2026-07-27 |
| Previous findings | F-01 CI Playwright coupling; F-02 same-origin defaults/artifact scan; F-03 programmatic coverage and health labels |
| Recommendation | **Approved** |

## Summary

The three blocking findings from the first final review are resolved. The
workspace-pinned Playwright runner now installs its matching browser revision
in CI, all committed API defaults use the same-origin `/api` boundary and the
production artifact checker rejects the prior localhost leak, and every
coverage or health choice group has a localized programmatic name.

The prior app-first PWA, navigation, accessibility, coverage persistence, and
premium contracts remain intact. No High- or Medium-severity findings remain.

## Findings

No High-, Medium-, or Low-severity findings were identified in the reviewed
scope.

## Resolution of previous findings

### F-01 — Resolved: CI Playwright browser version is coupled to the locked runner

- `@playwright/test` is pinned exactly to `1.61.1` in
  [`e2e/package.json`](../../e2e/package.json) and the lockfile.
- Both browser jobs compare the installed runner version with the declared
  version before invoking that workspace runner's installer at
  [`.github/workflows/ci.yml:111`](../../.github/workflows/ci.yml#L111) and
  [`.github/workflows/ci.yml:193`](../../.github/workflows/ci.yml#L193).
- The current pull-request workflow run
  [30295820216](https://github.com/migangdelzar/insurance-quotes-web/actions/runs/30295820216)
  completed successfully at the reviewed head. Its logs show Playwright
  Chromium and headless-shell revision `1228`, matching runner `1.61.1`.
- All four jobs passed: Web quality gates, Build production web image,
  Responsive browser audit, and Production PWA preview. The responsive job
  executed 5 responsive checks, 2 premium-shell journeys, and 13 app-first
  navigation/accessibility checks.

### F-02 — Resolved: defaults and generated artifacts preserve same-origin API access

- Development, production, and example environment files now set
  `VITE_API_BASE_URL=/api`:
  [`apps/web/.env.development`](../../apps/web/.env.development),
  [`apps/web/.env.production`](../../apps/web/.env.production), and
  [`apps/web/.env.example`](../../apps/web/.env.example).
- A normal `bun run --filter web build`, without an environment override,
  produced a portable same-origin artifact.
- The artifact checker recursively scans generated JavaScript and rejects the
  former `http://localhost:8080` API base at
  [`apps/web/src/pwa/check-build.mjs:81`](../../apps/web/src/pwa/check-build.mjs#L81)
  and
  [`apps/web/src/pwa/check-build.mjs:114`](../../apps/web/src/pwa/check-build.mjs#L114).
- The generated bundle contained no `http://localhost:8080`. The generated
  service worker still has exactly one navigation route, denies `/api`, and
  defines no API runtime-cache route.

### F-03 — Resolved: coverage and health groups have localized accessible names

- Coverage choices use semantic fieldset/legend grouping and an explicit
  `aria-labelledby` relationship at
  [`CoverageStep.tsx:53`](../../apps/web/src/features/quote-wizard/steps/coverage/CoverageStep.tsx#L53).
- Each senior yes/no question uses its localized question as the radiogroup
  name at
  [`HealthQuestionsSection.tsx:27`](../../apps/web/src/features/quote-wizard/steps/coverage/HealthQuestionsSection.tsx#L27).
- The condition checkboxes are grouped under the localized “Which
  conditions?” legend at
  [`HealthQuestionsSection.tsx:75`](../../apps/web/src/features/quote-wizard/steps/coverage/HealthQuestionsSection.tsx#L75).
- Regression tests query every health radiogroup and the condition group by
  their complete `en-US` and `es-MX` accessible names at
  [`HealthQuestionsSection.test.tsx:48`](../../apps/web/src/features/quote-wizard/steps/coverage/HealthQuestionsSection.test.tsx#L48).
  The coverage group is also queried by role and name.

## Positive observations

- Coverage synchronization remains race-safe. `flush()` cancels a pending
  debounce or awaits an in-flight request before Summary navigation at
  [`useDebouncedCoverageSync.ts:70`](../../apps/web/src/features/quote-wizard/steps/coverage/useDebouncedCoverageSync.ts#L70)
  and
  [`CoverageStep.tsx:34`](../../apps/web/src/features/quote-wizard/steps/coverage/CoverageStep.tsx#L34).
  Success and rejection regression tests remain green.
- The live senior journey passed with the expected `$327.60` premium while
  submitting both diabetes and hypertension, preserving the server-owned
  pricing contract.
- Submission exposes accessible checking, submitting, failure, retry, and
  success states at
  [`SubmissionResult.tsx:25`](../../apps/web/src/features/quote-wizard/steps/summary/SubmissionResult.tsx#L25).
- Authenticated route changes focus the destination `h1`; the shell preserves
  landmarks, skip navigation, account-menu Escape/focus restoration, fixed
  mobile navigation clearance, and footer clearance at
  [`AppShell.tsx:34`](../../apps/web/src/shared/components/AppShell.tsx#L34)
  and
  [`AppShell.tsx:157`](../../apps/web/src/shared/components/AppShell.tsx#L157).
- Document language follows the selected `en-US` or `es-MX` locale at
  [`i18n.ts:6`](../../apps/web/src/app/i18n.ts#L6). Locale catalogs, element
  references, and test IDs remain structurally valid.
- App navigation and dashboards remain usable without horizontal overflow at
  320, 375, 768, 1024, and 1440 pixels. Mobile footer and wizard action
  geometry remains clear of the fixed bottom navigation at 320 and 375 pixels.
- The installable PWA retains its manifest description, raster and maskable
  icons, Apple metadata, production preview check, `/api` navigation denylist,
  and prohibition on API runtime caching.
- CI retains branch/PR cancellation through `cancel-in-progress: true`, while
  enforcing unit, localization, lint, build, Docker image, responsive,
  app-first browser, and PWA-preview gates.

## Verification evidence

| Check | Result |
|---|---|
| Current GitHub Actions PR run at reviewed head | 4/4 jobs passed |
| `bun run --filter web test --run` | 28 files, 102 tests passed |
| `bun run --filter @clara/app-i18n test` | 5 tests passed |
| `packages/app-i18n: bun run validate` | Locale keys, references, and test IDs valid |
| `bun run --filter web lint` | 0 errors; 3 pre-existing Fast Refresh warnings |
| `bun run --filter e2e build` | Passed |
| `bun run --filter e2e lint` | Passed |
| Workspace Playwright version assertion | `Version 1.61.1` matched the exact declaration |
| `bun run --filter web build` with committed defaults | Passed |
| `apps/web: node src/pwa/check-build.mjs` | Passed |
| Generated JavaScript scan for `http://localhost:8080` | No matches |
| Generated service-worker route inspection | One navigation route; `/api` denied; no API runtime cache |
| Production PWA preview | 1 passed |
| CI-equivalent responsive, premium, navigation, and accessibility browser set | 20 passed, retries disabled |
| Live senior diabetes/hypertension journey | 1 passed; premium `$327.60` |
| Live same-origin health check | `/api/actuator/health` returned `UP` |

The build continues to emit the existing non-blocking chunk-size advisory, and
lint continues to report three existing Fast Refresh warnings. Neither affects
the reviewed contracts or constitutes a merge blocker.

## Recommendation

**Approved.**

No High- or Medium-severity findings remain. The branch is ready to merge from
the app-first PWA, navigation, accessibility, coverage, premium, same-origin,
and CI perspectives reviewed here. No source code was modified during this
re-review.
