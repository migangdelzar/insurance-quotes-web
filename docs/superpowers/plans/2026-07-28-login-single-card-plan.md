# Login Single-Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with TDD.

**Goal:** Remove the redundant login marketing aside and deliver a centered, accessible single-card login experience without changing authentication behavior.

**Architecture:** Keep `LoginPage` as the authentication composition root. Remove only its marketing surface, keep the auth flows composable, and use the existing MUI theme/container spacing for the centered card. Passkey assertion failures are handled at the auth interaction boundary, while the HTTP client skips session refresh for WebAuthn assertion `401`s so MFA state remains retryable. Extend existing component and browser tests rather than introducing new runtime abstractions.

**Tech Stack:** React 19, TypeScript, MUI, React Router, i18next, Vitest, Testing Library, Playwright, Bun.

## Global Constraints

- Preserve routes, API/auth behavior, MFA, passkey enrollment, translations, and stable `tid()` selectors.
- Render exactly one `h1` on anonymous login.
- Keep the form `aria-labelledby` and `aria-describedby` contracts intact.
- Use existing semantic theme tokens and spacing; do not add dependencies or raw layout colors.
- Verify at 320, 375, 768, 1024, and 1440px with no horizontal overflow.
- Fail on unexpected browser `pageerror` and `console.error`; allow only the deliberate HTTP 500 diagnostic in the negative submission journey.
- Preserve the pre-existing unstaged `apps/web/index.html` change.

---

### Task 1: Remove the redundant login aside and center the auth card

**Files:**

- Modify: `apps/web/src/features/auth/pages/LoginPage.tsx`
- Test: `apps/web/src/features/auth/pages/LoginPage.test.tsx`
- Modify: `apps/web/src/features/auth/components/LoginForm.tsx`
- Modify: `apps/web/src/features/auth/components/PasskeyPrompt.tsx`
- Modify: `apps/web/src/features/auth/context/AuthProvider.tsx`
- Test: `apps/web/src/features/auth/context/AuthProvider.test.tsx`
- Modify: `apps/web/src/shared/api/httpClient.ts`
- Test: `apps/web/src/shared/api/httpClient.test.ts`
- Modify: `e2e/support/session.ts`
- Modify: `e2e/tests/responsive-layout.spec.ts`
- Modify: `e2e/tests/journey-z-passkey.spec.ts`
- Modify: `packages/app-i18n/src/data/elements.json`
- Modify: `packages/app-i18n/src/data/translations/en-US.json`
- Modify: `packages/app-i18n/src/data/translations/es-MX.json`

**Interfaces:**

- Consumes: existing `useAuth`, `useNavigate`, `useTranslation`, `LoginForm`, `PasskeyPrompt`, and `PasskeyEnrollDialog` interfaces.
- Produces: the same `/login` behavior with one `h1`, one accessible sign-in form, and unchanged auth selectors.

- [x] **Step 1: Write the failing test.** Replace the premium-layout expectation with the approved single-card contract:

```tsx
it('renders a focused single-card login surface without the marketing aside', () => {
  mockedUseAuth.mockReturnValue({
    sessionState: 'anonymous',
    authenticationMethod: null,
    isAuthenticated: false,
    login: vi.fn(),
    completeMfa: vi.fn(),
    loginWithPasskey: vi.fn(),
    enrollPasskey: vi.fn(),
    logout: vi.fn(),
  });

  renderPage();

  expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(
    screen.getByRole('heading', { level: 1, name: i18n.t('auth.login.title') })
  ).toBeVisible();
  expect(
    screen.queryByText(i18n.t('auth.login.brandHeadline'))
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('form', { name: i18n.t('auth.login.title') })
  ).toHaveAttribute('aria-describedby', 'auth-login-description');
});
```

- [x] **Step 2: Run the focused test to verify RED.**

Run:

```bash
bun run --filter web test --run src/features/auth/pages/LoginPage.test.tsx
```

Expected: FAIL because the current page still renders the complementary aside and the login title is an `h2`.

- [x] **Step 3: Implement the minimum UI change.** Delete the aside block. Update the remaining login surface to use a centered max-width and promote the existing title to `component="h1"`/`variant="h1"`; preserve its `id`, `data-testid`, section label, form props, session branching, and enrollment dialog.

- [x] **Step 4: Run focused GREEN verification.**

```bash
bun run --filter web test --run src/features/auth/pages/LoginPage.test.tsx
```

Expected: all LoginPage tests pass with the aside absent and the form contract intact.

- [x] **Step 5: Run full verification.**

```bash
bun run --filter web test --run
bun run --filter web lint
bun run --filter web build
bun run --filter e2e build
bun run --filter e2e lint
```

Expected: all tests pass; lint has zero errors; production build succeeds with only existing warnings/advisories.

