# Task 1 Report: Navigation and app-copy contracts

## STATUS

Complete.

## Scope

Task 1 defines the shared navigation contract for the app-first shell without changing shell rendering, route registration, authentication, or API behavior.

## TDD evidence

### RED

Command:

```text
bun run --filter web test --run src/shared/navigation/navigation.test.ts
```

Result:

```text
FAIL  src/shared/navigation/navigation.test.ts
Error: Failed to resolve import "./navigation" ... Does the file exist?
Test Files  1 failed (1)
Tests       no tests
```

The focused test failed because the navigation module did not exist, confirming the test exercised the missing contract.

### GREEN

Commands:

```text
bun run --filter web test --run src/shared/navigation/navigation.test.ts
bun run --filter @clara/app-i18n test --run
node packages/app-i18n/src/validate.mjs
```

Result:

```text
navigation.test.ts: 4 tests passed
@clara/app-i18n src/index.test.ts: 5 tests passed
All locale keys, element references, and testIds are valid.
```

Additional regression verification:

```text
bun run --filter web test --run
Test Files  18 passed (18)
Tests       63 passed (63)

bun run --filter web build
built successfully
```

The production build emits the repository's existing large-chunk warning but succeeds.

## Files changed

- `apps/web/src/shared/navigation/navigation.ts`
  - Adds readonly `primaryDestinations` in the required order: `home`, `quotes`, `newQuote`, `account`.
  - Exports `PrimaryDestination`.
  - Exports `getActiveDestination(pathname, search = '')` with quote-workspace, quote-history, account, and home matching.
  - Retains the `search` argument for browser/shell compatibility; query parameters do not change the primary destination.
- `apps/web/src/shared/navigation/navigation.test.ts`
  - Covers stable ordering, route matching, nested routes, and shared i18n/test-ID key references.
- `packages/app-i18n/src/data/elements.json`
  - Adds stable `navigation.*` test IDs for primary navigation, shell title, account content, and offline status.
- `packages/app-i18n/src/data/translations/en-US.json`
  - Adds English navigation, account, security, and offline copy.
- `packages/app-i18n/src/data/translations/es-MX.json`
  - Adds structurally aligned Spanish navigation, account, security, and offline copy.

## Commit

```text
3e03e03d605b74725dcec9154ed0195d92ccbc8a feat(web): define app navigation contract
```

## Self-review

- The destination model is readonly and provides one source of truth for later desktop and mobile navigation.
- `/quote/` is checked before the fallback, `/quotes/history` is checked before the home fallback, and `/account` supports nested routes.
- Visible labels and selector IDs use the same semantic key path while `tid()` remains the only selector value exposed to consumers.
- English and Spanish translation trees remain structurally aligned and pass the package validator.
- No later-task shell components, route wiring, or PWA behavior were introduced.
- Formatting, ESLint pre-commit checks, focused tests, full web tests, and the production build passed.

## Concerns

- `/quotes/history` and `/account` are navigation contracts only in this task; the corresponding route/page behavior is intentionally deferred to later tasks in the app-first plan.
- The `search` argument is intentionally reserved for shell/browser callers but is not currently used for active-destination selection.
