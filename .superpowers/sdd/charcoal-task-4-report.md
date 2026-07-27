# Charcoal Premium Shell — Task 4 report

| Field | Detail |
|---|---|
| Plan | `docs/superpowers/plans/2026-07-27-charcoal-premium-shell-plan.md` |
| Scope | Browser verification for shell semantics, contrast, responsive geometry, and navigation stability |
| Status | Complete with a pre-existing PWA metadata limitation |

## Changed files

- `e2e/tests/app-accessibility.spec.ts`
  - Added semantic `data-shell-tone="charcoal"` assertions for the authenticated banner, primary navigation, and footer.
  - Added rendered-style contrast calculation for all three charcoal landmarks, requiring at least 4.5:1 foreground/background contrast.
- `e2e/tests/app-navigation.spec.ts`
  - Added shell-tone assertions to desktop navigation and mobile footer/action-dock checks.
  - Preserved route, active-link, footer-clearance, fixed-action-dock, and no-overflow assertions.
- `e2e/tests/dashboard-responsive.spec.ts`
  - Added shell-tone assertions while retaining no-horizontal-overflow checks at 320, 375, 768, 1024, and 1440 pixels.
- `docs/superpowers/plans/2026-07-27-charcoal-premium-shell-plan.md`
  - Marked Task 4 complete and documented bounded verification plus the PWA limitation.
- `tasks/todo.md`
  - Recorded Task 4 completion and verification evidence.

The pre-existing `apps/web/index.html` working-tree change was not edited,
staged, or included.

## RED/GREEN evidence

### Behavioral RED

Task 4 was started after Tasks 1–3 had already been implemented and reviewed.
The new browser assertions therefore did not produce a fresh behavioral RED
state: the first focused run passed because the completed shell already exposed
the required landmarks and `data-shell-tone` attributes. This is consistent
with the prior implementation RED evidence:

- Task 2 recorded `Expected data-shell-tone="charcoal"; received null` before
  the shell attributes were implemented.
- Task 3 recorded missing `data-widget-tone` boundaries before widget polish.

The Task 4 assertions are verification contracts for those completed changes,
not a reason to regress the already-finished application source.

### Tooling RED

The first E2E typecheck exposed a real test-helper typing failure:

```text
tests/app-accessibility.spec.ts(17,10): error TS2352:
Conversion of type 'number[]' to type 'Rgb' may be a mistake
```

The RGB parser was changed to validate and return an explicit three-channel
tuple. The E2E build then passed.

### GREEN

Focused browser command:

```text
E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test \
  tests/app-accessibility.spec.ts tests/app-navigation.spec.ts \
  tests/dashboard-responsive.spec.ts \
  --project=desktop-chromium --project=mobile-chromium --retries=0
```

Result: **13 passed**. This covered authenticated landmarks, computed shell
contrast, navigation, mobile footer/action-dock clearance, and dashboard
geometry at all five planned widths.

## Verification

| Command | Result |
|---|---|
| Focused Playwright suite | 13 passed, retries 0 |
| `bun run --filter web test --run` | 28 files / 106 tests passed |
| `bun run --filter web lint` | 0 errors; 3 pre-existing Fast Refresh warnings |
| `bun run --filter web build` | Passed; existing Vite chunk-size advisory |
| `bun run --filter e2e build` | Passed |
| `bun run --filter e2e lint` | Passed |
| `E2E_PWA_PREVIEW_PORT=43105 bun run --filter e2e test:pwa-preview` | 1 passed |
| `node apps/web/src/pwa/check-build.mjs` | Fails: `Missing Apple PWA metadata` |

The static PWA failure is caused by the pre-existing `apps/web/index.html`
working-tree replacement of `apple-mobile-web-app-capable` with
`mobile-web-app-capable`. Per the Task 4 brief, it was preserved rather than
reverted or fixed. The complete Playwright journey suite was not rerun in this
bounded handoff; the targeted visual-contract suite completed in 11.1 seconds.

## Scope review

- No application source, routes, API/auth behavior, translations, test IDs, or runtime configuration changed.
- No generated MUI class names or screenshot-only assertions were added.
- Existing critical-flow error capture remains active for accessibility and navigation tests.
- No new dependency was introduced.
