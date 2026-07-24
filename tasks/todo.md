# Premium fintech web redesign

- [x] Implement Task 1: luxury-fintech theme and primitives (`04ccd34`, `168d26e`).
- [x] Review Task 1 and resolve all Important/Critical findings (approved).
- [x] Implement Task 2: shared application shell.
- [x] Review Task 2 and resolve all Important/Critical findings (placeholder support copy removed; approved).
- [x] Implement Task 3: authentication redesign.
- [ ] Review Task 3 and resolve all Important/Critical findings.
- [ ] Implement Task 4: quotes dashboard redesign.
- [ ] Review Task 4 and resolve all Important/Critical findings.
- [ ] Implement Task 5: wizard frame and premium estimate treatment.
- [ ] Review Task 5 and resolve all Important/Critical findings.
- [ ] Implement Task 6: localization and not-found copy.
- [ ] Review Task 6 and resolve all Important/Critical findings.
- [ ] Implement Task 7: browser/accessibility verification.
- [ ] Review Task 7 and resolve all Important/Critical findings.
- [ ] Run Task 8 final quality gate and whole-branch review.

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
