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

- [ ] **Step 1: Write failing tests.** Assert the authenticated banner has fixed-position mode, desktop nav has the fixed-position attribute, every desktop destination contains an SVG, and the theme toggle is visible.

```tsx
expect(
  screen.getByRole('navigation', { name: /primary navigation/i })
).toHaveAttribute('data-shell-position', 'fixed');
expect(
  screen.getByTestId(tid('navigation.home')).querySelector('svg')
).not.toBeNull();
```

- [ ] **Step 2: Verify RED.** Run `bun run --filter web test --run src/shared/components/AppShell.test.tsx src/shared/components/AppNavigation.test.tsx`; expect the new contract failures.

- [ ] **Step 3: Implement fixed geometry.** Use header height `72px` desktop/`64px` mobile and rail width `224px`. Set the authenticated header fixed at top, desktop rail fixed from `top: 72px` to bottom, and give main/footer matching top/left offsets. Add the existing `NavigationIcon` to desktop list buttons, keep mobile bottom navigation unchanged, and mount `ThemeToggle` in the authenticated header.

- [ ] **Step 4: Verify GREEN.** Run the two focused suites, then `bun run --filter web test --run`; expect no route, selector, or focus regressions.

- [ ] **Step 5: Refactor and commit.** `git add apps/web/src/shared/components/AppShell.tsx apps/web/src/shared/components/AppNavigation.tsx apps/web/src/shared/components/AppShell.test.tsx apps/web/src/shared/components/AppNavigation.test.tsx && git commit -m "feat(web): fix shell header and icon navigation"`.

### Task 4: Apply visible light/dark widget boundaries

**Files:** Modify `theme.ts`, `QuotesListPage.tsx`, `AccountPage.tsx`, `WizardFrame.tsx`, `PremiumDisplay.tsx`, `LoadingState.tsx`, and `ApiErrorAlert.tsx`; extend their existing tests.

- [ ] **Step 1: Write failing assertions.** Render representative loading, error, premium, account, and quote surfaces in both themes and assert `data-widget-tone` plus a non-empty 1px border.

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

- [ ] **Step 2: Verify RED.** Run the affected colocated suites; expect the mode-aware boundary assertion to fail before implementation.

- [ ] **Step 3: Implement semantic surfaces.** Replace old charcoal-only alpha fills with `background.default`, `background.paper`, raised surface, and active `divider` tokens. Keep existing status roles, visible text, icons, `data-widget-tone`, routes, API calls, and selectors unchanged. Use borders as the primary boundary and subtle shadows only as secondary depth.

- [ ] **Step 4: Verify GREEN.** Run `bun run --filter web test --run`, `bun run --filter web lint`, and `bun run --filter web build`; expect zero errors and only existing warnings/advisories.

- [ ] **Step 5: Refactor and commit.** `git add apps/web/src/shared/theme/theme.ts apps/web/src/pages apps/web/src/features/quote-wizard/components apps/web/src/shared/components && git commit -m "refactor(web): clarify light dark widget surfaces"`.

### Task 5: Verify both themes and responsive journeys

**Files:** Modify `e2e/tests/app-accessibility.spec.ts`, `app-navigation.spec.ts`, `dashboard-responsive.spec.ts`, and `tasks/todo.md`.

- [ ] **Step 1: Write failing browser assertions.** Assert fixed banner/rail, visible theme toggle, `html[data-theme]` changes after keyboard activation, exact mode-safe shell contrast, and no overflow/action-dock overlap at 320/375/768/1024/1440px.

```ts
await expect(page.getByRole('banner')).toHaveAttribute(
  'data-shell-position',
  'fixed'
);
await page.getByRole('button', { name: 'Toggle theme' }).press('Enter');
await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
```

- [ ] **Step 2: Verify RED.** Run `E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test tests/app-accessibility.spec.ts tests/app-navigation.spec.ts tests/dashboard-responsive.spec.ts --project=desktop-chromium --project=mobile-chromium --retries=0`; expect new contract failures.

- [ ] **Step 3: Implement only browser contracts.** Check computed foreground/background contrast for both modes, fixed geometry, keyboard focus, no console/page errors, and preserve all quote/pricing/passkey/retry/submission assertions.

- [ ] **Step 4: Complete verification.** Run:

```bash
bun run --filter web test --run
bun run --filter web lint
bun run --filter web build
bun run --filter e2e build
bun run --filter e2e lint
E2E_PWA_PREVIEW_PORT=43105 bun run --filter e2e test:pwa-preview
E2E_BASE_URL=http://localhost:3100 bun run e2e -- --retries=0
```

Expected: all unit tests, lint/build checks, PWA preview, and complete journeys pass. The static PWA checker may still report the pre-existing Apple metadata limitation; do not edit `apps/web/index.html`.

- [ ] **Step 5: Update checklist and commit.** Mark the plan and `tasks/todo.md` complete, then `git add e2e/tests tasks/todo.md && git commit -m "test(web): verify light dark fixed shell" && git push origin feat-frontend`.

## Definition of Done

- [ ] Light/dark themes follow system preference initially and persist explicit choices.
- [ ] Theme toggle is translated, keyboard accessible, visible, and route/server neutral.
- [ ] Authenticated header is fixed; desktop left navigation is fixed below it and icon-led.
- [ ] Mobile bottom navigation, safe-area handling, and wizard action clearance remain intact.
- [ ] Widget boundaries are visible in both themes without relying on shadows or color alone.
- [ ] Existing routes, selectors, translations, auth, pricing, PWA, and accessibility remain compatible.
- [ ] Full unit, lint, build, PWA preview, and Playwright journeys pass.
- [ ] All changes are committed and pushed; only the pre-existing `apps/web/index.html` edit remains unstaged.
