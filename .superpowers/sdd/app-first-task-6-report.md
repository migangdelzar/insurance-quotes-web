# App-first PWA UX — Task 6 Report

## Outcome

Added installable PWA output and an authenticated-shell offline status boundary.

## Changes

- Added `vite-plugin-pwa` with a standalone Clara manifest, static SVG icons, and explicit update activation.
- Registered the generated `/sw.js` once from the web entry point.
- Limited worker precaching to static application assets; no runtime cache configuration was added for `/api`, quote data, authentication state, or mutations.
- Added an offline notice that listens for browser `online` and `offline` events and tells users to reconnect before account or quote actions.
- Added a production build artifact checker for the manifest, worker, and icons.

## TDD evidence

- Red: `bun run --filter web test --run src/shared/components/OfflineNotice.test.tsx src/pwa/register.test.ts` failed because both modules did not exist.
- Green: focused tests pass after the smallest implementation.

## Verification

- Focused PWA/offline tests: 3 passing.
- Full web suite: 81 passing.
- i18n package suite: 5 passing; locale/test-ID validation passed.
- Lint: 0 errors; 3 pre-existing Fast Refresh warnings.
- Production build: passed; Vite reports its existing chunk-size advisory.
- `cd apps/web && node src/pwa/check-build.mjs`: passed.
- Generated worker inspection confirms a static precache and `/api` navigation denylist; it contains no runtime API caching rule.

## Commit

`feat(web): add safe installable PWA shell`
