# App-first PWA UX — Task 5 report

## Scope

Improved the quote wizard framing and mobile action behavior without changing
wizard routes, reducer rules, quote API payloads, pricing, or authentication.

## Red → Green evidence

- RED:
  `bun run --filter web test --run src/shared/components/LoadingState.test.tsx src/features/quote-wizard/components/WizardFrame.test.tsx src/features/quote-wizard/components/WizardActionDock.test.tsx src/features/quote-wizard/steps/summary/SubmissionResult.test.tsx`
  failed as expected: `LoadingState` did not exist, the action navigation used
  a hard-coded label, and the timed-out submission state was an alert rather
  than a stable status region.
- GREEN:
  the same focused suite passed with 11 tests after adding the shared loading
  primitive, localized action label, retained checking selector, and wizard
  framing updates.

## Changes

- Added `LoadingState`: a semantic live status with a stable skeleton layout.
- Kept the existing `wizard.summary.checking` selector while using the new
  loading primitive for insurer-timeout checking.
- Added compact progress `aria-current` semantics and labelled each wizard
  content surface by its focusable stage heading.
- Moved the mobile action dock above the fixed bottom navigation, with enough
  content reserve to avoid covering focused controls.
- Localized the wizard action navigation name in English and Mexican Spanish.
- Added coverage for loading semantics, active wizard stage, localized action
  navigation, success actions, retry after insurer failure, and checking state.

## Verification

- Focused wizard suite: 17 tests passed.
- Full web suite: 78 tests passed.
- `bun run --filter @clara/app-i18n test --run`: 5 tests passed.
- `node packages/app-i18n/src/validate.mjs`: passed.
- `bun run --filter web lint`: 0 errors; 3 pre-existing Fast Refresh warnings.
- `bun run --filter web build`: passed; existing chunk-size advisory remains.

## Self-review

- Existing routes, auth boundaries, quote API calls, reducer state transitions,
  pricing rules, and stable test IDs are preserved.
- The checking-state selector remains `submission-checking`.
- No unrelated files were changed.

## Concerns

None. The build retains the repository's pre-existing chunk-size advisory.
