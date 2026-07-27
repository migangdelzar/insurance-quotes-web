# Premium fintech web redesign

## Submit flow, mobile visual polish, and pricing verification

- [x] Reproduce all standard, senior-health, and insurer retry Playwright journeys against the running stack.
- [x] Confirm the submit failure boundary and make the local full-stack insurer dependency deterministic for browser verification.
- [x] Add regression coverage for the successful submit path and retry path if the client behavior is implicated.
- [x] Improve the mobile wizard color hierarchy and contrast without changing stable selectors or route behavior.
- [x] Verify the pricing contract: diabetes and hypertension are represented in health data and contribute through the pre-existing-condition pricing rule.
- [x] Run frontend tests, lint, build, backend pricing tests, and the full Playwright journey set.
- [x] Update this checklist with evidence, commit all intended changes, and push both feature branches.

### Verification evidence

- Full Playwright suite: 18 passed across desktop and mobile projects, including passkey lifecycle.
- Backend pricing and quote-service tests: 11 passed.
- Web tests: 59 passed; lint: 0 errors and 3 pre-existing Fast Refresh warnings; production build passed with the expected chunk-size warning.
- Local full-stack Compose validation passed with WireMock as the deterministic insurer stand-in.
- The local demo passkey rows were cleared after the mutating passkey journey so password login remains available for the three seeded users.

- [x] Implement Task 1: luxury-fintech theme and primitives (`04ccd34`, `168d26e`).
- [x] Review Task 1 and resolve all Important/Critical findings (approved).
- [x] Implement Task 2: shared application shell.
- [x] Review Task 2 and resolve all Important/Critical findings (placeholder support copy removed; approved).
- [x] Implement Task 3: authentication redesign.
- [x] Review Task 3 and resolve all Important/Critical findings, including the scoped accessibility and responsive follow-ups.
- [x] Implement Task 4: quotes dashboard redesign.
- [x] Review Task 4 and resolve all Important/Critical findings (dashboard responsive coverage added with isolated mocked-auth/API fixture).
- [x] Implement Task 5: wizard frame and premium estimate treatment (`4531c60`, `0b21e42`).
- [x] Review Task 5 and resolve all Important/Critical findings (step selectors preserved on focusable headings; re-review clean).
- [x] Implement Task 6: localization and not-found copy (`aee046d`).
- [x] Review Task 6 and resolve all Important/Critical findings.
- [x] Implement Task 7: browser/accessibility verification (`a68a715`).
- [x] Review Task 7 and resolve all Important/Critical findings.
- [x] Run Task 8 final quality gate and whole-branch review.

## Wizard interaction polish

- [x] Reproduce the coverage-selection flicker and identify the pending Skeleton swap as the cause.
- [x] Keep the current premium mounted while coverage synchronization is pending.
- [x] Add a localized, route-safe button to return to the quotes page.
- [x] Add focused regression coverage for both behaviors.
- [x] Run the full web quality gate and verify the fresh runtime in a browser.

## Same-origin frontend proxy

- [x] Add a failing browser contract proving API requests use the frontend origin.
- [x] Configure Vite and Nginx to proxy `/api/*` to the backend while preserving backend routes.
- [x] Make `/api` the safe frontend API default and update Compose build configuration.
- [x] Verify mocked browser journeys, responsive dashboard coverage, lint, typecheck, and build.
- [x] Rebuild the full Docker stack and verify the production Nginx proxy end to end.

## Completed quote actions and CI

- [x] Add localized actions after successful submission to view all quotes or start a new quote.
- [x] Reset the wizard state before navigating to a new quote.
- [x] Add component and browser coverage for the successful-submission actions.
- [x] Validate locale references, web tests, lint, production build, and mocked browser journeys.
- [x] Extend frontend GitHub Actions with locale validation, production image build, and mocked browser journeys.
- [x] Preserve push/PR concurrency cancellation with `cancel-in-progress: true`.

## Vite debugging server

- [x] Keep Vite HMR enabled with a predictable port and host binding.
- [x] Preserve the `/api` development proxy while debugging the full flow locally.
- [x] Verify the Vite client, HMR WebSocket, and API proxy from a running dev server.

## Working notes

