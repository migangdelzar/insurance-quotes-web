# App-first PWA UX — Task 7 Report

## Outcome

Closed the Task 7 review findings with deterministic Playwright coverage for the authenticated application shell, desktop and mobile destination navigation, keyboard accessibility, account-menu focus recovery, production-only PWA metadata, responsive layouts, action-dock geometry, and clean browser-console enforcement.

## Changes

- Updated the approved responsive target to 1440px in the login and dashboard suites.
- Extended `app-navigation.spec.ts` to exercise every authenticated destination through mobile navigation and assert the fixed wizard action dock clears the fixed bottom navigation at both 320px and 375px using bounding rectangles.
- Added the reusable `criticalFlow` fixture, which fails critical shell tests on `pageerror` or any application `console.error`.
- Marked PWA metadata with `@pwa`, excluded it from ordinary dev projects, and added the `pwa-preview` project plus `bun run --filter e2e test:pwa-preview` command. `E2E_PWA_PREVIEW_PORT` now controls one shared port contract for both Vite preview and Playwright’s base URL, defaulting to `3101` and allowing deterministic non-conflicting runs.
- Updated PWA registration to be production-only so Vite development runs do not attempt to load a non-existent generated worker.
- Added shared E2E login and quote-session stubs so shell tests do not depend on mutable passkey state in the shared backend.
- Reused the shared session stub in dashboard responsive coverage and retained no-horizontal-overflow assertions at 320, 375, 768, 1024, and 1440 pixels.

## TDD evidence

- Red: the new critical-flow fixture initially failed every shell test because development registered `/sw.js` while Vite intentionally served no generated worker, producing an unsupported-MIME console error and service-worker `pageerror`.
- Green: `registerPwa(false)` now leaves service-worker registration disabled, while production registration remains covered by the existing unit test.
- Green: the mobile route matrix, 320/375 rectangle non-overlap checks, 1440px coverage, production-only PWA project, and error collector pass against fresh source/preview builds.
- Red: the preview-port contract test failed because the helper did not exist.
- Green: the shared preview-port helper now derives both the `webServer` URL/command and the `pwa-preview` project `baseURL`; the test verifies the override and default contracts.

## Verification

- Focused source browser coverage: 16 passing — desktop destinations/accessibility, mobile destination navigation, 320/375 action-dock geometry, and login/dashboard responsiveness at 320, 375, 768, 1024, and 1440 pixels.
- Production PWA metadata browser coverage: 1 passing through the `pwa-preview` project against a fresh local preview build.
- Port-contract browser coverage: 2 passing.
- `E2E_PWA_PREVIEW_PORT=43101 bun run --filter e2e test:pwa-preview`: passed and left no listener on port `43101`.
- Web unit suite: 87 passing.
- E2E TypeScript build: passed.
- E2E lint: passed.
- Web production build: passed; Vite emitted its existing chunk-size advisory.
- `cd apps/web && node src/pwa/check-build.mjs`: passed.

## Runtime note

The pre-existing `http://localhost:3100` Compose web container serves an older image that predates the app-first navigation and PWA work. A Compose rebuild was started but Docker's in-container `bun install --frozen-lockfile` stalled; it was stopped without changing the running application. Verification therefore used the current source through Vite for interactive shell behavior and a fresh production preview for PWA metadata. The source, production build, and generated artifact checks are all covered by the commands above.

## Commit

`5b957ca fix(web): configure PWA preview port`
