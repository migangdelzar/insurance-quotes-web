# App-first PWA UX — Task 7 Report

## Outcome

Added deterministic Playwright coverage for the authenticated application shell, desktop and mobile destination navigation, keyboard accessibility, account-menu focus recovery, production PWA metadata, and responsive layouts.

## Changes

- Added `app-navigation.spec.ts` for authenticated Home, Quotes history, New quote, and Account navigation plus the mobile bottom navigation/action-dock boundary.
- Added `app-accessibility.spec.ts` for primary/main landmarks, one page heading, `aria-current`, keyboard route focus, account-menu Escape focus restoration, and generated manifest/theme metadata.
- Added shared E2E login and quote-session stubs so shell tests do not depend on mutable passkey state in the shared backend.
- Reused the shared session stub in dashboard responsive coverage and retained no-horizontal-overflow assertions at 320, 375, 768, 1024, and 1280 pixels.

## TDD evidence

- Red: the initial PWA metadata assertion failed against Vite development mode because `vite-plugin-pwa` intentionally does not emit a manifest or service worker in development.
- Red: the initial authenticated shell scenarios failed when the shared backend rejected the mutable demo account after earlier passkey journeys.
- Green: narrow request interception was added only to the new shell/responsive test boundary; it uses the same app login flow, selectors, and routes. The navigation, keyboard, menu, and mobile-action tests then passed against the current Vite source.
- Green: after a fresh production build and Vite preview, the PWA metadata browser assertion passed together with the existing PWA artifact checker.

## Verification

- Focused source browser coverage: 4 passing — app destinations, keyboard landmarks/focus, account-menu Escape restoration, and mobile navigation/action dock.
- Responsive browser coverage: 12 passing — app navigation, login, and dashboard at 320, 375, 768, 1024, and 1280 pixels, plus the mobile action-dock scenario.
- Production PWA metadata browser coverage: 1 passing against a fresh local preview build.
- Web unit suite: 86 passing.
- E2E TypeScript build: passed.
- E2E lint: passed.
- Web production build: passed; Vite emitted its existing chunk-size advisory.
- `cd apps/web && node src/pwa/check-build.mjs`: passed.

## Runtime note

The pre-existing `http://localhost:3100` Compose web container serves an older image that predates the app-first navigation and PWA work. A Compose rebuild was started but Docker's in-container `bun install --frozen-lockfile` stalled; it was stopped without changing the running application. Verification therefore used the current source through Vite for interactive shell behavior and a fresh production preview for PWA metadata. The source, production build, and generated artifact checks are all covered by the commands above.

## Commit

`test(web): verify app navigation and accessibility`
