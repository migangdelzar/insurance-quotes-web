# Task 6 implementation report

## RED

Added `apps/web/src/pages/NotFoundPage.test.tsx` before the redesigned page.

Command:

```text
bun run --filter web test -- src/pages/NotFoundPage.test.tsx
```

Result: failed because the existing page did not render a level-one heading or the new recovery presentation.

## GREEN

Implemented a localized, responsive not-found recovery surface using `PageIntro`, `Surface`, and the existing `tid('notFound.*')` selectors. Added matching English and Spanish copy and preserved the `/quotes` recovery route.

## Verification

- `bun run --filter web test -- src/pages/NotFoundPage.test.tsx` — passed, 1/1.
- `bun run --filter web test -- src/pages/NotFoundPage.test.tsx src/features/quote-wizard/components/WizardFrame.test.tsx` — passed, 4/4.
- `bun run --filter @clara/app-i18n test` — passed, 5/5.
- `bun run --filter @clara/app-i18n validate` — passed.
- `bun run --filter web lint` — passed with the three existing Fast Refresh warnings.
- `bun run --filter web build` — passed; the existing Vite large-chunk warning remains.
