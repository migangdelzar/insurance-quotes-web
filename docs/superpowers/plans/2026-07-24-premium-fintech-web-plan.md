# Premium Fintech Web Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the insurance quote web application into a cohesive luxury-fintech experience while preserving all current flows, routes, test IDs, localization, and API behavior.

**Architecture:** Extend the existing MUI theme and React feature structure with focused shared presentation components. `AppShell` owns page chrome, page components own data/state orchestration, and presentational primitives own visual consistency. No API contracts, reducer transitions, or authentication behavior change.

**Tech Stack:** React 19, TypeScript 5.7, MUI 6, React Router 7, React Hook Form, TanStack Query, i18next/react-i18next, Vitest, Testing Library, Playwright.

## Global Constraints

- Preserve all existing `data-testid={tid(...)}` selectors used by unit and Playwright tests.
- Preserve the existing routes, quote reducer, validation schemas, API payloads, authentication, MFA, and passkey behavior.
- Add all visible copy to both `packages/app-i18n/src/data/translations/en-US.json` and `es-MX.json`.
- Add new stable selectors to `packages/app-i18n/src/data/elements.json` only when tests need them.
- Use the luxury-fintech visual system: charcoal, warm cream, restrained champagne gold, slate text, thin borders, and shallow elevation.
- Keep semantic landmarks, keyboard support, focus visibility, WCAG AA contrast, and reduced-motion support.
- Verify at 320, 375, 768, 1024, and 1280px with no horizontal overflow.
- Keep runtime dependencies unchanged unless an existing MUI/React capability cannot implement the requirement.

## File Map

```text
apps/web/src/shared/theme/theme.ts                         # design tokens and MUI defaults
apps/web/src/shared/components/AppShell.tsx                # header/main/footer shell
apps/web/src/shared/components/AppShell.test.tsx           # shell behavior and accessibility
apps/web/src/shared/components/BrandMark.tsx               # reusable Clara identity
apps/web/src/shared/components/PageIntro.tsx               # eyebrow/title/description/actions
apps/web/src/shared/components/Surface.tsx                 # composed bordered surface
apps/web/src/shared/components/StatusBadge.tsx             # text-backed status treatment
apps/web/src/shared/components/visuals.test.tsx             # primitive semantics and states
apps/web/src/app/App.tsx                                   # shell composition
apps/web/src/features/auth/pages/LoginPage.tsx             # premium authentication layout
apps/web/src/features/auth/pages/LoginPage.test.tsx        # auth layout compatibility
apps/web/src/pages/QuotesListPage.tsx                      # dashboard composition
apps/web/src/pages/QuotesListPage.test.tsx                 # dashboard states and actions
apps/web/src/features/quote-wizard/components/WizardFrame.tsx
apps/web/src/features/quote-wizard/components/WizardFrame.test.tsx
apps/web/src/features/quote-wizard/components/WizardProgress.tsx
apps/web/src/features/quote-wizard/steps/*                 # framed wizard surfaces
packages/app-i18n/src/data/elements.json                    # new selectors if required
packages/app-i18n/src/data/translations/en-US.json          # English copy
packages/app-i18n/src/data/translations/es-MX.json          # Spanish copy
e2e/tests/responsive-layout.spec.ts                         # expanded shell/layout checks
e2e/tests/journey-standard.spec.ts                          # preserved happy path assertions
```

## Task 1: Build the luxury-fintech theme and primitives

**Files:**

- Modify: `apps/web/src/shared/theme/theme.ts`
- Create: `apps/web/src/shared/components/BrandMark.tsx`
- Create: `apps/web/src/shared/components/PageIntro.tsx`
- Create: `apps/web/src/shared/components/Surface.tsx`
- Create: `apps/web/src/shared/components/StatusBadge.tsx`
- Create: `apps/web/src/shared/components/visuals.test.tsx`

**Interfaces:**

