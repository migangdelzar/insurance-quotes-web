# App-first PWA UX — Hardening B report

## Scope

Implemented only the four approved Hardening B behaviors:

- visible and accessible quote-submission progress
- authenticated route heading focus
- active locale synchronization with `<html lang>`
- authenticated mobile footer clearance above fixed navigation

Existing API, authentication, pricing, coverage debounce, navigation, PWA, translation access, and test-id access contracts were preserved.

## TDD evidence

### Submission loading

- RED: `SubmissionResult` rendered no accessible status for `submitting`.
- GREEN: `SubmissionResult` now renders the existing `LoadingState` with localized `wizard.summary.submitting` text and selector.

### Authenticated route focus

- RED: the destination `h1` had no `tabindex` and did not receive focus after route navigation.
- GREEN: `AppShell` focuses the first `h1` inside authenticated main content after pathname or search changes and gives it `tabIndex=-1`.

### Document language

- RED: `<html lang>` remained empty in tests during initialization and after changing to Spanish.
- GREEN: initialization and i18next `languageChanged` events synchronize `en-US` to `en` and Spanish to `es-MX`.

### Mobile footer clearance

- RED: at 320px and 375px, the footer ended around 812px while fixed navigation began around 755px.
- GREEN: the authenticated footer reserves the mobile navigation height below itself; both viewport geometry checks pass.

## Verification

| Check | Result |
|---|---|
| Focused web tests | 3 files, 10 tests passed |
| App i18n tests | 1 file, 5 tests passed |
| Full web tests | 28 files, 97 tests passed |
| Web lint | Passed with 0 errors and 3 pre-existing Fast Refresh warnings |
| E2E typecheck | Passed |
| E2E lint | Passed |
| Production web build | Passed; existing bundle chunk-size advisory remains |
| Playwright accessibility/navigation/responsive | 8 tests passed |

The focused browser run covered route heading focus, account-menu focus restoration, all authenticated destinations, fixed wizard actions, and footer clearance at 320px and 375px.

## Files changed

- `apps/web/src/features/quote-wizard/steps/summary/SubmissionResult.tsx`
- `apps/web/src/features/quote-wizard/steps/summary/SubmissionResult.test.tsx`
- `apps/web/src/shared/components/AppShell.tsx`
- `apps/web/src/shared/components/AppShell.test.tsx`
- `apps/web/src/app/i18n.ts`
- `apps/web/src/app/i18n.test.ts`
- `packages/app-i18n/src/data/elements.json`
- `packages/app-i18n/src/data/translations/en-US.json`
- `packages/app-i18n/src/data/translations/es-MX.json`
- `e2e/tests/app-accessibility.spec.ts`
- `e2e/tests/app-navigation.spec.ts`
- `tasks/todo.md`

## Residual observations

- The web lint warnings and production chunk-size advisory predate Hardening B and remain non-blocking.
- Unrelated local work was intentionally excluded from this Hardening B commit.
