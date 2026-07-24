# Task 2 Report: Shared application shell

Date: 2026-07-24

## Scope

Implemented only Task 2 from `.superpowers/sdd/task-2-brief.md`:

- added a shared `AppShell` with semantic `header`, `main`, and `footer`
- preserved the existing skip-link selector `tid('common.skipToContent')`
- preserved the existing main landmark selector `tid('layout.main')`
- added auth-aware sign-out that renders only for authenticated sessions
- added a route-safe language control using the existing i18n instance
- added localized shell/footer copy in both locales
- integrated the shell through `App.tsx` without changing routes, auth transitions, reducer logic, validation, or API behavior

No route definitions, API payloads, MFA/passkey flows, reducer transitions, or existing selectors were changed.

## Changed files

- `apps/web/src/shared/components/AppShell.tsx`
- `apps/web/src/shared/components/AppShell.test.tsx`
- `apps/web/src/app/App.tsx`
- `packages/app-i18n/src/data/translations/en-US.json`
- `packages/app-i18n/src/data/translations/es-MX.json`
- `apps/web/src/shared/components/visuals.test.tsx`
- `tasks/todo.md`

Notes:

- `packages/app-i18n/src/data/elements.json` was intentionally left unchanged because no new stable selector was required for this task.
- `apps/web/src/shared/components/visuals.test.tsx` received a small type-narrowing fix after verification exposed a pre-existing build failure in that test helper.

## TDD log

### RED

Command:

```bash
bun run --filter web test -- src/shared/components/AppShell.test.tsx
```

Observed failure:

```text
FAIL  src/shared/components/AppShell.test.tsx
Error: Failed to resolve import "./AppShell" from "src/shared/components/AppShell.test.tsx". Does the file exist?
```

This confirmed the new shell behavior was not already implemented.

### GREEN

Command:

```bash
bun run --filter web test -- src/shared/components/AppShell.test.tsx
```

Observed result:

```text
✓ src/shared/components/AppShell.test.tsx (3 tests)
Test Files  1 passed (1)
Tests  3 passed (3)
```

Covered behaviors:

- shell chrome renders semantic landmarks
- existing skip-link and main selectors remain intact
- sign-out appears only for authenticated sessions and calls `logout`
- language switching updates shell copy without changing the active route

## Verification

### Focused and relevant tests

Command:

```bash
bun run --filter web test -- src/shared/components/AppShell.test.tsx src/features/auth/pages/LoginPage.test.tsx
```

Observed result:

```text
✓ src/features/auth/pages/LoginPage.test.tsx (1 test)
✓ src/shared/components/AppShell.test.tsx (3 tests)
Test Files  2 passed (2)
Tests  4 passed (4)
```

Note:

- The task brief referenced `src/pages/QuotesListPage.test.tsx`, but that file does not currently exist in the repository.

### Locale validation

Command:

```bash
bun run --filter @clara/app-i18n test && bun run --filter @clara/app-i18n validate
```

Observed result:

```text
✓ src/index.test.ts (5 tests)
All locale keys, element references, and testIds are valid.
```

### Shared visual helper regression check

Command:

```bash
bun run --filter web test -- src/shared/components/visuals.test.tsx
```

Observed result:

```text
✓ src/shared/components/visuals.test.tsx (7 tests)
```

Reason:

- `bun run --filter web build` exposed pre-existing strict-TypeScript failures in `src/shared/components/visuals.test.tsx`.
- The fix added explicit runtime guards around destructured array values without changing test behavior.

### Lint

Command:

```bash
bun run --filter web lint
```

Observed result:

```text
✖ 3 problems (0 errors, 3 warnings)
```

Notes:

- exit code was `0`
- warnings were pre-existing `react-refresh/only-export-components` warnings in:
  - `apps/web/src/app/routes.tsx`
  - `apps/web/src/features/auth/context/AuthProvider.tsx`
  - `apps/web/src/features/quote-wizard/context/QuoteWizardProvider.tsx`
- Task 2 introduced no new lint errors

### Build

Command:

```bash
bun run --filter web build
```

Observed result:

```text
✓ built in 2.73s
```

Notes:

- Vite emitted a non-blocking chunk-size warning for the existing bundle (`dist/assets/index-*.js` > 500 kB after minification).
- The build completed successfully after the visual test helper narrowing fix.

## Implementation notes

- `App.tsx` now composes the shared shell and still renders `Outlet` inside the preserved main landmark.
- `AppShell` uses `useAuth`, `useTranslation`, and `useLocation` internally, per the brief.
- The secure-session message is route/auth aware:
  - login route + anonymous session → secure sign-in copy
  - authenticated session → secure session copy
  - other anonymous routes → protected experience copy
- Header controls use real buttons and links only.
- Footer links stay route-safe by targeting in-page support/privacy sections instead of inventing new routes.
- No new runtime dependency or styling system was added.

## Self-review

- Scope stayed inside the shared shell plus required localized copy.
- Existing `data-testid={tid(...)}` selectors were preserved.
- `elements.json` was not changed because roles and accessible names were sufficient for testing the new controls.
- Routes, auth state transitions, MFA/passkey behavior, reducer logic, and API behavior were left untouched.
- The shell remains safe on both login and authenticated routes, and sign-out renders only for authenticated sessions.
- The header/footer use semantic landmarks and inherit the Task 1 focus ring and contrast tokens.

## Concerns

- The support email shown in footer copy is product placeholder content for the challenge; if the product has canonical support/legal destinations, those should replace the placeholder copy in a follow-up.
- The task brief referenced a `QuotesListPage` test file that does not yet exist, so relevant verification relied on shell tests, existing auth tests, i18n validation, lint, and build instead.
- The production bundle still emits a Vite chunk-size warning; it is non-blocking for this task but worth addressing in a separate performance pass.