- `PageIntro` accepts `{ eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode }` and renders one `h1` by default.
- `Surface` accepts `{ children: ReactNode; tone?: 'default' | 'dark' | 'gold'; ...PaperProps }` and composes a MUI `Paper` without hiding children.
- `StatusBadge` accepts `{ status: 'DRAFT' | 'SUBMITTED' | 'SUBMISSION_FAILED' | 'EXPIRED'; label: string }` and renders text plus a semantic `span` label.

- [ ] **Step 1: Write failing primitive tests**

```tsx
it('renders a page intro with an accessible level-one heading', () => {
  render(
    <PageIntro
      eyebrow="YOUR PORTFOLIO"
      title="My quotes"
      description="Track every quote in one place."
    />
  );
  expect(
    screen.getByRole('heading', { level: 1, name: 'My quotes' })
  ).toBeVisible();
  expect(screen.getByText('YOUR PORTFOLIO')).toBeVisible();
});

it('keeps status meaning in text instead of color alone', () => {
  render(<StatusBadge status="SUBMITTED" label="Submitted" />);
  expect(screen.getByText('Submitted')).toHaveAttribute(
    'data-status',
    'SUBMITTED'
  );
});
```

- [ ] **Step 2: Run the focused test and confirm Red**

Run: `bun run --filter web test -- src/shared/components/visuals.test.tsx`

Expected: FAIL because the primitives and luxury theme tokens do not exist.

- [ ] **Step 3: Implement the minimum primitives and tokens**

Use explicit theme tokens rather than page-local colors:

```ts
palette: {
  primary: { main: '#1b1d21', contrastText: '#f8f4ec' },
  secondary: { main: '#c8a66a', contrastText: '#1b1d21' },
  background: { default: '#f4f0e8', paper: '#fffdf8' },
  text: { primary: '#1b1d21', secondary: '#62656b' },
}
```

Add `prefers-reduced-motion` handling through theme transitions and make focus outlines visible on both cream and charcoal surfaces.

- [ ] **Step 4: Run focused tests and lint**

Run: `bun run --filter web test -- src/shared/components/visuals.test.tsx && bun run --filter web lint`

Expected: PASS with no new lint errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/theme/theme.ts apps/web/src/shared/components
git commit -m "feat(web): add luxury fintech theme primitives"
```

## Task 2: Add the shared application shell

**Files:**

- Create: `apps/web/src/shared/components/AppShell.tsx`
- Create: `apps/web/src/shared/components/AppShell.test.tsx`
- Modify: `apps/web/src/app/App.tsx`
- Modify: `apps/web/src/app/routes.tsx` only if shell-level auth state needs a route-safe wrapper
- Modify: `packages/app-i18n/src/data/elements.json`
- Modify: `packages/app-i18n/src/data/translations/en-US.json`
- Modify: `packages/app-i18n/src/data/translations/es-MX.json`

**Interfaces:**

- `AppShell` receives `{ children: ReactNode }` and reads `useAuth`, `useTranslation`, and `useLocation` internally.
- It renders `header`, `main#main-content`, and `footer`, preserving the existing skip-link selector `tid('common.skipToContent')` and main selector `tid('layout.main')`.

- [ ] **Step 1: Add shell behavior tests**

```tsx
it('renders product chrome and preserves the main landmark', () => {
  renderWithProviders(
    <AppShell>
      <div>Content</div>
    </AppShell>
  );
  expect(screen.getByRole('banner')).toBeVisible();
  expect(screen.getByRole('main')).toHaveAttribute('id', tid('layout.main'));
  expect(screen.getByRole('contentinfo')).toBeVisible();
});

it('renders sign out only for an authenticated session', () => {
  mockAuthenticatedSession();
  renderWithProviders(
    <AppShell>
      <div>Content</div>
    </AppShell>
  );
  expect(screen.getByRole('button', { name: /sign out/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the focused tests and confirm Red**

Run: `bun run --filter web test -- src/shared/components/AppShell.test.tsx`

Expected: FAIL because the shared shell does not exist.

- [ ] **Step 3: Implement the shell**

The header must contain the Clara wordmark, a product label, a secure-session indicator, language control, and authenticated sign-out action. Use real `button`/`a` elements, not clickable `div`s. The footer must include support, privacy/security, and a non-sensitive build label.

- [ ] **Step 4: Run tests and the existing auth/list tests**

Run: `bun run --filter web test -- src/shared/components/AppShell.test.tsx src/features/auth/pages/LoginPage.test.tsx src/pages/QuotesListPage.test.tsx`

Expected: PASS with existing selectors unchanged.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/components/AppShell* apps/web/src/app/App.tsx packages/app-i18n/src/data
git commit -m "feat(web): add responsive application shell"
```

