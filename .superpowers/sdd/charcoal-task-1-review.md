# Charcoal premium shell — Task 1 review

## Scope and evidence

- **Reviewed range:** `5dbe126..6518e17`
- **Task brief:** `.superpowers/sdd/charcoal-task-1-brief.md`
- **Implementer report:** `.superpowers/sdd/charcoal-task-1-report.md`
- **Diff package:** `.superpowers/sdd/review-charcoal-task1.diff`
- **Source reviewed:** `apps/web/src/shared/theme/theme.ts` and
  `apps/web/src/shared/components/visuals.test.tsx`

This was a read-only source review. The pre-existing working-tree modification
to `apps/web/index.html` is outside the reviewed commit, remains unstaged, and
was not changed.

## Spec-compliance assessment

Task 1 complies with the charcoal-premium-shell plan:

- `theme.palette.shell` is correctly augmented in the MUI palette types and
  exposed as a semantic shell token.
- `shell.main` is `#1D1D1F` and `shell.contrastText` is `#F5F5F7`, while the
  light canvas remains `#FBFBFD` and the primary action remains `#0071E3`.
- Inter remains the primary font family and no dependencies were added.
- The theme keeps component-local color use out of the application surface;
  the new visual values are confined to the theme module.
- The input and chip refinements use existing theme spacing and palette values.
  The existing focus-ring contract remains in place and is covered on both
  light and dark surfaces.
- No route, API, auth, pricing, translation, test-ID, PWA, focus-management,
  safe-area, or keyboard-behavior code is changed.
- The tracked diff does not include `apps/web/index.html`, preserving the
  unrelated change as required.

The shell foreground/background pair has materially stronger-than-AA contrast,
and the existing visual test continues to verify a visible focus ring with a
minimum 3:1 contrast ratio against both light and dark surfaces.

## Task quality assessment

The change is small, coherent, and appropriately located. The palette module
is the correct single source of truth for a semantic shell color, and the
augmentation makes later consumers type-safe. The tests directly protect the
new token contract and the required restrained button/paper defaults. The
additional outlined-input and chip overrides are theme-level presentation
defaults, with no behavioral or state coupling.

The implementation report’s RED/GREEN account is consistent with the final
diff: only the previously missing `shell` palette contract needed to change;
the already-established button and paper defaults were retained.

## Verification performed

- `git show --check 6518e17` — passed.
- `git diff --check 5dbe126 6518e17` — passed.
- `bun run --filter web test --run src/shared/components/visuals.test.tsx` —
  passed: 1 file, 10 tests.
- `bun run --filter web lint` — passed with 0 errors. It reports only the 3
  known, unrelated Fast Refresh warnings in `routes.tsx`, `AuthProvider.tsx`,
  and `QuoteWizardProvider.tsx`.
- Reviewed diff boundaries confirm no tracked change to `apps/web/index.html`.

The implementer additionally reports the full web suite passing (28 files,
104 tests). That full-suite result was not re-run for this narrow theme-only
review; the focused suite and static diff validation were independently run.

## Findings

### Critical

None.

### Important

None.

### Minor

None.

## Verdict

**Approved.** Task 1 meets its specified token, visual-default, accessibility,
and isolation requirements. It is ready for Task 2 to consume
`theme.palette.shell` for the authenticated shell surfaces.
