# App-first PWA UX — Hardening C report

## Result

Hardening C is implemented in commit `adeeafa40a80e1413e812709084399de6531d781`
(`chore(web): enforce app-first PWA checks`) and pushed to
`origin/feat-frontend`.

## Changes

- `.github/workflows/ci.yml`
  - Preserves push/pull-request cancellation with `cancel-in-progress: true`.
  - Adds E2E lint, production PWA artifact validation, app navigation,
    accessibility, and dashboard responsive browser checks.
  - Adds an isolated production PWA preview job on port `43102`.
  - Keeps the existing responsive and mocked quote journey checks.
- `apps/web/vite.config.ts`
  - Adds a concise install-manifest description.
- `apps/web/index.html`
  - Adds Apple standalone/status-bar/title metadata.
  - Reuses the verified 192px PNG as the Apple touch icon.
- `apps/web/src/pwa/check-build.mjs`
  - Requires a non-empty manifest description.
  - Requires the Apple PWA metadata and PNG touch icon in the built page.
  - Preserves the existing static-icon and no-API-cache service-worker policy.
- `apps/web/src/pwa/check-build.test.ts`
  - Adds executable CI-policy, manifest-description, and Apple-metadata
    regression coverage.
- `README.md`
  - Corrects the responsive matrix to 320, 375, 768, 1024, and 1440.
  - Documents the complete CI/PWA enforcement surface.

Hardening B source files were not staged or committed by this work.

## TDD evidence

1. Manifest description:
   - RED: the checker returned status `0` after the description was removed.
   - GREEN: the focused checker suite passed after adding the checker rule and
     manifest description.
2. Apple install metadata:
   - RED: the checker returned status `0` for an `index.html` without Apple
     metadata.
   - GREEN: the focused checker suite passed after adding built-page validation
     and metadata.
3. CI enforcement:
   - RED: the workflow contract failed because
     `tests/app-navigation.spec.ts` was absent.
   - GREEN: the focused checker suite passed after adding all required app-first
     and PWA workflow steps.

## Verification

| Command | Result |
| --- | --- |
| `bun run --filter web test --run src/pwa/check-build.test.ts` | 1 file, 8 tests passed |
| `bun run --filter web test --run` | 28 files, 97 tests passed |
| `bun run --filter web lint` | 0 errors; 3 existing Fast Refresh warnings |
| `VITE_API_BASE_URL=/api bun run --filter web build` | Passed; PWA artifacts generated |
| `cd apps/web && node src/pwa/check-build.mjs` | Passed with no output |
| `bun run --filter e2e build` | Passed |
| `bun run --filter e2e lint` | Passed |
| `E2E_PWA_PREVIEW_PORT=43102 VITE_API_BASE_URL=/api bun run --filter e2e test:pwa-preview` | 1 test passed; preview server exited cleanly |
| `bunx prettier --check ...` for all Hardening C files | Passed |
| Ruby YAML parse of `.github/workflows/ci.yml` | Passed |

The production build retains the existing bundle-size advisory. The PWA preview
also reports Bun/Playwright `NO_COLOR` informational warnings; neither affects
the passing result.