## Task 3: Redesign authentication without changing auth behavior

**Files:**

- Modify: `apps/web/src/features/auth/pages/LoginPage.tsx`
- Modify: `apps/web/src/features/auth/components/LoginForm.tsx` only for visual grouping and accessible descriptions
- Modify: `apps/web/src/features/auth/components/PasskeyPrompt.tsx` and `PasskeyEnrollDialog.tsx` only for surface treatment if required
- Modify: `apps/web/src/features/auth/pages/LoginPage.test.tsx`
- Modify: `packages/app-i18n/src/data/translations/en-US.json`
- Modify: `packages/app-i18n/src/data/translations/es-MX.json`

- [ ] **Step 1: Extend tests for the two-column/mobile-safe composition**

```tsx
it('keeps password and passkey actions available in the premium auth layout', () => {
  renderLoginPage();
  expect(screen.getByTestId(tid('auth.login.username'))).toBeVisible();
  expect(screen.getByTestId(tid('auth.login.password'))).toBeVisible();
  expect(screen.getByTestId(tid('auth.login.submit'))).toBeVisible();
  expect(screen.getByTestId(tid('auth.login.passwordless'))).toBeVisible();
});
```

- [ ] **Step 2: Run the focused test and confirm Red**

Run: `bun run --filter web test -- src/features/auth/pages/LoginPage.test.tsx`

Expected: the compatibility assertions pass, while any new brand/trust assertions fail before the redesign.

- [ ] **Step 3: Implement the layout**

Use a responsive grid: brand panel plus authentication surface at `md` and above; a compact brand intro above the form below `md`. Keep `PasskeyPrompt`, enrollment dialog, invalid-credentials alert, and existing submit handlers intact.

- [ ] **Step 4: Run auth tests, lint, and build**

Run: `bun run --filter web test -- src/features/auth && bun run --filter web lint && bun run --filter web build`

Expected: PASS with no TypeScript or lint errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/auth apps/web/src/pages apps/web/src/shared packages/app-i18n/src/data
git commit -m "feat(web): redesign authentication experience"
```

## Task 4: Redesign the quotes dashboard

**Files:**

- Modify: `apps/web/src/pages/QuotesListPage.tsx`
- Create: `apps/web/src/pages/QuotesListPage.test.tsx` if the existing page has no dedicated test
- Reuse: `PageIntro`, `Surface`, and `StatusBadge`
- Modify: `packages/app-i18n/src/data/translations/en-US.json`
- Modify: `packages/app-i18n/src/data/translations/es-MX.json`
- Modify: `packages/app-i18n/src/data/elements.json` only for new dashboard controls

- [ ] **Step 1: Write dashboard state tests**

```tsx
it('renders an actionable empty state', () => {
  mockQuotes([]);
  renderQuotesListPage();
  expect(screen.getByTestId(tid('quotesList.empty'))).toBeVisible();
  expect(screen.getByTestId(tid('quotesList.startQuote'))).toHaveRole('button');
});

