# Charcoal premium shell — Task 1 report

## Scope

Established the shared charcoal visual-token foundation only. No shell, route,
API, authentication, i18n, or behavior changes were made.

## Changed files

- `apps/web/src/shared/theme/theme.ts`
  - Added the semantic `theme.palette.shell` token.
  - Kept the required charcoal (`#1D1D1F`), shell text (`#F5F5F7`), cream
    canvas (`#FBFBFD`), and blue primary action (`#0071E3`) tokens.
  - Added restrained theme-level outlined-input and chip treatment using the
    existing spacing scale, palette, and focus color.
- `apps/web/src/shared/components/visuals.test.tsx`
  - Added token and component-default contract tests.

## TDD evidence

### RED

Command:

```bash
bun run --filter web test --run src/shared/components/visuals.test.tsx
```

Result: 1 failed, 9 passed. The new `defines the charcoal premium shell
tokens` assertion failed because `theme.palette.shell` did not exist. The
restrained Button and Paper default tests already passed, confirming that the
only missing contract was the semantic shell token.

### GREEN

Command:

```bash
bun run --filter web test --run src/shared/components/visuals.test.tsx
```

Result: 10 passed.

## Verification

```bash
bun run --filter web lint
bun run --filter web test --run
```

- Lint: 0 errors; 3 pre-existing `react-refresh/only-export-components`
  warnings in `routes.tsx`, `AuthProvider.tsx`, and `QuoteWizardProvider.tsx`.
- Full web suite: 28 files, 104 tests passed.

## Self-review

- `shell` is a dedicated palette token so subsequent shell consumers do not
  depend on local color literals.
- Existing palette names, public `theme` export, focus ring behavior, and
  MUI component defaults remain compatible.
- No new dependencies or component-local raw colors were introduced.
- The pre-existing `apps/web/index.html` working-tree change is intentionally
  outside this task and remains unstaged.

## Concerns

None. The existing lint warnings are outside Task 1 scope and unchanged.
