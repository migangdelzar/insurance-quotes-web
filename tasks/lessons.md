# Lessons

- Keep stable `data-testid` selectors on the semantic element that owns the behavior being tested. Moving a wizard selector to a child span made the selector stop identifying the focusable heading.
- Treat shared Playwright auth state as an explicit fixture lifecycle. The passkey journey must run last because it intentionally changes the demo user into an MFA/passwordless state.
- When validating a fresh frontend port against an existing backend, verify the backend CORS allow-list before diagnosing browser failures as UI regressions.
- Keep asynchronous result content mounted while showing progress beside it; replacing the result with a Skeleton creates avoidable visual flicker and layout instability.
- Keep post-submit navigation callbacks in the wizard container so a new quote can reset reducer state before routing.
- CI should validate both the static production image and mocked same-origin browser requests; a Vite-only check cannot prove the Nginx image builds.