it('renders quote status and premium as readable data', () => {
  mockQuotes([
    { id: 'q-1', name: 'Jane Roe', status: 'SUBMITTED', monthlyPremium: 129.5 },
  ]);
  renderQuotesListPage();
  expect(screen.getByText(/submitted/i)).toBeVisible();
  expect(screen.getByText(/129\.50/)).toBeVisible();
});
```

- [ ] **Step 2: Run the focused tests and confirm Red for new presentation assertions**

Run: `bun run --filter web test -- src/pages/QuotesListPage.test.tsx`

- [ ] **Step 3: Implement the dashboard**

Render the intro, summary strip, quote cards, status badges, localized premium values, and distinct pending/error/empty states. Keep `listQuotes`, navigation to `/quote/personal`, and all existing selectors.

- [ ] **Step 4: Run dashboard tests and responsive checks**

Run: `bun run --filter web test -- src/pages/QuotesListPage.test.tsx && bun run --filter e2e test tests/responsive-layout.spec.ts --project=desktop-chromium`

Expected: PASS at all configured viewport sizes with no horizontal overflow.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/pages/QuotesListPage.tsx apps/web/src/pages/QuotesListPage.test.tsx packages/app-i18n/src/data
git commit -m "feat(web): redesign quotes dashboard"
```

## Task 5: Add a shared wizard frame and premium estimate treatment

**Files:**

- Create: `apps/web/src/features/quote-wizard/components/WizardFrame.tsx`
- Create: `apps/web/src/features/quote-wizard/components/WizardFrame.test.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/WizardProgress.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/PremiumDisplay.tsx`
- Modify: `apps/web/src/features/quote-wizard/steps/personal/PersonalInfoStep.tsx`
- Modify: `apps/web/src/features/quote-wizard/steps/coverage/CoverageStep.tsx`
- Modify: `apps/web/src/features/quote-wizard/steps/summary/SummaryStep.tsx`

**Interfaces:**

- `WizardFrame` accepts `{ activeStep: 0 | 1 | 2; title: ReactNode; description?: ReactNode; children: ReactNode; aside?: ReactNode }`.
- It renders the existing `WizardProgress` once, a focusable `h1`, main content surface, and desktop-only reassurance aside.

- [ ] **Step 1: Write the frame contract test**

```tsx
it('renders one heading, progress, content, and reassurance region', () => {
  render(
    <WizardFrame
      activeStep={1}
      title="Coverage selection"
      aside={<span>Private and secure</span>}
    >
      <div>Form</div>
    </WizardFrame>
  );
  expect(
    screen.getByRole('heading', { level: 1, name: 'Coverage selection' })
  ).toBeVisible();
  expect(screen.getByTestId(tid('wizard.progress'))).toBeVisible();
  expect(screen.getByText('Private and secure')).toBeVisible();
});
```

- [ ] **Step 2: Run the focused test and confirm Red**

Run: `bun run --filter web test -- src/features/quote-wizard/components/WizardFrame.test.tsx`

- [ ] **Step 3: Implement the frame and migrate all three steps**

Move page-level spacing and heading treatment into `WizardFrame`; keep form controls, mutations, route guards, and step-specific `data-testid` values in their existing components. Make actions stack at mobile widths.

- [ ] **Step 4: Run all wizard unit tests and build**

Run: `bun run --filter web test -- src/features/quote-wizard && bun run --filter web build`