- The feature branch is `feat-frontend`.
- The insurance application runs on port `3100`; port `3000` belongs to another local app.
- Existing Playwright journeys mutate the demo passkey state; run passkey last and reset only local demo auth state if a password-only manual session is needed.
- Task 1 scope only: shared theme tokens plus `BrandMark`, `PageIntro`, `Surface`, and `StatusBadge`.
- Preserve all existing `data-testid={tid(...)}` selectors, routes, API/auth behavior, reducer logic, and locale selector behavior.
- Task 1 should not require locale file edits unless a new primitive introduces visible copy; current plan does not require that.
- Focus RED coverage on theme tokens + primitive semantics, then verify with focused web tests/lint and browser overflow/focus checks.
- Task 2 scope only: shared shell chrome with header/main/footer, auth-aware sign-out, locale switcher, secure-session indicator, and localized footer copy.
- `QuotesListPage.test.tsx` does not currently exist; compensate with focused shell tests plus broader relevant verification.

## Task 1 checklist

- [x] Inspect approved task brief, existing theme, test setup, and affected UI patterns.
- [x] Write focused failing tests for the shared visual primitives and theme tokens.
- [x] Run the focused component test in RED state and capture the failure evidence.
- [x] Implement the minimum luxury-fintech theme tokens and shared primitives.
- [x] Run the focused component test in GREEN state.
- [x] Run focused lint for the web app and fix any new issues caused by Task 1.
- [x] Verify responsive behavior and focus visibility in the browser with no horizontal overflow.
- [x] Write `.superpowers/sdd/task-1-report.md` with commands, evidence, changed files, self-review, and concerns.
- [x] Commit Task 1 with a conventional commit message.

## Task 2 checklist

- [x] Inspect approved Task 2 brief, shell-related design docs, auth context, and i18n selectors/copy.
- [x] Write focused failing tests for `AppShell` landmarks, authenticated chrome, locale switching, and route-safe rendering.
- [x] Run the focused shell test in RED state and capture the failure evidence.
- [x] Implement `AppShell` and integrate it through `App.tsx` without changing routes or auth transitions.
- [x] Add only the required i18n copy and selector entries for shell controls.
- [x] Run focused shell tests plus relevant existing web verification, and fix any new issues.
- [x] Run lint/build checks relevant to the touched surface.
- [x] Write `.superpowers/sdd/task-2-report.md` with commands, evidence, changed files, self-review, and concerns.
- [x] Commit Task 2 with conventional commits (`e5752d0`, `3141fd6`, `9610ab0`).

## Task 3 checklist

- [x] Read the approved Task 3 brief, design, existing auth components, provider, routes, and i18n catalog.
- [x] Add focused RED tests for premium brand/trust layout, auth controls, and accessible form descriptions.
- [x] Run focused LoginPage tests in RED and confirm failures came from the missing redesign contract.
- [x] Implement the responsive auth composition without changing auth handlers, routes, API calls, MFA, passkey, or selectors.
- [x] Add localized auth brand/trust/security copy to both English and Spanish catalogs.
- [x] Run auth tests, i18n tests/validation, lint, build, and responsive Playwright checks.
- [x] Verify fresh runtime layout at 1280px (two columns) and 375px (single column) with no horizontal overflow.
- [x] Address review findings: semantic MFA heading, credential autocomplete metadata, and 1024px responsive coverage.
- [x] Record the RED/GREEN cycle and verification evidence in `.superpowers/sdd/task-3-report.md`.

## Task 4 checklist

- [x] Inspect the quote API contract, existing page, query behavior, and approved dashboard primitives.
- [x] Write focused dashboard state and presentation tests.
- [x] Run the focused dashboard tests in RED state.
- [x] Implement the premium dashboard, summary metrics, quote cards, empty state, retry action, and localized currency.
- [x] Run dashboard tests, full web tests, i18n validation, lint, build, and fresh-bundle responsive checks.
- [x] Record RED/GREEN evidence, the local CORS limitation, and the responsive review fix in `.superpowers/sdd/task-4-report.md`.
- [x] Commit Task 4 implementation and responsive review fix.

## Task 5 checklist

