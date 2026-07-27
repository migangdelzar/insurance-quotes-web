# Charcoal Premium Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Clara quote workspace with a charcoal application shell, stronger contrast, clearer typography, and consistent widgets/icons while preserving all existing product behavior.

**Architecture:** Extend the existing MUI theme as the single source of visual tokens, then consume those tokens in `AppShell`, `AppNavigation`, and the existing page/widget components. Keep the current React Router, i18n, auth, query, PWA, test-ID, and API boundaries unchanged; visual changes remain presentational.

**Tech Stack:** React 19, TypeScript 5.7, MUI 6, Vitest, Testing Library, Playwright, Bun workspaces.

## Global Constraints

- Use charcoal `#1D1D1F` for authenticated header, desktop rail, mobile bottom navigation, and footer.
- Expose the shell through a dedicated `theme.palette.shell` token so shell consumers do not depend on component-local color literals.
- Keep the light cream/white content canvas and the existing blue primary action accent.
- Keep Inter as the primary typeface; do not add a font dependency.
- Do not add an icon or animation dependency; use existing inline `SvgIcon` patterns.
- Preserve routes, API/authentication/pricing behavior, translations, test IDs, PWA policy, focus management, safe-area spacing, and keyboard behavior.
- Maintain WCAG AA contrast and do not communicate state through color alone.
- Preserve the unrelated existing `apps/web/index.html` working-tree change; do not stage or revert it.

---

### Task 1: Establish the charcoal visual token system

**Files:**

- Modify: `apps/web/src/shared/theme/theme.ts`
- Test: `apps/web/src/shared/components/visuals.test.tsx`

**Interfaces:**

- Consumes: the existing exported `theme` object and MUI palette augmentation.
- Produces: stable `theme.palette.shell`, `theme.palette.charcoal`, `theme.palette.ink`, `theme.palette.slate`, `theme.palette.primary`, and component defaults consumed by later shell/widget tasks.

- [ ] **Step 1: Write failing visual-token tests**

Add focused assertions to the existing visual test suite:

```tsx
it('defines the charcoal premium shell tokens', () => {
  expect(theme.palette.shell.main).toBe('#1D1D1F');
  expect(theme.palette.shell.contrastText).toBe('#F5F5F7');
  expect(theme.palette.background.default).toBe('#FBFBFD');
  expect(theme.palette.primary.main).toBe('#0071E3');
});

it('keeps interactive surfaces visually restrained', () => {
  expect(theme.components?.MuiButton?.defaultProps?.disableElevation).toBe(
    true
  );
  expect(theme.components?.MuiPaper?.defaultProps?.elevation).toBe(0);
});
```

- [ ] **Step 2: Run the focused tests and verify the baseline failure**

Run:

```bash
bun run --filter web test --run src/shared/components/visuals.test.tsx
```

Expected: the new charcoal/component-default assertions fail if the current token values or defaults do not satisfy the design contract.

- [ ] **Step 3: Implement the minimum theme update**

Keep the existing palette names and add only the visual behavior needed by the shell:

```ts
const shellText = '#F5F5F7';

shell: {
  main: palette.charcoal,
  contrastText: shellText,
},
```

Update component defaults/overrides so buttons, papers, inputs, chips, and focus states use the existing spacing scale, subtle borders, and accessible contrast. Do not introduce raw color values outside the theme file.

- [ ] **Step 4: Run focused tests and lint**

Run:

```bash
bun run --filter web test --run src/shared/components/visuals.test.tsx
bun run --filter web lint
```