Expected: PASS with personal, senior-health, summary, retry, and premium display behavior unchanged.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/quote-wizard
git commit -m "feat(web): frame quote wizard as a premium journey"
```

## Task 6: Complete localization, not-found, and shell copy

**Files:**

- Modify: `packages/app-i18n/src/data/translations/en-US.json`
- Modify: `packages/app-i18n/src/data/translations/es-MX.json`
- Modify: `packages/app-i18n/src/data/elements.json` only when a selector is needed
- Modify: `apps/web/src/pages/NotFoundPage.tsx`
- Modify: `packages/app-i18n/src/index.test.ts` if translation shape coverage needs extension

- [ ] **Step 1: Add translation-shape tests for new keys**

```ts
it('exposes shell and premium dashboard keys in both locales', () => {
  expect(texts.layout.header).toBeDefined();
  expect(texts.layout.footer).toBeDefined();
  expect(texts.quotesList.summary).toBeDefined();
});
```

- [ ] **Step 2: Run i18n tests and confirm Red for missing keys**

Run: `bun run --filter @clara/app-i18n test`

- [ ] **Step 3: Add complete English and Spanish copy**

Add matching keys for header, footer, secure session, support, privacy, portfolio summary, reassurance aside, and not-found presentation. Keep `elements.json` values stable for existing keys.

- [ ] **Step 4: Validate locale data and run frontend tests**

Run: `bun run --filter @clara/app-i18n test && bun run --filter @clara/app-i18n validate && bun run --filter web test`

Expected: PASS with no missing locale keys or selector drift.

- [ ] **Step 5: Commit**

```bash
git add packages/app-i18n apps/web/src/pages/NotFoundPage.tsx
git commit -m "feat(i18n): add premium shell and dashboard copy"
```

## Task 7: Browser, accessibility, and visual verification

**Files:**

- Modify: `e2e/tests/responsive-layout.spec.ts`
- Modify: `e2e/tests/journey-standard.spec.ts` only for additive assertions
- Modify: `e2e/tests/journey-z-passkey.spec.ts` only for additive authentication-shell assertions
- Create: `e2e/tests/premium-shell.spec.ts`

- [ ] **Step 1: Add browser assertions before implementation is considered complete**

```ts
test('premium shell has landmarks, visible focus, and no horizontal overflow', async ({
  page,
}) => {
  await page.goto('/login');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
});
```

- [ ] **Step 2: Run browser checks against the running app**

Run: `E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test tests/premium-shell.spec.ts tests/responsive-layout.spec.ts --project=desktop-chromium --retries=0`

Expected: PASS at 320, 375, 768, 1024, and 1280px.

- [ ] **Step 3: Run all journeys in mutation-safe order**

Run standard, senior, failure/retry, then passkey last:

```bash
E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test tests/journey-standard.spec.ts --project=mobile-chromium --retries=0
E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test tests/journey-senior.spec.ts --project=desktop-chromium --retries=0
E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test tests/journey-failure.spec.ts --project=desktop-chromium --retries=0
E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test tests/journey-z-passkey.spec.ts --project=mobile-chromium --retries=0
```

Expected: all journey tests pass; reset only demo passkeys/refresh tokens afterward if the local manual login should return to password-only state.

- [ ] **Step 4: Perform accessibility and console review**

Check the login, quotes, personal, coverage, and summary routes for semantic landmarks, heading hierarchy, accessible names, visible focus, zero console errors, and no horizontal overflow.

- [ ] **Step 5: Commit**

```bash
git add e2e/tests
git commit -m "test(web): verify premium shell journeys and accessibility"
```

## Task 8: Full quality gate and handoff

- [ ] **Step 1: Run formatting, lint, unit tests, and build**

```bash
bunx prettier --check apps/web/src e2e/tests packages/app-i18n/src
bun run --filter web lint
bun run test
bun run build
```

- [ ] **Step 2: Run final Playwright journeys and responsive audit**

Use Task 7’s commands against `http://localhost:3100`, with passkey last.

- [ ] **Step 3: Review the diff for selector, copy, and contract regressions**

Run: `git diff main...HEAD -- apps/web/src packages/app-i18n/src e2e/tests`

Confirm no API files, auth state transitions, or existing stable selectors were changed unintentionally.

- [ ] **Step 4: Update this plan and working notes**

Mark each task `✅ Done`, record the verification commands and results, and add any discovered lessons to `tasks/lessons.md`.

- [ ] **Step 5: Push the completed branch**

```bash
git status --short
git push origin feat-frontend
git log --oneline origin/feat-frontend -1
```

Expected: clean working tree and remote tip at the final redesign commit.

## Definition of Done

- [ ] Shared header, footer, shell, login, dashboard, and wizard have the approved luxury-fintech treatment.
- [ ] English and Spanish locales contain all new visible copy.
- [ ] Existing authentication and quote journeys pass unchanged.
- [ ] Responsive and accessibility browser checks pass.
- [ ] Unit tests, lint, formatting, and production build pass.
- [ ] Commits are focused, pushed to `feat-frontend`, and the plan is marked complete.
