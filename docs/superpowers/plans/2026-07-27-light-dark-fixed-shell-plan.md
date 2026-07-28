# Light/Dark Fixed Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with TDD and verification checkpoints.

**Goal:** Replace the charcoal-only treatment with clearer light/dark surface boundaries, a fixed authenticated header and desktop icon rail, and an accessible persistent theme toggle.

**Architecture:** Keep the existing React/MUI shell and routes. Add a small theme-preference provider that owns `light | dark` state and creates the MUI theme from semantic mode tokens; keep navigation presentation in `AppNavigation` and shell offsets in `AppShell`. Mobile retains the existing bottom navigation and safe-area behavior.

**Tech Stack:** React 19, TypeScript, MUI 6, React Router, i18next, Vitest, Testing Library, Playwright, Bun.

## Global Constraints

- Initial mode follows `prefers-color-scheme` when no user preference exists.
- An explicit toggle stores `light` or `dark` in local storage and applies it without changing routes or server state.
- Header is fixed at the top; desktop navigation is fixed below it; main content receives matching offsets.
- Mobile retains fixed bottom navigation, safe-area offsets, and wizard action clearance.
- Preserve routes, API/auth/pricing behavior, i18n structure, stable `tid()` selectors, focus management, and PWA behavior.
- Do not add dependencies, raw component colors, generated MUI selectors, or backend changes.
- Do not edit or stage the pre-existing `apps/web/index.html` working-tree change.
- Every implementation slice follows RED → GREEN → REFACTOR and is committed independently.

## File Map

- Create `apps/web/src/shared/theme/colorMode.tsx` and its test: theme context, system preference, persistence.
- Modify `apps/web/src/shared/theme/theme.ts`, `main.tsx`: mode-aware MUI theme composition.
- Create `apps/web/src/shared/components/ThemeToggle.tsx` and its test.
- Modify `AppShell.tsx`, `AppNavigation.tsx`, and colocated tests: fixed geometry and icon-led desktop rail.
- Modify both translation JSON files: theme labels.
- Modify widget styles/tests only where needed for semantic mode-aware boundaries.
- Modify the three existing E2E shell suites for both-mode geometry and contrast.

---

### Task 1: Add tested color-mode state and mode-aware theme tokens

**Files:** Create `apps/web/src/shared/theme/colorMode.tsx`, `apps/web/src/shared/theme/colorMode.test.tsx`, `apps/web/src/shared/theme/theme.test.ts`; modify `apps/web/src/shared/theme/theme.ts` and `apps/web/src/main.tsx`.

**Interfaces:** `ColorMode = 'light' | 'dark'`; `createAppTheme(mode: ColorMode): Theme`; `useColorMode(): { mode: ColorMode; setMode(mode: ColorMode): void; toggleMode(): void }`. Use storage key `clara.color-mode`.

- [x] **Step 1: Write the failing tests.** Test that no stored value plus `matchMedia().matches === true` resolves to `dark`, invalid storage resolves to `light` when the system is light, and toggling persists the new value.

```tsx
it('uses the system preference and persists an explicit choice', async () => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true });
  const user = userEvent.setup();
  render(<ColorModeProbe />);
  expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
  await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
  expect(localStorage.getItem('clara.color-mode')).toBe('light');
});
```

- [x] **Step 2: Verify RED.** Run `bun run --filter web test --run src/shared/theme/colorMode.test.tsx src/shared/theme/theme.test.ts`; missing-provider/factory failures confirmed.

- [x] **Step 3: Implement the minimum.** Move the current theme configuration behind `createAppTheme(mode)` and use these exact semantic tokens: light canvas `#F4F6F8`, surface `#FFFFFF`, raised `#E9EDF2`, border `#CBD3DD`, text `#171A1F`, shell `#151A20`; dark canvas `#101419`, surface `#1A2028`, raised `#232C36`, border `#3A4653`, text `#F3F6F8`, shell `#0B0F13`. The provider initializes from storage, then `matchMedia('(prefers-color-scheme: dark)')`, then light; it updates `document.documentElement.dataset.theme` and `color-scheme`.

