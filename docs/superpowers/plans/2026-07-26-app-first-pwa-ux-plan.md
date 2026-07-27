# App-first PWA UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Follow the Red → Green → Refactor cycle for every behavior change.

**Goal:** Turn the existing React/Vite quote workspace into a minimalist installable PWA with clear desktop/mobile navigation, stable loading states, and an easier quote journey.

**Architecture:** Keep the existing React Router, MUI theme, TanStack Query, i18n `t()`/`tid()` contract, authentication provider, and same-origin `/api` client. Consolidate navigation into one responsive app-navigation component, keep quote data fetching in the existing page boundary, and add PWA generation through `vite-plugin-pwa` with precaching limited to static application assets. API requests and private quote data remain network-only.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, MUI 6, React Router 7, TanStack Query 5, i18next, Vitest, Testing Library, Playwright, Bun workspaces, `vite-plugin-pwa` 1.3.x.

## Global Constraints

- Preserve backend contracts, authentication, pricing rules, routes, test IDs, and same-origin `/api` behavior.
- Preserve the existing Emme-derived palette: `#FBFBFD`, `#FFFFFF`, `#0071E3`, `#1D1D1F`, and accessible semantic status tokens.
- The authenticated app exposes Home, Quotes, New quote, and Account destinations; login remains outside the authenticated shell.
- The mobile navigation is fixed and safe-area aware; wizard actions must remain above it and never cover focused content.
- Do not cache authentication tokens, API responses, or mutable quote data in the service worker.
- API mutations require connectivity and must never appear successful while offline.
- Existing standard, senior-health, insurer-retry, passkey, responsive, and same-origin Playwright journeys remain compatible.
- Use `t()` for visible text and `tid()` for stable test IDs; add both locales for every new visible key.
- Follow TDD: write a failing focused test, run it, implement the smallest passing change, refactor, rerun tests, and commit each task.
- Use the 320px, 375px, 768px, 1024px, and 1440px viewport set for responsive verification.

## Current structure and planned boundaries

| Boundary            | Current source                                                        | Planned responsibility                                                                             |
| ------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| App composition     | `apps/web/src/app/App.tsx`, `apps/web/src/app/routes.tsx`             | Keep providers/routes; add Home/history route mode without changing existing URLs                  |
| App chrome          | `apps/web/src/shared/components/AppShell.tsx`                         | Render compact header, responsive navigation, account surface, main landmark, and reduced footer   |
| Navigation contract | New `apps/web/src/shared/navigation/navigation.ts`                    | Define destination IDs, paths, active-route matching, and translation/test-ID keys                 |
| Quote workspace     | `apps/web/src/pages/QuotesListPage.tsx`                               | Support overview/history presentation while sharing the existing query and API contract            |
| Wizard framing      | `apps/web/src/features/quote-wizard/components/*`                     | Make progress, content surface, action dock, and post-submit actions visually consistent           |
| PWA build           | `apps/web/vite.config.ts`, `apps/web/index.html`, `apps/web/public/*` | Generate manifest/service worker and expose only static shell assets                               |
| Verification        | `apps/web/src/**/*.test.tsx`, `e2e/tests/*`                           | Cover semantic navigation, keyboard behavior, responsive layout, PWA output, and critical journeys |

## Dependency graph

```text
Navigation contract + locale/test-ID keys
              ↓
Responsive AppNavigation + AccountMenu
              ↓
AppShell + route destinations
              ↓
Overview/history workspace + wizard polish
              ↓
PWA manifest/service worker + offline notice
              ↓
Accessibility checks + complete Playwright verification
```

## Task List

### Task 1: Define navigation and app-copy contracts

**Files:**

- Create: `apps/web/src/shared/navigation/navigation.ts`
- Create: `apps/web/src/shared/navigation/navigation.test.ts`
- Modify: `packages/app-i18n/src/data/elements.json`
- Modify: `packages/app-i18n/src/data/translations/en-US.json`
- Modify: `packages/app-i18n/src/data/translations/es-MX.json`

**Interfaces:**

- Produces `PrimaryDestination`, `primaryDestinations`, and `getActiveDestination(pathname, search = '')` for the shell and browser tests.
- Produces visible keys under `navigation.*` and stable IDs under `navigation.*`.

