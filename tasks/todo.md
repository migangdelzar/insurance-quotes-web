# Premium fintech web redesign

- [ ] Implement Task 1: luxury-fintech theme and primitives.
- [ ] Review Task 1 and resolve all Important/Critical findings.
- [ ] Implement Task 2: shared application shell.
- [ ] Review Task 2 and resolve all Important/Critical findings.
- [ ] Implement Task 3: authentication redesign.
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
