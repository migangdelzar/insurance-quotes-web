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

---

## Review fix follow-up: Important findings resolved

Date: 2026-07-24

### Review scope addressed

- accessible shared keyboard focus indicator on light and dark surfaces
- rendered-behavior Testing Library coverage for shared primitives
- shared theme-token derivation for `Surface` and `StatusBadge`
- `PageIntro` root semantics cleanup

### Changed files

- `apps/web/src/shared/theme/theme.ts`
- `apps/web/src/shared/components/visuals.test.tsx`
- `apps/web/src/shared/components/Surface.tsx`
- `apps/web/src/shared/components/StatusBadge.tsx`
- `apps/web/src/shared/components/PageIntro.tsx`
- `.superpowers/sdd/task-1-report.md`

### TDD evidence

#### RED

Command:

```bash
bun run --filter web test -- src/shared/components/visuals.test.tsx
```

Observed failures:

```text
× shared visual primitives > renders keyboard focus with an observable accessible ring on light and dark surfaces
  Expected two ring colors in box-shadow:

× shared visual primitives > renders a page intro with an accessible level-one heading in a generic container
  expected 'SECTION' to be 'DIV'

× shared visual primitives > derives the gold surface tone styles from shared theme tokens
  expected 'rgba(200, 166, 106, 0.16)' to be 'rgba(128, 90, 213, 0.16)'

× shared visual primitives > derives submitted status styling from shared theme tokens
  expected styling to follow the overridden success token
```

Root-cause notes:

- the global focus rule still used the low-contrast gold outline
- `PageIntro` still rendered a `section`
- `Surface` gold tone still depended on local RGBA values
- `StatusBadge` still depended on component-local status colors

#### GREEN

Command:

```bash
bun run --filter web test -- src/shared/components/visuals.test.tsx
```

Observed result:

```text
✓ src/shared/components/visuals.test.tsx (7 tests)
Test Files  1 passed (1)
Tests  7 passed (7)
```

### Verification

#### Lint

Command:

```bash
bun run --filter web lint
```

Observed result:

```text
✖ 3 problems (0 errors, 3 warnings)
```

Warnings remained pre-existing `react-refresh/only-export-components` warnings in:

- `apps/web/src/app/routes.tsx`
- `apps/web/src/features/auth/context/AuthProvider.tsx`
- `apps/web/src/features/quote-wizard/context/QuoteWizardProvider.tsx`

#### Responsive/browser check

Command:

```bash
E2E_BASE_URL=http://localhost:3100 bun run --filter e2e test tests/responsive-layout.spec.ts --project=desktop-chromium
```

Observed result:

```text
✓ login remains usable at 320px
✓ login remains usable at 375px
✓ login remains usable at 768px
✓ login remains usable at 1280px
4 passed (2.6s)
```

### What changed

- replaced the gold-only global focus outline with shared two-tone focus ring tokens exposed through CSS variables in the shared theme baseline
- made the focus ring observable in tests through rendered DOM/computed-style checks and verified contrast against both light and dark rendered surfaces
- replaced config-only visual assertions with rendered assertions for focus styling, `PageIntro`, `Surface`, `StatusBadge`, and `BrandMark`
- made `Surface` tone colors derive from shared theme palette tokens with `alpha(...)`
- made `StatusBadge` tone colors derive from shared theme palette tokens with `alpha(...)`
- changed `PageIntro` to use the default non-landmark container

### Self-review

- Kept the fix inside the reviewed shared theme/primitives and the existing Task 1 report.
- Did not change routes, reducers, auth, API behavior, or existing test IDs.
- Kept the primitive APIs unchanged while moving styling decisions into shared theme tokens.
- Verified the focus ring behavior with rendered DOM assertions instead of theme-object inspection.
- Left the existing lint warnings untouched because they predate this task and are outside the review scope.