- [ ] **Step 1: Write the failing tests**

Add tests that require the four destinations and route matching:

```ts
it('exposes the four app destinations in stable order', () => {
  expect(primaryDestinations.map((item) => item.id)).toEqual([
    'home',
    'quotes',
    'newQuote',
    'account',
  ]);
});

it('marks the history route as Quotes and the workspace route as Home', () => {
  expect(getActiveDestination('/quotes', '')).toBe('home');
  expect(getActiveDestination('/quotes/history', '')).toBe('quotes');
  expect(getActiveDestination('/quote/personal', '')).toBe('newQuote');
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
bun run --filter web test --run src/shared/navigation/navigation.test.ts
```

Expected: FAIL because the navigation module does not exist.

- [ ] **Step 3: Implement the navigation contract**

Use a readonly model with paths and i18n/test-ID keys:

```ts
export const primaryDestinations = [
  {
    id: 'home',
    path: '/quotes',
    labelKey: 'navigation.home',
    testIdKey: 'navigation.home',
  },
  {
    id: 'quotes',
    path: '/quotes/history',
    labelKey: 'navigation.quotes',
    testIdKey: 'navigation.quotes',
  },
  {
    id: 'newQuote',
    path: '/quote/personal',
    labelKey: 'navigation.newQuote',
    testIdKey: 'navigation.newQuote',
  },
  {
    id: 'account',
    path: '/account',
    labelKey: 'navigation.account',
    testIdKey: 'navigation.account',
  },
] as const;

export type PrimaryDestination = (typeof primaryDestinations)[number]['id'];

export function getActiveDestination(pathname: string): PrimaryDestination {
  if (pathname.startsWith('/quote/')) return 'newQuote';
  if (pathname.startsWith('/quotes/history')) return 'quotes';
  if (pathname.startsWith('/account')) return 'account';
  return 'home';
}
```

Add English and Spanish copy for destination labels, account headings/actions, offline text, and the compact shell title. Add matching `elements.json` entries so `tid()` remains the only test-ID exposure.

- [ ] **Step 4: Run the focused tests and i18n validation**

Run:

```bash
bun run --filter web test --run src/shared/navigation/navigation.test.ts
bun run --filter @clara/app-i18n test --run
node packages/app-i18n/src/validate.mjs
```

Expected: all pass with no missing locale keys or test-ID references.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/navigation packages/app-i18n/src/data
git commit -m "feat(web): define app navigation contract"
```

### Task 2: Replace the website-like shell with responsive app navigation

**Files:**

- Create: `apps/web/src/shared/components/AppNavigation.tsx`
- Create: `apps/web/src/shared/components/AppNavigation.test.tsx`
- Modify: `apps/web/src/shared/components/AppShell.tsx`
- Modify: `apps/web/src/shared/components/AppShell.test.tsx`
- Modify: `apps/web/src/app/routes.tsx`

**Interfaces:**

- Consumes `primaryDestinations` and `getActiveDestination` from Task 1.
- Produces an authenticated responsive shell with desktop navigation rail and mobile bottom navigation.

- [ ] **Step 1: Write failing component tests**

Test the behavior, not MUI implementation details:

```tsx
it('renders primary destinations with accessible names and active state', () => {
  renderNavigation('/quotes/history');

  expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
    'href',
    '/quotes'
  );
  expect(screen.getByRole('link', { name: /quotes/i })).toHaveAttribute(
    'aria-current',
    'page'
  );
  expect(screen.getByRole('link', { name: /new quote/i })).toHaveAttribute(
    'href',
    '/quote/personal'
  );
});