Expected: focused tests pass; lint has zero errors. Existing Fast Refresh warnings may remain.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/theme/theme.ts apps/web/src/shared/components/visuals.test.tsx
git commit -m "feat(web): define charcoal premium visual tokens"
```

### Task 2: Apply the charcoal shell to header, navigation, and footer

**Files:**

- Modify: `apps/web/src/shared/components/AppShell.tsx`
- Modify: `apps/web/src/shared/components/AppNavigation.tsx`
- Test: `apps/web/src/shared/components/AppShell.test.tsx`
- Test: `apps/web/src/shared/components/AppNavigation.test.tsx`

**Interfaces:**

- Consumes: Task 1 `theme.palette.shell` token, existing `primaryDestinations`, `tid()`, i18n labels, `useAuth()`, and route focus behavior.
- Produces: the same shell landmarks and navigation selectors with charcoal surfaces, high-contrast text, visible active treatment, and unchanged responsive geometry.

- [ ] **Step 1: Write failing shell-style assertions**

Extend component tests to assert semantic style hooks rather than brittle generated CSS:

```tsx
it('marks the authenticated header and footer as charcoal shell surfaces', () => {
  renderAuthenticatedShell();

  expect(screen.getByRole('banner')).toHaveAttribute(
    'data-shell-tone',
    'charcoal'
  );
  expect(screen.getByRole('contentinfo')).toHaveAttribute(
    'data-shell-tone',
    'charcoal'
  );
});
```

Add a navigation assertion that every destination retains its accessible label and the active destination exposes `aria-current="page"` plus the active visual class.

- [ ] **Step 2: Run focused tests and verify the new assertions fail**

Run:

```bash
bun run --filter web test --run src/shared/components/AppShell.test.tsx src/shared/components/AppNavigation.test.tsx
```

Expected: the new shell-tone assertions fail before the implementation adds the stable attributes/treatment.

- [ ] **Step 3: Implement shell styling without changing behavior**

Apply `bgcolor: 'shell.main'`, `color: 'shell.contrastText'`, and theme-derived divider colors to authenticated header/footer and desktop/mobile navigation. Add `data-shell-tone="charcoal"` only as a stable test/style boundary. Ensure nested `Typography`, buttons, menu triggers, navigation labels, and icons inherit or explicitly use high-contrast shell colors. Keep the existing fixed mobile nav safe-area padding, footer margin clearance, route focus effect, skip link, and account menu unchanged.

- [ ] **Step 4: Run focused tests and responsive browser checks**

Run:

```bash
bun run --filter web test --run src/shared/components/AppShell.test.tsx src/shared/components/AppNavigation.test.tsx
E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test tests/app-navigation.spec.ts tests/app-accessibility.spec.ts --project=desktop-chromium --project=mobile-chromium --retries=0
```

Expected: all focused tests and shell browser checks pass with no horizontal overflow or fixed-navigation overlap.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/shared/components/AppShell.tsx apps/web/src/shared/components/AppNavigation.tsx apps/web/src/shared/components/AppShell.test.tsx apps/web/src/shared/components/AppNavigation.test.tsx
git commit -m "feat(web): apply charcoal app shell"
```

### Task 3: Polish quote, account, wizard, and status widgets

**Files:**

- Modify: `apps/web/src/pages/QuotesListPage.tsx`
- Modify: `apps/web/src/pages/AccountPage.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/WizardFrame.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/WizardActionDock.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/PremiumDisplay.tsx`
- Modify: `apps/web/src/shared/components/LoadingState.tsx`
- Modify: `apps/web/src/shared/components/ApiErrorAlert.tsx`
- Test: existing colocated component/page tests for changed states

**Interfaces:**

- Consumes: Task 1 theme tokens, existing translated copy, existing `tid()` selectors, and current component props.
- Produces: higher-contrast cards, clearer premium/status hierarchy, consistent icon sizing, and no API/state contract changes.

- [ ] **Step 1: Write focused failing assertions for representative widget states**

Add tests to existing colocated suites for:

```tsx
expect(screen.getByTestId(tid('wizard.premium'))).toHaveAttribute(
  'data-widget-tone',
  'accent'
);
expect(screen.getByRole('status')).toBeVisible();
expect(screen.getByTestId(tid('quotesList.title'))).toBeVisible();
```

Verify the empty, loading, error, success, premium, and account security surfaces retain their accessible names and visible state text while gaining stable widget tone boundaries.

- [ ] **Step 2: Run focused tests and verify the new assertions fail**

Run the exact affected test files with:

```bash
bun run --filter web test --run src/pages/QuotesListPage.test.tsx src/pages/AccountPage.test.tsx src/features/quote-wizard/components/WizardFrame.test.tsx src/features/quote-wizard/components/WizardActionDock.test.tsx src/features/quote-wizard/components/PremiumDisplay.test.tsx src/shared/components/LoadingState.test.tsx
```

Expected: only the new style-boundary assertions fail.

- [ ] **Step 3: Implement presentational polish**

Use theme-derived borders, surfaces, typography, and spacing. Add existing inline `SvgIcon` visuals where a widget currently has no visual cue, keeping adjacent text as the accessible name. Use a consistent icon size (`20px` for compact controls and `24px` for primary widget markers), preserve icon-only `aria-label`s, and keep all loading/error/status semantics intact. Do not change query keys, mutation handlers, route paths, translations, or test IDs.

- [ ] **Step 4: Run affected tests and lint**

Run:

```bash
bun run --filter web test --run src/pages/QuotesListPage.test.tsx src/pages/AccountPage.test.tsx src/features/quote-wizard/components/WizardFrame.test.tsx src/features/quote-wizard/components/WizardActionDock.test.tsx src/features/quote-wizard/components/PremiumDisplay.test.tsx src/shared/components/LoadingState.test.tsx
bun run --filter web lint
```