- [x] Write and run the `WizardFrame` RED contract test.
- [x] Implement the shared frame, desktop reassurance surface, semantic progress navigation, and premium estimate treatment.
- [x] Migrate personal, coverage, and summary steps without changing reducer, route, API, mutation, or existing selector behavior.
- [x] Run focused wizard tests, full web tests, i18n validation, lint, and build.
- [x] Address review finding by keeping each step selector on the focusable `<h1>`.
- [x] Record the browser auth/CORS environment limitation in `.superpowers/sdd/task-5-report.md`.

## Task 6 checklist

- [x] Write and run the `NotFoundPage` RED test.
- [x] Implement localized premium recovery copy and responsive not-found surface.
- [x] Preserve existing not-found selectors and `/quotes` route.
- [x] Run not-found/i18n tests, validation, lint, and build.
- [x] Record RED/GREEN evidence in `.superpowers/sdd/task-6-report.md`.

## Task 7 checklist

- [x] Add isolated premium-shell Playwright coverage for standard mobile and senior desktop journeys.
- [x] Verify fresh-bundle login/dashboard responsiveness at 320, 375, 768, 1024, and 1280 pixels.
- [x] Run real integrated standard, senior, failure/retry, and passkey journeys in mutation-safe order.
- [x] Record the fresh-port CORS constraint and passkey shared-state behavior in `.superpowers/sdd/task-7-report.md`.

## Task 8 checklist

- [x] Run formatting, lint, web tests, package tests, E2E typecheck, and production build.
- [x] Review changed frontend, i18n, and E2E files for selector, copy, and contract regressions.
- [x] Update the plan, working notes, and lessons with verification evidence.

## App-first PWA UX — final verification and handoff

## App-first post-review hardening A — coverage synchronization

- [x] Reproduce the debounced coverage/Next navigation race with focused hook and route tests.
- [x] Add a flush-and-await contract that preserves the normal 400 ms debounce.
- [x] Verify senior diabetes/hypertension payloads persist before Summary navigation.
- [x] Run focused and full web checks, record evidence, commit, and push.

## App-first post-review hardening B — accessible transition states

- [x] Add a failing focused test for the quote submission loading state, then render the existing localized `LoadingState`.
- [x] Add a failing focused test for authenticated route heading focus, then focus the destination `main h1` without disturbing skip-link behavior.
- [x] Add failing locale tests for initial and changed document language, then synchronize `<html lang>`.
- [x] Add failing responsive coverage for footer clearance at 320px and 375px, then reserve fixed-navigation space.
- [x] Run focused tests, full web tests, lint, build, and relevant Playwright checks.
- [x] Write the Hardening B report, commit all intended changes, push, and verify the remote SHA.

## App-first post-review hardening C — CI and PWA enforcement

- [x] Add app navigation, accessibility, dashboard responsive, production PWA preview, and static artifact checks to GitHub Actions.
- [x] Enforce manifest description and Apple install metadata in the production artifact checker.
- [x] Align README responsive verification and CI documentation with the supported viewport matrix.

## App-first post-review hardening D — final review findings

- [x] Add RED/GREEN regression coverage for workspace-pinned Playwright CI installation and same-origin Vite defaults.
- [x] Add RED/GREEN production-artifact coverage rejecting an absolute localhost API base.
- [x] Pin Playwright to the workspace lockfile version and install browsers through that binary in both CI jobs.
- [x] Set committed Vite API defaults to `/api` while preserving the localhost Vite proxy target.
- [x] Label coverage, health-question, and health-condition groups with localized programmatic names and regression tests.
- [x] Run focused/full web checks, lint, build, PWA checker/preview, and integrated browser journeys; commit and push the fixes.

### Final re-review evidence — 2026-07-27

- [x] Independent final review approved the branch with no High, Medium, or Low findings.
- [x] Current GitHub Actions PR run passed all 4 jobs, including the workspace-pinned Playwright browser installation.
- [x] Final live browser suite passed 28/28 with standard, senior diabetes/hypertension ($327.60), retry, passkey, responsive, navigation, and accessibility flows.
- [x] Final web suite passed 28 files / 102 tests; E2E build/lint, production build, same-origin artifact scan, PWA checker, and preview passed.

### Hardening B acceptance criteria

