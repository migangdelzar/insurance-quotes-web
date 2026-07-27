# App-first PWA UX — Task 3 report

## Result

Implemented the single authenticated account boundary:

- `AccountMenu` is the sole compact-header trigger and MUI menu. It exposes Account, locale selection, and sign out with controlled menu state, keyboard semantics, and focus restoration.
- `/account` is protected by the existing route guard and contains the current locale controls, secure-session/passkey information, support/privacy copy, and the one session-ending action.
- The implementation uses the existing `useAuth` callbacks, existing i18n resources, test-ID contract, navigation contract, and same-origin API/auth behavior.

## TDD evidence

1. Added focused `AccountMenu` and `AccountPage` tests first.
2. Confirmed RED: both tests failed because the corresponding components did not exist.
3. Implemented the smallest account menu/page/route/shell integration, then refactored to use the pre-existing `layout.*` locale keys.

## Verification

- Focused: `bun run --filter web test --run src/shared/components/AccountMenu.test.tsx src/pages/AccountPage.test.tsx src/shared/components/AppShell.test.tsx` — 5 passed.
- Full unit suite: `bun run --filter web test --run` — 68 passed across 21 files.
- Lint: `bun run --filter web lint` — 0 errors; 3 pre-existing Fast Refresh warnings.
- Production build/typecheck: `bun run --filter web build` — passed; existing chunk-size advisory remains.

## Scope retained for later tasks

- `/quotes/history` continues to use the present list while Task 4 separates Home and history.
- Wizard-specific responsive framing remains Task 5.