Expected: all affected tests pass with zero lint errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/pages/QuotesListPage.tsx apps/web/src/pages/AccountPage.tsx apps/web/src/features/quote-wizard/components/WizardFrame.tsx apps/web/src/features/quote-wizard/components/WizardActionDock.tsx apps/web/src/features/quote-wizard/components/PremiumDisplay.tsx apps/web/src/shared/components/LoadingState.tsx apps/web/src/shared/components/ApiErrorAlert.tsx
git commit -m "feat(web): polish quote workspace widgets"
```

### Task 4: Verify contrast, responsive behavior, and integrated journeys

**Files:**

- Modify: `e2e/tests/app-accessibility.spec.ts`
- Modify: `e2e/tests/app-navigation.spec.ts`
- Modify: `e2e/tests/dashboard-responsive.spec.ts`
- Modify: `README.md` only if verification commands or visual notes change
- Test: `e2e/tests/app-accessibility.spec.ts`, `e2e/tests/app-navigation.spec.ts`, `e2e/tests/dashboard-responsive.spec.ts`, existing journey specs

**Interfaces:**

- Consumes: completed theme, shell, and widget behavior from Tasks 1–3.
- Produces: browser evidence that the charcoal polish is readable and does not regress navigation, focus, responsive geometry, PWA, or quote journeys.

- [ ] **Step 1: Add failing browser assertions for the visual contract**

Add browser checks for:

```ts
await expect(page.getByRole('banner')).toHaveAttribute(
  'data-shell-tone',
  'charcoal'
);
await expect(page.getByRole('contentinfo')).toHaveAttribute(
  'data-shell-tone',
  'charcoal'
);
await expect(
  page.getByRole('navigation', { name: /primary navigation/i })
).toBeVisible();
```

At 320px, 375px, 768px, 1024px, and 1440px, retain the existing no-overflow and fixed-navigation geometry checks. Add a contrast-oriented assertion using computed colors for shell text/background and ensure all critical journeys continue to collect no page errors or console errors.

- [ ] **Step 2: Run the browser checks and verify the new assertions fail before implementation**

Run:

```bash
E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test tests/app-accessibility.spec.ts tests/app-navigation.spec.ts tests/dashboard-responsive.spec.ts --project=desktop-chromium --project=mobile-chromium --retries=0
```

Expected: new charcoal visual-contract assertions fail until Tasks 1–3 are complete; existing navigation and responsive checks remain green.

- [ ] **Step 3: Implement only the required browser-test adjustments**

Keep tests tied to semantic roles, stable `tid()` selectors, and computed styles—not generated MUI class names or screenshots that encode incidental pixels. Do not weaken existing assertions for quote submission, premium calculation, auth, or responsive geometry.

- [ ] **Step 4: Run complete verification**

Run:

```bash
bun run --filter web test --run
bun run --filter web lint
bun run --filter e2e build
bun run --filter e2e lint
bun run --filter web build
node apps/web/src/pwa/check-build.mjs
E2E_PWA_PREVIEW_PORT=43105 bun run --filter e2e test:pwa-preview
E2E_BASE_URL=http://localhost:3100 bun run e2e -- --retries=0
```

Expected: all unit tests, lint/type checks, production/PWA checks, and the complete browser journey suite pass. Existing non-blocking Fast Refresh and Vite chunk-size warnings may remain documented.

- [ ] **Step 5: Commit verification/docs and request review**

```bash
git add e2e/tests/app-accessibility.spec.ts e2e/tests/app-navigation.spec.ts e2e/tests/dashboard-responsive.spec.ts README.md
git commit -m "test(web): verify charcoal premium shell"
git push origin feat-frontend
```

Then request a fresh visual/accessibility review and record the result in `docs/superpowers/specs/` or `.superpowers/sdd/` without staging the unrelated `apps/web/index.html` working-tree change.

## Definition of Done

- [ ] Header, desktop rail, mobile navigation, and footer use the approved charcoal treatment.
- [ ] Typography, icons, buttons, widgets, cards, loading, error, premium, and account states have clear hierarchy and sufficient contrast.
- [ ] Existing routes, selectors, translations, auth, pricing, PWA, focus, and safe-area behavior remain compatible.
- [ ] Responsive checks pass at 320, 375, 768, 1024, and 1440px.
- [ ] Full unit, lint, build, PWA, and Playwright verification passes.
- [ ] Changes are committed and pushed to `origin/feat-frontend`.