it('renders bottom navigation as a labeled navigation landmark', () => {
  renderNavigation('/quotes');

  expect(
    screen.getByRole('navigation', { name: /primary navigation/i })
  ).toBeVisible();
});
```

Update `AppShell.test.tsx` to require the main landmark, authenticated navigation, no sign-out control on login, and no duplicated full footer controls in the main authenticated chrome.

- [ ] **Step 2: Run tests and confirm RED**

```bash
bun run --filter web test --run src/shared/components/AppNavigation.test.tsx src/shared/components/AppShell.test.tsx
```

Expected: FAIL because the responsive navigation does not exist and the shell still renders the old stacked header controls.

- [ ] **Step 3: Implement the responsive navigation and shell**

Use MUI `BottomNavigation`/`BottomNavigationAction` for the mobile destination bar and a compact `Box`/`List` rail for desktop. Both views must use the same destination model, `aria-current="page"`, visible labels, and `Link` navigation. Keep the skip link and main landmark. Render the authenticated navigation only when `isAuthenticated` is true; keep login outside it.

The shell layout must reserve bottom space on mobile:

```tsx
<Box sx={{ pb: { xs: 'calc(72px + env(safe-area-inset-bottom))', md: 0 } }}>
  {children}
</Box>
<Box component="nav" aria-label={t('navigation.primary')} sx={{ display: { xs: 'block', md: 'none' } }}>
  <BottomNavigation showLabels value={activeDestination}>
    {/* BottomNavigationAction entries use Link components and stable tid() values. */}
  </BottomNavigation>
</Box>
```

Make the desktop header compact: brand, current context, secure-session indicator, and account trigger. Move language/sign-out interactions to Task 3. Keep support/privacy content available from Account rather than repeating a large marketing footer on every page.

- [ ] **Step 4: Run focused tests and lint**

```bash
bun run --filter web test --run src/shared/components/AppNavigation.test.tsx src/shared/components/AppShell.test.tsx
bun run --filter web lint
```

Expected: focused tests pass and lint reports zero errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/components/AppNavigation.tsx apps/web/src/shared/components/AppNavigation.test.tsx apps/web/src/shared/components/AppShell.tsx apps/web/src/shared/components/AppShell.test.tsx apps/web/src/app/routes.tsx
git commit -m "feat(web): add app-first responsive navigation"
```

### Task 3: Consolidate language, account, security, and sign-out actions

**Files:**

- Create: `apps/web/src/shared/components/AccountMenu.tsx`
- Create: `apps/web/src/shared/components/AccountMenu.test.tsx`
- Create: `apps/web/src/pages/AccountPage.tsx`
- Create: `apps/web/src/pages/AccountPage.test.tsx`
- Modify: `apps/web/src/app/routes.tsx`
- Modify: `apps/web/src/shared/components/AppShell.tsx`

**Interfaces:**

- Consumes `useAuth`, i18n locale state, and navigation contract from Tasks 1–2.
- Produces `/account` with language, session, security/support copy, and sign-out behavior.

- [ ] **Step 1: Write failing tests**

Require keyboard-operable account behavior:

```tsx
it('opens the account surface and exposes language and sign-out actions', async () => {
  const user = userEvent.setup();
  renderAuthenticatedShell('/quotes');

  await user.click(screen.getByRole('button', { name: /account/i }));

  expect(screen.getByRole('menuitem', { name: /español/i })).toBeVisible();
  expect(screen.getByRole('menuitem', { name: /sign out/i })).toBeVisible();
});
```

The Account page test must verify that selecting Spanish changes visible copy without changing the route and that sign-out invokes the injected `logout` function.

- [ ] **Step 2: Run tests and confirm RED**

```bash
bun run --filter web test --run src/shared/components/AccountMenu.test.tsx src/pages/AccountPage.test.tsx
```

Expected: FAIL because the account surface and route do not exist.

- [ ] **Step 3: Implement the account boundary**

Use one MUI `Menu` from the compact header at supported widths plus the `/account` destination page; both surfaces consume the same i18n keys and auth callbacks rather than duplicating account logic. The menu must have `aria-haspopup`, controlled `open`, focus restoration to its trigger, and `MenuItem` controls. Language changes call `i18n.changeLanguage(locale)` and sign-out calls `void logout()`.

The Account page should show only:

- Current language and two locale buttons with `aria-pressed`.
- Secure-session/passkey status.
- Support and privacy/security copy.
- Sign-out as the single destructive/session-ending action.

- [ ] **Step 4: Run focused tests, build typecheck, and lint**