- [x] **Step 4: Verify GREEN.** Run `bun run --filter web test --run src/shared/theme/colorMode.test.tsx src/shared/theme/theme.test.ts src/pwa/check-build.test.ts`; 12 tests passed.

- [x] **Step 5: Refactor and commit.** Committed as `feat(web): add persistent light dark theme state`.

### Task 2: Add translated accessible theme toggle

**Files:** Create `apps/web/src/shared/components/ThemeToggle.tsx` and test; modify `packages/app-i18n/src/data/translations/en-US.json` and `es-MX.json`.

**Interface:** `ThemeToggle` has no props, consumes `useColorMode()`, renders one keyboard-accessible button with visible current-mode text, a decorative sun/moon SVG, and `aria-label={t('layout.theme.toggle')}`.

- [x] **Step 1: Write the failing test.** Add `layout.theme.toggle`, `.light`, and `.dark` in the test fixture expectation and assert the button changes visible text and storage without changing the URL.

```tsx
it('shows and toggles the current mode', async () => {
  const user = userEvent.setup();
  render(<ThemeToggle />);
  await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
  expect(
    screen.getByRole('button', { name: 'Toggle theme' })
  ).toHaveTextContent('Dark');
});
```

- [x] **Step 2: Verify RED.** Run `bun run --filter web test --run src/shared/components/ThemeToggle.test.tsx`; missing component failure confirmed.

- [x] **Step 3: Implement the toggle.** Use MUI `Button` and `SvgIcon`; keep the SVG `aria-hidden`, preserve focus, use translated English/Spanish labels, and place no server or route behavior in the component.

- [x] **Step 4: Verify GREEN.** Theme test passed and `bun run --filter @clara/app-i18n validate` passed; the initial unscoped filter was corrected to the package name.

- [x] **Step 5: Refactor and commit.** Committed as `feat(web): add accessible theme toggle`.

### Task 3: Build fixed header and icon-led desktop rail

**Files:** Modify `apps/web/src/shared/components/AppShell.tsx`, `AppNavigation.tsx`, and their colocated tests.

**Interface:** Preserve `banner`, `main`, `contentinfo`, `navigation`, `aria-current`, skip link, account menu, route focus, and all existing `tid('navigation.*')` values. Add stable `data-shell-mode` and `data-shell-position="fixed"` attributes for browser contracts.

- [x] **Step 1: Write failing tests.** Assert the authenticated banner has fixed-position mode, desktop nav has the fixed-position attribute, every desktop destination contains an SVG, and the theme toggle is visible.

```tsx
expect(
  screen.getByRole('navigation', { name: /primary navigation/i })
).toHaveAttribute('data-shell-position', 'fixed');
expect(
  screen.getByTestId(tid('navigation.home')).querySelector('svg')
).not.toBeNull();
```

- [x] **Step 2: Verify RED.** Run `bun run --filter web test --run src/shared/components/AppShell.test.tsx src/shared/components/AppNavigation.test.tsx`; fixed/mode contract failures confirmed.

- [x] **Step 3: Implement fixed geometry.** Use header height `72px` desktop/`64px` mobile and rail width `224px`. Set the authenticated header fixed at top, desktop rail fixed from `top: 72px` to bottom, and give main/footer matching top/left offsets. Add the existing `NavigationIcon` to desktop list buttons, keep mobile bottom navigation unchanged, and mount `ThemeToggle` in the authenticated header.

- [x] **Step 4: Verify GREEN.** Focused shell/toggle tests passed 8/8; full web suite remains scheduled for Task 4/5 after widget migration.

- [x] **Step 5: Refactor and commit.** Committed as `feat(web): fix shell header and icon navigation`.

### Task 4: Apply visible light/dark widget boundaries

**Files:** Modify `theme.ts`, `QuotesListPage.tsx`, `AccountPage.tsx`, `WizardFrame.tsx`, `PremiumDisplay.tsx`, `LoadingState.tsx`, and `ApiErrorAlert.tsx`; extend their existing tests.

