# Lessons

- Keep stable `data-testid` selectors on the semantic element that owns the behavior being tested. Moving a wizard selector to a child span made the selector stop identifying the focusable heading.
- Treat shared Playwright auth state as an explicit fixture lifecycle. The passkey journey must run last because it intentionally changes the demo user into an MFA/passwordless state.
- When validating a fresh frontend port against an existing backend, verify the backend CORS allow-list before diagnosing browser failures as UI regressions.
- Keep asynchronous result content mounted while showing progress beside it; replacing the result with a Skeleton creates avoidable visual flicker and layout instability.
- Keep post-submit navigation callbacks in the wizard container so a new quote can reset reducer state before routing.
- CI should validate both the static production image and mocked same-origin browser requests; a Vite-only check cannot prove the Nginx image builds.
- Local full-stack browser verification should use the deterministic WireMock insurer; an external `httpstat.us` dependency can make a healthy submit flow look broken.
- When copying a host-built bundle into the Nginx demo container, set `VITE_API_BASE_URL=/api`; otherwise `.env.production` can bake a direct API origin and bypass same-origin route interception.
- Passkey E2E is intentionally stateful: clear only the local demo credentials after the final passkey test so password-based demo login remains usable.
