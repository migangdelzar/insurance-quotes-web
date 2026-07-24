# Task 1 Report: Luxury-fintech theme and shared visual primitives

Date: 2026-07-24

## Scope

Implemented only Task 1 from `.superpowers/sdd/task-1-brief.md`:

- updated the shared MUI theme tokens and overrides
- added `BrandMark`
- added `PageIntro`
- added `Surface`
- added `StatusBadge`
- added focused visual primitive tests

No routes, reducers, API contracts, auth flows, locale selector behavior, or existing `data-testid={tid(...)}` selectors were changed.

## Changed files

- `apps/web/src/shared/theme/theme.ts`
- `apps/web/src/shared/components/BrandMark.tsx`
- `apps/web/src/shared/components/PageIntro.tsx`
- `apps/web/src/shared/components/Surface.tsx`
- `apps/web/src/shared/components/StatusBadge.tsx`
- `apps/web/src/shared/components/visuals.test.tsx`
- `tasks/todo.md`

## TDD log

### RED

Command:

```bash
bun run --filter web test -- src/shared/components/visuals.test.tsx
```

Observed failure:

```text
FAIL  src/shared/components/visuals.test.tsx
Error: Failed to resolve import "./BrandMark" from "src/shared/components/visuals.test.tsx". Does the file exist?
```

This proved the new primitives were not present yet.

### GREEN attempt 1

Command:

```bash
bun run --filter web test -- src/shared/components/visuals.test.tsx
```

Observed failure:

```text
× shared visual primitives > keeps status meaning in text instead of color alone
Expected the element to have attribute:
  data-status="SUBMITTED"
Received:
  null
```

This narrowed the remaining gap to `StatusBadge` semantics.

### GREEN

Command:

```bash
bun run --filter web test -- src/shared/components/visuals.test.tsx
```

Observed result:

```text
✓ src/shared/components/visuals.test.tsx (5 tests)
Test Files  1 passed (1)
Tests  5 passed (5)
```

## Focused verification

### Lint

Command:

```bash
bun run --filter web lint
```

Observed result:

```text
✖ 3 problems (0 errors, 3 warnings)
```

Notes:

- warnings were pre-existing `react-refresh/only-export-components` warnings in:
  - `apps/web/src/app/routes.tsx`
  - `apps/web/src/features/auth/context/AuthProvider.tsx`
  - `apps/web/src/features/quote-wizard/context/QuoteWizardProvider.tsx`
- Task 1 introduced no new lint errors.

### Responsive/browser verification

Dev server command:

```bash
bun run --filter web dev -- --host 127.0.0.1 --port 3100
```

Responsive verification command:

```bash
bun run --filter e2e test -- tests/responsive-layout.spec.ts --project=desktop-chromium
```

Observed result:

```text
✓ login remains usable at 320px
✓ login remains usable at 375px
✓ login remains usable at 768px
✓ login remains usable at 1280px
4 passed (3.9s)
```

This covered:

- no horizontal overflow at the checked widths
- existing skip-link focus behavior remaining intact
- login title, username field, and submit button remaining visible

## Tests added

- `apps/web/src/shared/components/visuals.test.tsx`
  - luxury-fintech palette tokens
  - reduced-motion/focus token presence in the shared theme
  - `PageIntro` semantic `h1` rendering
  - `Surface` child visibility and tone marker
  - `StatusBadge` text semantics
  - `BrandMark` visible rendering

## Self-review

- Kept the change strictly inside shared theme/primitives.
- Did not add runtime dependencies.
- Preserved existing routes, reducer/auth behavior, and selectors.
- Used visible focus styles in the theme baseline and added a reduced-motion fallback.
- Kept spacing, borders, radius, and elevation decisions centralized in the theme/primitives.
- Avoided locale file edits because Task 1 did not require new localized copy.

## Concerns

- The new primitives are created and tested, but most user-facing pages still use their existing layouts until later redesign tasks integrate them.
- Browser verification for Task 1 was limited to the existing login responsive flow because broader shell/dashboard redesign is scheduled for later tasks.