- [x] **Step 6: Verify the real browser flow.** Use the Vite HMR server for fast feedback, wait for API health with the temporary development CORS override for port `5173`, clear the local demo passkey, run the complete Playwright suite, inspect the login screenshot, and assert computed bounds at every supported viewport. Confirm password login, MFA/passkey recovery, and passwordless login reach quotes without unexpected browser errors.

- [x] **Step 7: Commit and push.**

```bash
git add apps/web/src/features/auth/pages/LoginPage.tsx apps/web/src/features/auth/pages/LoginPage.test.tsx
git commit -m "refactor(web): simplify login presentation"
git push origin feat-frontend
```

### Task 2: Passkey failure recovery and smooth auth transitions

- [x] Add RED coverage for passwordless and MFA passkey failures at the component boundary.
- [x] Keep MFA pending after a failed assertion so the user can retry without restarting password login.
- [x] Prevent generic HTTP `401` refresh handling from remounting a WebAuthn assertion flow.
- [x] Add localized English and Spanish passkey error copy and private stable test IDs.
- [x] Add component/API regression coverage for expired or unregistered WebAuthn errors; keep browser lifecycle coverage real-only.
- [x] Narrow the authenticated quote mock to `/api/quotes` so it cannot intercept document reloads.

### Task 3: Explicit passkey setup before passkey sign-in

- [x] Add a backend preflight for username-based passkey assertions that returns `409 AUTH_PASSKEY_NOT_REGISTERED` before opening a browser credential ceremony.
- [x] Map the setup condition in the HTTP adapter without coupling the WebAuthn domain to HTTP types.
- [x] Make the post-password enrollment dialog an explicit setup step with dedicated copy, pending state, and recoverable registration errors.
- [x] Explain the password-first setup path when passwordless sign-in is attempted for a known account without a registered passkey.
- [x] Send the entered username to the assertion-options request so the service can perform the preflight check.
- [x] Run the passkey lifecycle in Playwright against the real Vite HMR proxy and source-backed Spring API; do not intercept auth or quote responses.

## Definition of Done

- [x] Marketing aside is absent from anonymous login.
- [x] Login renders one `h1` and a centered responsive card.
- [x] Password, passkey, MFA, enrollment, and passkey recovery flows remain working.
- [x] A user is guided through passkey registration before the browser asks for a passkey for that account.
- [x] Login component tests, full web checks, and complete Playwright flows pass.
- [x] No unexpected page or console errors are observed.
- [x] Only the pre-existing `apps/web/index.html` edit remains unstaged.

### Verification evidence — 2026-07-28

- Focused auth tests: 3 files / 17 tests passed, including no-refresh `401` handling and recoverable passkey alerts.
- Full web suite: 31 files / 113 tests passed; lint: 0 errors and 4 existing Fast Refresh warnings; production build passed with the existing chunk-size advisory.
- E2E build and lint passed.
- Responsive login matrix: 5 desktop widths passed with one `h1`, no complementary aside, no horizontal overflow, and a centered `560px` maximum card.
- Full HMR Playwright suite: 30 passed, including standard password login, senior health pricing, insurer retry, passkey lifecycle, forced expired-challenge recovery, navigation, accessibility, PWA, and console guards.
- Real-only passkey lifecycle: 1 mobile Playwright test passed against Vite `5173` proxying the Java 17 Spring `dev` API; it covered unregistered preflight, registration, MFA assertion, and passwordless sign-in without `page.route` interception.

### Task 4: Server-side quote history pagination, filtering, and ordering

- [x] Define a versioned quote-list query contract with page, size, search, status, coverage, sort field, and direction.
- [x] Implement bounded server-side filtering, ordering, and pagination in the hexagonal application and persistence adapters.
- [x] Return page metadata (`totalElements`, `totalPages`, `hasNext`, and `hasPrevious`) and update the OpenAPI/TypeScript contract.
- [x] Add responsive quote-history controls and preserve query state in TanStack Query keys.
- [x] Add backend unit/controller tests, frontend component tests, and a real Playwright journey proving query parameters and page navigation reach the live endpoint.

#### Task 4 verification evidence — 2026-07-28

- Backend full Maven suite passed, including query parsing, service filtering/order/page metadata, controller query parameters, and invalid-query `400` mapping.
- OpenAPI generation and drift check passed; the generated TypeScript contract is synchronized.
- Frontend suite passed: 33 files / 120 tests; lint passed with 0 errors and 4 existing Fast Refresh warnings; production build passed with the existing chunk-size advisory.
- Full real HMR Playwright matrix passed: 31/31, including live quote creation, search, ordering, page-size selection, and navigation to a live `page=1` endpoint request.
- Visual inspection: `/tmp/clara-login-hmr.png` shows the centered single-card login composition.
