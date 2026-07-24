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