```bash
bun run --filter web test --run src/shared/components/AccountMenu.test.tsx src/pages/AccountPage.test.tsx src/shared/components/AppShell.test.tsx
bun run --filter web lint
bun run --filter web build
```

Expected: all focused tests pass, lint has zero errors, and the build succeeds.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/components/AccountMenu.tsx apps/web/src/shared/components/AccountMenu.test.tsx apps/web/src/pages/AccountPage.tsx apps/web/src/pages/AccountPage.test.tsx apps/web/src/app/routes.tsx apps/web/src/shared/components/AppShell.tsx
git commit -m "feat(web): consolidate account actions"
```

### Task 4: Make Home and Quotes purposeful without adding a backend query

**Files:**

- Modify: `apps/web/src/pages/QuotesListPage.tsx`
- Modify: `apps/web/src/pages/QuotesListPage.test.tsx`
- Modify: `apps/web/src/app/routes.tsx`
- Modify: `packages/app-i18n/src/data/elements.json`
- Modify: `packages/app-i18n/src/data/translations/en-US.json`
- Modify: `packages/app-i18n/src/data/translations/es-MX.json`

**Interfaces:**

- Consumes the existing `listQuotes()` query and `QuotesListPage` data shape.
- Produces `QuotesListPage({ view?: 'overview' | 'history' })`, with `/quotes` as overview and `/quotes/history` as history focus.

- [ ] **Step 1: Write failing tests**

Add tests for the two presentation modes:

```tsx
it('shows the overview action and concise metrics on the Home destination', async () => {
  renderQuotesPage({ view: 'overview', quotes: [submittedQuote] });

  expect(screen.getByRole('button', { name: /start a quote/i })).toBeVisible();
  expect(screen.getByText(/quote summary/i)).toBeVisible();
});

it('shows quote history as a focused list on the Quotes destination', async () => {
  renderQuotesPage({ view: 'history', quotes: [submittedQuote] });

  expect(
    screen.getByRole('heading', { name: /your quote history/i })
  ).toBeVisible();
  expect(screen.queryByText(/portfolio/i)).not.toBeInTheDocument();
});
```

Add loading, empty, and retry assertions that require stable content dimensions and `role="status"`/accessible labels.

- [ ] **Step 2: Run tests and confirm RED**

```bash
bun run --filter web test --run src/pages/QuotesListPage.test.tsx
```

Expected: FAIL because the page has no `view` prop and cannot separate overview from history.

- [ ] **Step 3: Implement the two views with shared query state**

Keep the existing `useQuery({ queryKey: ['quotes'], queryFn: listQuotes })` call. Add a `view` prop defaulting to `overview`, render the summary metrics only in overview, and render the full history section in both modes with the history mode prioritizing it. Update route elements:

```tsx
{ path: 'quotes', element: <QuotesListPage view="overview" /> },
{ path: 'quotes/history', element: <QuotesListPage view="history" /> },
```

Use existing `Surface` and typography tokens. Do not add modal quote details or a second API endpoint. Keep the empty state’s single `Start a quote` action and keep retry adjacent to the failed query.

- [ ] **Step 4: Run component tests, i18n validation, and build**

```bash
bun run --filter web test --run src/pages/QuotesListPage.test.tsx
node packages/app-i18n/src/validate.mjs
bun run --filter web build
```

Expected: all tests pass, translations validate, and the production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/pages/QuotesListPage.tsx apps/web/src/pages/QuotesListPage.test.tsx apps/web/src/app/routes.tsx packages/app-i18n/src/data
git commit -m "feat(web): clarify home and quote history views"
```

### Task 5: Simplify wizard framing, skeletons, and mobile actions

**Files:**

- Create: `apps/web/src/shared/components/LoadingState.tsx`
- Create: `apps/web/src/shared/components/LoadingState.test.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/WizardFrame.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/WizardProgress.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/WizardActionDock.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/WizardFrame.test.tsx`
- Modify: `apps/web/src/features/quote-wizard/steps/summary/SummaryStep.tsx`
- Modify: `apps/web/src/features/quote-wizard/steps/summary/SubmissionResult.tsx`

**Interfaces:**

- Consumes existing wizard context and submission state.
- Produces a single focused content card per stage, compact progress semantics, stable skeletons, and mobile actions that sit above bottom navigation.