- [x] **Step 1: Write failing assertions.** Render representative loading, error, premium, account, and quote surfaces in both themes and assert `data-widget-tone` plus a non-empty 1px border.

```tsx
it('keeps a visible boundary in dark mode', () => {
  renderWithTheme(<LoadingState label="Loading" />, 'dark');
  expect(screen.getByRole('status')).toHaveAttribute(
    'data-widget-tone',
    'loading'
  );
  expect(getComputedStyle(screen.getByRole('status')).borderTopWidth).toBe(
    '1px'
  );
});
```

- [x] **Step 2: Verify RED.** Affected suites failed on the absent `data-widget-boundary="outlined"` contract before implementation.

- [x] **Step 3: Implement semantic surfaces.** Replace old charcoal-only alpha fills with `background.default`, `background.paper`, raised surface, and active `divider` tokens. Keep existing status roles, visible text, icons, `data-widget-tone`, routes, API calls, and selectors unchanged. Use borders as the primary boundary and subtle shadows only as secondary depth.

- [x] **Step 4: Verify GREEN.** 31 files/109 web tests passed; lint has 0 errors and 4 Fast Refresh warnings; production build passed with the existing Vite chunk advisory.

- [x] **Step 5: Refactor and commit.** Committed as `refactor(web): clarify light dark widget surfaces`.

### Task 5: Verify both themes and responsive journeys

**Files:** Modify `e2e/tests/app-accessibility.spec.ts`, `app-navigation.spec.ts`, `dashboard-responsive.spec.ts`, and `tasks/todo.md`.

- [x] **Step 1: Write failing browser assertions.** Added fixed banner/rail, visible theme toggle, `html[data-theme]` persistence/system-preference, exact mode-safe shell contrast, mode propagation, and no overflow/action-dock overlap at 320/375/768/1024/1440px.

```ts
await expect(page.getByRole('banner')).toHaveAttribute(
  'data-shell-position',
  'fixed'
);
await page.getByRole('button', { name: 'Toggle theme' }).press('Enter');
await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
```

- [x] **Step 2: Verify RED.** The new contract initially failed against the stale running web image because `html[data-theme]` was absent; rebuilding the web image supplied the current source bundle for GREEN verification.

- [x] **Step 3: Implement only browser contracts.** Verified computed shell contrast in light mode and dark mode, fixed geometry, keyboard focus, system preference, persistence, no console/page errors, and preserved all quote/pricing/passkey/retry/submission assertions.

- [x] **Step 4: Complete verification.** Run:

```bash
bun run --filter web test --run
bun run --filter web lint
bun run --filter web build
bun run --filter e2e build
bun run --filter e2e lint
E2E_PWA_PREVIEW_PORT=43105 bun run --filter e2e test:pwa-preview
E2E_BASE_URL=http://localhost:3100 bun run e2e -- --retries=0
```

Evidence: web tests 31 files/109 tests passed; web lint 0 errors with 4 existing Fast Refresh warnings; web production build passed with the existing chunk advisory; E2E build/lint passed; PWA preview passed 1/1; focused shell browser matrix passed 15/15; complete integrated Playwright suite passed 30/30. The static PWA checker reports only the pre-existing Apple metadata limitation; `apps/web/index.html` remained untouched and unstaged.

- [x] **Step 5: Update checklist and commit.** Updated the plan and `tasks/todo.md`; the browser-contract changes will be committed as `test(web): verify light dark fixed shell` and pushed after final review.

## Definition of Done

- [x] Light/dark themes follow system preference initially and persist explicit choices.
- [x] Theme toggle is translated, keyboard accessible, visible, and route/server neutral.
- [x] Authenticated header is fixed; desktop left navigation is fixed below it and icon-led.
- [x] Mobile bottom navigation, safe-area handling, and wizard action clearance remain intact.
- [x] Widget boundaries are visible in both themes without relying on shadows or color alone.
- [x] Existing routes, selectors, translations, auth, pricing, PWA, and accessibility remain compatible.
- [x] Full unit, lint, build, PWA preview, and Playwright journeys pass.
- [ ] All changes are committed and pushed; only the pre-existing `apps/web/index.html` edit remains unstaged.