- Submission remains visibly and accessibly busy until the mutation resolves.
- Authenticated route transitions focus the destination page's first `h1`.
- `<html lang>` is `en` for `en-US` and `es-MX` for `es-MX`, including initial load.
- The authenticated footer is fully visible above fixed mobile navigation at 320px and 375px.
- Existing API, authentication, pricing, coverage debounce, navigation, i18n, and selector contracts remain unchanged.

### Hardening B verification evidence

- Focused web tests: 3 files / 10 tests passed.
- App i18n package tests: 1 file / 5 tests passed.
- Full web tests: 28 files / 97 tests passed.
- Web lint: 0 errors; 3 existing Fast Refresh warnings.
- E2E typecheck and lint: passed.
- Production web build: passed with the existing chunk-size advisory.
- Focused Playwright accessibility/navigation/responsive checks: 8 passed, including footer geometry at 320px and 375px.

## App-first post-review hardening D — CI and same-origin defaults

- [x] Add RED regression coverage for workspace-pinned Playwright CI installation.
- [x] Add RED regression coverage for same-origin committed Vite defaults.
- [x] Add RED production-artifact coverage rejecting an absolute localhost API base.
- [x] Pin Playwright to the workspace lockfile version and install browsers through that binary in both CI jobs.
- [x] Set committed Vite API defaults to `/api` while preserving the localhost Vite proxy target.
- [x] Run web tests, lint, build, PWA checker, E2E typecheck/lint, and PWA preview.
- [x] Write the Hardening D report, commit intended files only, push, and verify the remote SHA.

### Hardening D acceptance criteria

- Both browser CI jobs verify and use the exact Playwright version declared by the E2E workspace.
- Frozen dependency installation resolves that exact version from `bun.lock`.
- Development, production, and example Vite API defaults use `/api`.
- A generated JavaScript artifact containing `http://localhost:8080` fails the production artifact checker.
- Coverage and health components remain untouched by Hardening D.

### Hardening D verification evidence

- Focused PWA checker tests: 10/10 passed after three expected RED failures.
- Full web tests: 28 files / 102 tests passed.
- Web lint: 0 errors; 3 existing Fast Refresh warnings.
- E2E typecheck and lint: passed.
- Plain production build and PWA artifact checker: passed with no localhost API URL in generated JavaScript.
- Isolated production PWA preview: 1/1 passed on port 43104.

- [x] Run the complete current-source web unit suite: 25 files / 87 tests passed.
- [x] Run web lint (0 errors; 3 existing Fast Refresh warnings) and E2E typecheck/lint (both passed).
- [x] Build the production bundle and run the PWA artifact-policy checker (passed; manifest, service worker, icons, and no API runtime caching verified).
- [x] Run the production-only PWA preview check on isolated port `43102` (1 passed; server exited cleanly).
- [x] Run the complete no-retry Playwright suite against the available `http://localhost:3100` runtime: 15 passed / 11 failed. The failures are limited to new shell/navigation tests because `:3100` is an older forwarded Compose image; its existing pricing, retry, login, and passkey journeys still passed.
- [x] Smoke-test the freshly built production bundle on isolated port `43103`: login has no authenticated navigation; manifest/theme metadata and a service-worker registration are present; Chromium reported no page or console errors.
- [x] Document authenticated routes, PWA verification commands, and the development service-worker boundary in the README.

### App-first PWA verification evidence — 2026-07-27

- `bun run --filter web test --run`: 25 test files / 87 tests passed.
- `bun run --filter web lint`: 0 errors, 3 existing `react-refresh/only-export-components` warnings.
- `bun run --filter e2e build && bun run --filter e2e lint`: both passed.
- `bun run --filter web build && cd apps/web && node src/pwa/check-build.mjs`: passed; Vite reported the existing >500 kB chunk-size advisory.
- `E2E_PWA_PREVIEW_PORT=43102 bun run --filter e2e test:pwa-preview`: 1 passed.
- `E2E_BASE_URL=http://localhost:3100 bun run e2e -- --retries=0`: 15 passed / 11 failed because port 3100 is an older SSH-forwarded/full-stack deployment, not the current branch bundle. Do not treat it as a current-source app-shell verification until that image is rebuilt and redeployed.
