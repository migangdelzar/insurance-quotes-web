# Login Single-Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with TDD.

**Goal:** Remove the redundant login marketing aside and deliver a centered, accessible single-card login experience without changing authentication behavior.

**Architecture:** Keep `LoginPage` as the authentication composition root. Remove only its marketing surface, keep `LoginForm`, `PasskeyPrompt`, and `PasskeyEnrollDialog` unchanged, and use the existing MUI theme/container spacing for the centered card. Extend existing component and browser tests rather than introducing new runtime abstractions.

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

**Interfaces:**

- Consumes: existing `useAuth`, `useNavigate`, `useTranslation`, `LoginForm`, `PasskeyPrompt`, and `PasskeyEnrollDialog` interfaces.
- Produces: the same `/login` behavior with one `h1`, one accessible sign-in form, and unchanged auth selectors.

- [ ] **Step 1: Write the failing test.** Replace the premium-layout expectation with the approved single-card contract:

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

- [ ] **Step 2: Run the focused test to verify RED.**

Run:

```bash
bun run --filter web test --run src/features/auth/pages/LoginPage.test.tsx
```

Expected: FAIL because the current page still renders the complementary aside and the login title is an `h2`.

- [ ] **Step 3: Implement the minimum UI change.** Delete the aside block. Update the remaining login surface to use a centered max-width and promote the existing title to `component="h1"`/`variant="h1"`; preserve its `id`, `data-testid`, section label, form props, session branching, and enrollment dialog.

- [ ] **Step 4: Run focused GREEN verification.**

```bash
bun run --filter web test --run src/features/auth/pages/LoginPage.test.tsx
```

Expected: all LoginPage tests pass with the aside absent and the form contract intact.

- [ ] **Step 5: Run full verification.**

```bash
bun run --filter web test --run
bun run --filter web lint
bun run --filter web build
bun run --filter e2e build
bun run --filter e2e lint
```

Expected: all tests pass; lint has zero errors; production build succeeds with only existing warnings/advisories.

- [ ] **Step 6: Verify the real browser flow.** Rebuild the web image, wait for API health, clear the local demo passkey, run the complete Playwright suite with the existing E2E rate-limit override, and inspect login screenshots/computed bounds at every supported viewport. Confirm password login reaches quotes and no unexpected browser errors occur.

- [ ] **Step 7: Commit and push.**

```bash
git add apps/web/src/features/auth/pages/LoginPage.tsx apps/web/src/features/auth/pages/LoginPage.test.tsx
git commit -m "refactor(web): simplify login presentation"
git push origin feat-frontend
```

## Definition of Done

- [ ] Marketing aside is absent from anonymous login.
- [ ] Login renders one `h1` and a centered responsive card.
- [ ] Password, passkey, MFA, and enrollment flows remain working.
- [ ] Login component tests, full web checks, and complete Playwright flows pass.
- [ ] No unexpected page or console errors are observed.
- [ ] Only the pre-existing `apps/web/index.html` edit remains unstaged.