- [ ] **Step 1: Write failing tests**

Add behavior tests:

```tsx
it('announces the active wizard stage and leaves the heading focusable', () => {
  renderWizardFrame({ activeStep: 1 });

  expect(
    screen.getByText(/coverage selection/i).closest('[aria-current="step"]')
  ).not.toBeNull();
  expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute(
    'tabindex',
    '-1'
  );
});

it('renders loading content with stable status semantics', () => {
  render(<LoadingState label="Loading quotes" />);

  expect(screen.getByRole('status', { name: /loading quotes/i })).toBeVisible();
});
```

Update summary tests to require both post-submit actions and a retry action that remains visible after an insurer failure.

- [ ] **Step 2: Run tests and confirm RED**

```bash
bun run --filter web test --run src/shared/components/LoadingState.test.tsx src/features/quote-wizard/components/WizardFrame.test.tsx src/features/quote-wizard/steps/summary/SubmissionResult.test.tsx
```

Expected: FAIL for the new loading component and compact progress semantics.

- [ ] **Step 3: Implement minimal focused wizard primitives**

`LoadingState` must render a semantic status plus a skeleton layout without replacing the page heading. `WizardFrame` should own one content surface and one optional desktop reassurance surface. `WizardProgress` should expose the active stage through text and `aria-current`, while retaining the existing `tid('wizard.progress')`. `WizardActionDock` must use `bottom` padding that accounts for both its own safe area and the bottom navigation reserve.

Keep summary actions explicit:

```tsx
<WizardActionDock>
  <Button onClick={() => void navigate('/quote/coverage')}>
    {t('common.back')}
  </Button>
  <Button
    variant="contained"
    onClick={submit}
    data-testid={tid('wizard.summary.submit')}
  >
    {t('wizard.summary.submit')}
  </Button>
</WizardActionDock>
```

Do not change submission API calls or pricing behavior.

- [ ] **Step 4: Run wizard tests, full web tests, and lint**

```bash
bun run --filter web test --run src/shared/components/LoadingState.test.tsx src/features/quote-wizard/components src/features/quote-wizard/steps/summary
bun run --filter web test --run
bun run --filter web lint
```

Expected: all web tests pass, lint has zero errors, and no existing test ID changes are required.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/components/LoadingState.tsx apps/web/src/shared/components/LoadingState.test.tsx apps/web/src/features/quote-wizard/components apps/web/src/features/quote-wizard/steps/summary
git commit -m "feat(web): simplify wizard feedback and actions"
```

### Task 6: Add safe offline status and installable PWA output

**Files:**

- Modify: `apps/web/package.json`
- Modify: `bun.lock`
- Modify: `apps/web/vite.config.ts`
- Modify: `apps/web/index.html`
- Create: `apps/web/src/pwa/register.ts`
- Create: `apps/web/src/pwa/register.test.ts`
- Create: `apps/web/src/pwa/check-build.mjs`
- Create: `apps/web/src/shared/components/OfflineNotice.tsx`
- Create: `apps/web/src/shared/components/OfflineNotice.test.tsx`
- Create: `apps/web/public/icons/clara-192.svg`
- Create: `apps/web/public/icons/clara-512.svg`
- Modify: `apps/web/src/main.tsx`
- Modify: `apps/web/src/shared/components/AppShell.tsx`

**Interfaces:**

- Produces `dist/manifest.webmanifest`, `dist/sw.js`, and static icon assets through Vite.
- Produces a browser `OfflineNotice` that reflects `navigator.onLine` and listens to `online`/`offline` events.
- Uses `vite-plugin-pwa` 1.3.x; the plugin supports Vite 5+ and generates a manifest/service worker through the `VitePWA` plugin. See [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) and its [React integration](https://vite-pwa-org.netlify.app/frameworks/react).

- [ ] **Step 1: Write failing tests and build assertions**

Add a component test:

```tsx
it('announces that connectivity is required for account mutations', () => {
  setNavigatorOnline(false);
  render(<OfflineNotice />);

  expect(screen.getByRole('status')).toHaveTextContent(
    /connection is required/i
  );
});
```

Add a production-check script at `apps/web/src/pwa/check-build.mjs` that exits nonzero unless these files exist after build:

```js
import { existsSync } from 'node:fs';

