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

## Review remediation

- Added valid 192×192 and 512×512 PNG `any` icon fallbacks plus a 512×512 `maskable` PNG icon. The manifest retains the vector icons and now references every PNG asset with explicit size, type, and purpose metadata.
- Strengthened `check-build.mjs` to validate required assets, manifest icon metadata, the generated worker's `/api` navigation denylist, and the absence of a second `/api` reference that would indicate an API runtime-cache route.
- Added deterministic fixture tests for the missing maskable asset, missing navigation denylist, and API runtime-cache route cases.

### Remediation verification

- Focused PWA checker tests: 4 passing.
- Full web suite: 85 passing.
- Lint: 0 errors; 3 pre-existing Fast Refresh warnings.
- Production build and `node src/pwa/check-build.mjs`: passed.

## Follow-up review remediation

- Replaced the fragile `/api` occurrence count with a structural worker invariant: the generated worker must contain exactly one `registerRoute` call, and that call must register the expected `NavigationRoute`. This rejects any added runtime-cache route regardless of how its matcher spells the API path.
- Added a regression fixture whose API matcher constructs `"/" + "api"`, proving that a runtime-cache route without a literal `/api` is rejected.

### Follow-up verification

- Red: the new obfuscated-matcher fixture passed the previous checker (exit status 0), demonstrating the review finding.
- Focused PWA checker tests: 5 passing.
- Full web suite: 86 passing.
- Lint: 0 errors; 3 pre-existing Fast Refresh warnings.
- Production build and `cd apps/web && node src/pwa/check-build.mjs`: passed.
