# Final whole-branch review: app-first PWA UX

| Field | Value |
|---|---|
| Scope | `origin/main..HEAD` |
| Reviewed head | `18083372146d6e07f3a78d9dfb73ed4b19c8bf36` |
| Review date | 2026-07-27 |
| Recommendation | **Needs revision** |

## Summary

The app-first implementation is functionally strong in local and integrated
runtime verification. Coverage is flushed before navigation, diabetes and
hypertension reach the backend pricing flow, responsive geometry holds at the
required widths, route focus and document language are synchronized, and the
generated service worker does not runtime-cache API traffic.

The branch is not ready to merge because the current GitHub Actions run is red,
the committed environment defaults bypass the same-origin API boundary, and
the repeated health-question radio groups do not have programmatic group
names. The High- and Medium-severity findings below must be resolved and the
branch reviewed again.

## Findings

### High

#### F-01 — CI installs a different Playwright browser revision than the locked test runner

**Evidence**

- Both browser jobs invoke `bunx playwright install --with-deps chromium` at
  [`.github/workflows/ci.yml:111`](../../.github/workflows/ci.yml#L111) and
  [`.github/workflows/ci.yml:188`](../../.github/workflows/ci.yml#L188).
- The project test runner is declared in
  [`e2e/package.json:16`](../../e2e/package.json#L16) and resolved by
  `bun.lock` to Playwright `1.61.1`, whose Chromium headless-shell revision is
  `1228`.
- In remote run
  [30294638516](https://github.com/migangdelzar/insurance-quotes-web/actions/runs/30294638516),
  the install steps downloaded Chromium/headless-shell revision `1234`, but
  the test runner looked for revision `1228`.
- `Web quality gates` and `Build production web image` passed, but
  `Responsive browser audit` and `Production PWA preview` failed before any
  browser assertion could execute. The app-navigation, accessibility,
  dashboard, mocked journey, and PWA-preview guarantees therefore are not
  enforced by the current branch head.

**Impact**

The required CI gate is deterministically red on GitHub even though the same
tests pass locally. Pull requests cannot establish a green verification story,
and the newly added browser checks are skipped or fail before testing product
behavior.

**Smallest corrective action**

Run the browser installation through the workspace-pinned Playwright binary
instead of an independently resolved `bunx` package, and keep the Playwright
package version exact or otherwise demonstrably coupled to the lockfile. Add a
CI assertion or command arrangement that proves the installer and test runner
report the same Playwright version. Re-run both `responsive` and `pwa` jobs to
green.

### Medium

#### F-02 — Committed environment defaults bypass the same-origin `/api` contract

**Evidence**

- [`apps/web/.env.development:1`](../../apps/web/.env.development#L1),
  [`apps/web/.env.production:1`](../../apps/web/.env.production#L1), and
  [`apps/web/.env.example:2`](../../apps/web/.env.example#L2) set
  `VITE_API_BASE_URL=http://localhost:8080`.
- [`AuthProvider.tsx:76`](../../apps/web/src/features/auth/context/AuthProvider.tsx#L76)
  gives the environment variable precedence over its safe `/api` fallback.
- The development proxy only applies to `/api` requests in
  [`vite.config.ts:76`](../../apps/web/vite.config.ts#L76), so the committed
  development value bypasses that proxy.
- A plain `bun run --filter web build`, as documented in the README, completed
  successfully but embedded `http://localhost:8080` in the production
  JavaScript. Rebuilding with `VITE_API_BASE_URL=/api` removed the absolute URL
  and restored the intended Nginx boundary.
- Docker and CI happen to override the value explicitly at
  [`Dockerfile:12`](../../Dockerfile#L12) and
  [`.github/workflows/ci.yml:64`](../../.github/workflows/ci.yml#L64), which
  masks the repository-default defect in those paths.

**Impact**

The normal local development command makes cross-origin API calls instead of
using Vite's same-origin proxy, and a normal local production/PWA build is tied
to the builder machine's `localhost:8080`. This contradicts the documented
runtime contract and can reintroduce CORS failures or deploy a non-portable
artifact when an explicit override is omitted.

**Smallest corrective action**

Make `/api` the committed development, production, and example value. Keep
`http://localhost:8080` only as the Vite proxy target. Add a production-artifact
check that rejects absolute localhost API URLs so Docker/CI overrides cannot
hide a future regression.

#### F-03 — Coverage and health radio groups lack programmatic group names

**Evidence**

- The coverage selector renders a standalone `FormLabel` followed by a
  `RadioGroup` with no `aria-label` or `aria-labelledby` at
  [`CoverageStep.tsx:53`](../../apps/web/src/features/quote-wizard/steps/coverage/CoverageStep.tsx#L53).
- Each repeated senior-health yes/no question has the same pattern at
  [`HealthQuestionsSection.tsx:41`](../../apps/web/src/features/quote-wizard/steps/coverage/HealthQuestionsSection.tsx#L41):
  a visible `FormLabel`, then a `RadioGroup` without an association.
- The condition checkbox collection similarly has a visible label but no
  fieldset/legend or labelled group relationship at
  [`HealthQuestionsSection.tsx:68`](../../apps/web/src/features/quote-wizard/steps/coverage/HealthQuestionsSection.tsx#L68).
- Existing browser coverage selects the repeated controls through enclosing
  test IDs and individual “Yes/No” labels
  ([`journey-senior.spec.ts:24`](../../e2e/tests/journey-senior.spec.ts#L24)),
  so it does not assert the accessible name of each group.

**Impact**

Screen-reader users encounter multiple controls named only “Yes” and “No”
without a reliably announced question, making the senior health flow ambiguous.
This is especially material because diabetes, hypertension, tobacco,
prescription, and spouse answers affect the submitted pricing request.

**Smallest corrective action**

Use semantic `fieldset`/`legend` grouping (for example, MUI `FormControl`
with `component="fieldset"` and `FormLabel component="legend"`) or explicit
stable IDs with `aria-labelledby` for every radio/checkbox group. Add tests
that query each `radiogroup` by the full localized question name in both
locales.

## Positive observations

- Hardening A is effective. `flush()` clears the pending debounce and awaits
  persistence before Summary navigation in
  [`useDebouncedCoverageSync.ts:70`](../../apps/web/src/features/quote-wizard/steps/coverage/useDebouncedCoverageSync.ts#L70)
  and [`CoverageStep.tsx:34`](../../apps/web/src/features/quote-wizard/steps/coverage/CoverageStep.tsx#L34).
  Focused tests cover deferred success and rejection, and the senior payload
  includes both `DIABETES` and `HYPERTENSION`.
- The integrated senior journey completed at the expected `$327.60`, proving
  that diabetes/hypertension remain represented in the contract and reach the
  server-owned pricing flow.
- Hardening B closes the previously identified interaction gaps:
  `SubmissionResult` now exposes an accessible submitting status
  ([`SubmissionResult.tsx:62`](../../apps/web/src/features/quote-wizard/steps/summary/SubmissionResult.tsx#L62));
  authenticated route changes focus the destination `h1`
  ([`AppShell.tsx:34`](../../apps/web/src/shared/components/AppShell.tsx#L34));
  `<html lang>` follows `en`/`es-MX`
  ([`i18n.ts:6`](../../apps/web/src/app/i18n.ts#L6)); and the footer reserves
  fixed-navigation clearance
  ([`AppShell.tsx:157`](../../apps/web/src/shared/components/AppShell.tsx#L157)).
- Responsive browser checks passed locally at 320, 375, 768, 1024, and 1440
  pixels. The 320/375 geometry assertions prove both the footer and wizard
  action dock remain above the fixed bottom navigation.
- The localization package keeps raw catalogs private, exposes typed `tid()`,
  maintains `en-US`/`es-MX` parity, and passed its catalog validator.
- The generated service worker contains one navigation route with an `/api`
  denylist and no API runtime-cache route. Auth tokens, API responses, and
  mutable quote data are not included in the precache.
- The current integrated Nginx deployment is healthy at
  `http://localhost:3100`; after rebuilding with `VITE_API_BASE_URL=/api`, the
  browser artifact uses the same-origin proxy and
  `/api/actuator/health` reports `UP`.
- Push/PR concurrency uses a shared branch-derived group with
  `cancel-in-progress: true`, and observed superseded runs were cancelled as
  intended.

## Verification performed

| Check | Result |
|---|---|
| `bun run --filter web test --run` | 28 files, 97 tests passed |
| `bun run --filter @clara/app-i18n test` | 5 tests passed |
| `packages/app-i18n: bun run validate` | Catalog, references, and test IDs valid |
| `bun run --filter web lint` | 0 errors; 3 existing Fast Refresh warnings |
| `bun run --filter e2e build` | Passed |
| `bun run --filter e2e lint` | Passed |
| `bun run --filter web build` | Passed; exposed absolute localhost API URL |
| `VITE_API_BASE_URL=/api bun run --filter web build` | Passed; relative API boundary verified |
| `apps/web: node src/pwa/check-build.mjs` | Passed |
| `E2E_PWA_PREVIEW_PORT=43103 bun run --filter e2e test:pwa-preview` | 1 passed locally |
| Integrated targeted Playwright suite | 18 passed, retries disabled |
| Current GitHub Actions head run | Failed: browser revision mismatch in responsive and PWA jobs |

The integrated Playwright set covered app navigation, route focus, account-menu
Escape/focus restoration, dashboard responsiveness, 320/375 footer/action-dock
geometry, standard mobile submission, senior diabetes/hypertension pricing,
and insurer failure/retry.

## Recommendation

**Needs revision.**

Resolve F-01 through F-03, obtain a fully green GitHub Actions run at the new
head, and route the updated branch for re-review. No source changes were made
as part of this review.