const dist = new URL('../../dist/', import.meta.url);
const required = [
  'manifest.webmanifest',
  'sw.js',
  'icons/clara-192.svg',
  'icons/clara-512.svg',
];
const missing = required.filter((file) => !existsSync(new URL(file, dist)));
if (missing.length > 0) {
  console.error(`Missing PWA artifacts: ${missing.join(', ')}`);
  process.exit(1);
}
```

- [ ] **Step 2: Run tests and confirm RED**

```bash
bun run --filter web test --run src/shared/components/OfflineNotice.test.tsx src/pwa/register.test.ts
```

Expected: FAIL because the offline notice, PWA registration module, and build artifacts do not exist.

- [ ] **Step 3: Add the PWA configuration and offline boundary**

Install the documented plugin with the workspace package manager:

```bash
bun add --cwd apps/web -d vite-plugin-pwa@^1.3.0
```

Configure `apps/web/vite.config.ts`:

```ts
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  registerType: 'autoUpdate',
  devOptions: { enabled: false },
  includeAssets: ['icons/clara-192.svg', 'icons/clara-512.svg'],
  manifest: {
    name: 'Clara Insurance Quotes',
    short_name: 'Clara Quotes',
    start_url: '/quotes',
    display: 'standalone',
    theme_color: '#1D1D1F',
    background_color: '#FBFBFD',
    icons: [
      {
        src: '/icons/clara-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
      {
        src: '/icons/clara-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,svg,woff2}'],
    navigateFallback: '/index.html',
    navigateFallbackDenylist: [/^\/api/],
  },
});
```

Register the generated worker once from `main.tsx` through `src/pwa/register.ts`. Do not add runtime caching rules for `/api`. Render `OfflineNotice` in the authenticated shell and keep all mutation buttons enabled only according to their request state; the notice explains that connectivity is required rather than pretending mutations are offline-capable.

Use the existing app name and Emme palette in `index.html` metadata. Vite copies files in `public` to the production output unchanged, so root-relative icon paths remain stable; see [Vite static assets](https://vite.dev/guide/assets.html).

- [ ] **Step 4: Run tests, build, and PWA artifact check**

```bash
bun run --filter web test --run src/shared/components/OfflineNotice.test.tsx src/pwa/register.test.ts
bun run --filter web build
cd apps/web && node src/pwa/check-build.mjs
```

Expected: tests pass, the build succeeds, and all four PWA artifacts exist. Use the production build only for service-worker verification; keep development HMR unchanged.

- [ ] **Step 5: Commit**

```bash
git add apps/web/package.json bun.lock apps/web/vite.config.ts apps/web/index.html apps/web/src/pwa apps/web/src/shared/components/OfflineNotice.tsx apps/web/src/shared/components/OfflineNotice.test.tsx apps/web/src/main.tsx apps/web/src/shared/components/AppShell.tsx apps/web/public/icons
git commit -m "feat(web): add safe installable PWA shell"
```

### Task 7: Add accessibility and responsive browser coverage for the app shell

**Files:**

- Create: `e2e/tests/app-navigation.spec.ts`
- Create: `e2e/tests/app-accessibility.spec.ts`
- Modify: `e2e/tests/responsive-layout.spec.ts`
- Modify: `e2e/tests/dashboard-responsive.spec.ts`
- Modify: `e2e/support/session.ts`
- Inspect: `e2e/package.json` to reuse the existing Playwright scripts; no dependency change is planned

**Interfaces:**

- Consumes the stable `tid()` selectors from Tasks 1–6 and the existing `E2E_BASE_URL` setup.
- Produces browser evidence for navigation, keyboard focus, route preservation, PWA metadata, and mobile safe-area behavior.

- [ ] **Step 1: Write the failing browser tests**

Add desktop and mobile scenarios:

```ts
test('authenticated user can navigate the app destinations', async ({
  page,
}) => {
  await login(page);
  await expect(page.getByTestId(tid('navigation.home'))).toHaveAttribute(
    'aria-current',
    'page'
  );
  await page.getByTestId(tid('navigation.quotes')).click();
  await expect(page).toHaveURL(/\/quotes\/history$/);
  await page.getByTestId(tid('navigation.newQuote')).click();
  await expect(page).toHaveURL(/\/quote\/personal$/);
});

