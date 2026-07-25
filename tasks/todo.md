# Premium fintech web redesign

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