test('mobile navigation remains visible without covering wizard actions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await login(page);
  await page.goto(`${baseUrl}/quote/personal`);
  await expect(
    page.getByRole('navigation', { name: /primary navigation/i })
  ).toBeVisible();
  await expect(page.getByTestId(tid('wizard.actions'))).toBeVisible();
  expect(
    await page
      .locator('body')
      .evaluate((body) => body.scrollWidth <= window.innerWidth)
  ).toBe(true);
});
```

Add accessibility assertions for one h1 per page, named navigation landmarks, `aria-current`, focus visibility after route changes, and account menu keyboard escape. Add a metadata check for `link[rel="manifest"]` and `meta[name="theme-color"]`.

- [ ] **Step 2: Run the new tests and confirm RED**

```bash
E2E_BASE_URL=http://localhost:3100 bun run e2e -- --grep "app destinations|mobile navigation|accessibility|manifest"
```

Expected: FAIL until the new routes, stable navigation selectors, and PWA metadata are implemented.

- [ ] **Step 3: Implement only test-enabling adjustments**

Add stable `tid()` values at navigation behavior boundaries, not on decorative wrappers. Update the existing responsive assertions to tolerate the new shell while retaining no-overflow and action-dock checks. Do not weaken assertions about quote submission, pricing, or same-origin API requests.

- [ ] **Step 4: Run the focused browser suite at all target widths**

```bash
E2E_BASE_URL=http://localhost:3100 bun run e2e -- --grep "app destinations|mobile navigation|accessibility|manifest" --retries=0
```

Expected: focused desktop/mobile navigation and accessibility tests pass with no application console errors.

- [ ] **Step 5: Commit**

```bash
git add e2e/tests/app-navigation.spec.ts e2e/tests/app-accessibility.spec.ts e2e/tests/responsive-layout.spec.ts e2e/tests/dashboard-responsive.spec.ts e2e/support/session.ts e2e/package.json
git commit -m "test(web): verify app navigation and accessibility"
```

### Task 8: Run complete regression verification and document the UX handoff

**Files:**

- Modify: `tasks/todo.md`
- Modify: `tasks/lessons.md`
- Modify: `README.md` to document the new routes, PWA build check, and local install verification

- [ ] **Step 1: Run the complete frontend test, lint, build, and PWA checks**

```bash
bun run --filter web test --run
bun run --filter web lint
bun run --filter web build
cd apps/web && node src/pwa/check-build.mjs
```

Expected: zero test failures, zero lint errors, successful production build, and all PWA artifacts present.

- [ ] **Step 2: Run all existing and new Playwright journeys**

```bash
E2E_BASE_URL=http://localhost:3100 bun run e2e -- --retries=0
```

Expected: standard, senior-health, diabetes/hypertension pricing, insurer retry, passkey, responsive, navigation, and accessibility journeys pass on desktop/mobile projects.

- [ ] **Step 3: Perform a manual production-browser check**

Serve the built `apps/web/dist` through the existing Nginx/full-stack Compose path and verify:

1. Login renders without authenticated navigation.
2. `/quotes` opens Home and `/quotes/history` opens Quotes.
3. Bottom navigation is visible at 375px and does not cover wizard actions.
4. Account language switching and sign-out work.
5. Successful submit offers all-quotes and new-quote actions.
6. Browser Application/Manifest inspection shows standalone metadata and the service worker.
7. Going offline shows the notice while API mutations remain unsuccessful and clearly recoverable.

- [ ] **Step 4: Update the task records with evidence**

Record exact counts and known non-blocking warnings in `tasks/todo.md`. Add durable lessons only for discoveries that will prevent future regressions, such as PWA API-cache boundaries or fixed-navigation safe-area handling.

- [ ] **Step 5: Commit and push the completed implementation**

```bash
git add tasks/todo.md tasks/lessons.md README.md
git commit -m "docs(web): record app-first PWA verification"
git push origin feat-frontend
git log --oneline origin/feat-frontend -1
```

## Checkpoints

### Checkpoint A: After Tasks 1–3

- Navigation contract tests pass.
- Desktop rail, mobile bottom navigation, account menu, and `/account` route are keyboard-operable.
- Existing login and authenticated shell tests remain green.

### Checkpoint B: After Tasks 4–6

- Home/history views use the same quote query.
- Wizard skeletons and actions remain stable at mobile widths.
- Production build emits manifest, service worker, and icons without API runtime caching.

### Checkpoint C: After Tasks 7–8

- Full frontend tests, lint, build, PWA checks, and Playwright suite pass.
- No horizontal overflow exists at target widths.
- The final app has clean console output on critical journeys.

## Risks and mitigations

| Risk                                                | Impact | Mitigation                                                                                                |
| --------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| Two destinations share quote data                   | Medium | Use one TanStack Query key and explicit presentation modes; no duplicate endpoint                         |
| Fixed mobile navigation overlaps wizard actions     | High   | Reserve shell bottom space, add safe-area padding, and assert bounding rectangles at 320/375px            |
| Service worker serves stale/private API data        | High   | Precache only static assets, denylist `/api` navigations, and do not add API runtime caching              |
| New PWA dependency changes lockfile/build behavior  | Medium | Pin the compatible major, run build/artifact check in the same task, and keep dev service worker disabled |
| App shell changes break stable Playwright selectors | Medium | Keep `tid()` keys stable and add navigation tests before modifying shell markup                           |
| Account menu creates focus traps or lost focus      | Medium | Use MUI Menu semantics, test Escape/Tab behavior, and restore focus to the trigger                        |
| PWA install prompt is unavailable in some browsers  | Low    | Verify manifest/service-worker output and provide an installable shell without relying on a custom prompt |

## External references

- [MUI Bottom Navigation](https://mui.com/material-ui/react-bottom-navigation/)
- [MUI BottomNavigation API](https://mui.com/material-ui/api/bottom-navigation/)
- [Vite static asset handling](https://vite.dev/guide/assets.html)
- [Vite production build](https://vite.dev/guide/build)
- [vite-plugin-pwa repository and Vite compatibility](https://github.com/vite-pwa/vite-plugin-pwa)
- [vite-plugin-pwa React integration](https://vite-pwa-org.netlify.app/frameworks/react)

## Definition of Done

- [ ] All tasks completed with focused tests written before implementation.
- [x] App shell is minimal, responsive, and navigable from desktop and mobile.
- [x] Home, Quotes, New quote, and Account destinations are reachable and visibly active.
- [x] Loading, empty, error, retry, success, and offline states are stable and accessible.
- [x] PWA manifest, service worker, icons, and production artifact checks pass.
- [x] Existing quote pricing, health-condition behavior, authentication, API contracts, and Playwright journeys remain green.
- [x] No application console errors occur in critical browser flows.
- [x] Changes are committed in logical units and pushed to `origin/feat-frontend`.

## Post-review hardening

The final whole-branch review identified follow-up correctness and operability work before this plan can be considered complete:

- [x] **Hardening A: guarantee coverage synchronization before advancing.** The coverage step awaits or flushes the latest debounced update before navigation; fake-timer and browser regressions cover the fast-selection/Next race. Server-owned premium calculation remains authoritative, including diabetes and hypertension factors.
- [x] **Hardening B: complete accessibility and feedback boundaries.** The app renders an accessible submitting state, focuses new route headings after navigation, synchronizes `<html lang>` with the selected locale, and keeps the authenticated footer clear of fixed mobile navigation with geometry coverage.
- [x] **Hardening C: enforce guarantees in CI and docs.** GitHub Actions now runs app navigation/accessibility/dashboard/PWA preview/artifact checks; PWA description/Apple metadata are enforced; README documents 320/375/768/1024/1440.
- [x] **Hardening D: close final review findings.** CI installs Chromium through the exact workspace Playwright version, committed Vite defaults use same-origin `/api`, generated JavaScript rejects the old localhost API base, and coverage/health radio and checkbox groups have localized programmatic names.
