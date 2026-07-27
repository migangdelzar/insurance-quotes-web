# App-first post-review hardening A — coverage synchronization

## Scope

Fix the coverage wizard race in which a user could select coverage and immediately advance to Summary before the 400 ms debounce issued its PATCH request. This could omit coverage and senior health factors from the server-owned calculation.

## Root cause

`useDebouncedCoverageSync` stored its only update in an effect-owned timer. `CoverageStep` navigated immediately on Next, unmounting the step and clearing that timer before `updateCoverage` ran.

## Red → Green evidence

Initial focused RED run:

```text
useDebouncedCoverageSync: result.current.flush is not a function
CoverageStep: expected updateCoverage to be called; Number of calls: 0
```

Implemented an awaitable `flush()` that cancels the scheduled timer, performs the latest pending update, and awaits it. CoverageStep now awaits that operation before it navigates. Rejections keep the user on Coverage so the existing mutation error presentation remains available.

## Regression coverage

- `useDebouncedCoverageSync.test.tsx` uses fake timers to flush a pending senior update and verifies diabetes and hypertension are included exactly once.
- `CoverageStep.test.tsx` uses a deferred PATCH after an immediate Premium/Next action and asserts Summary is absent until that promise resolves.
- `CoverageStep.test.tsx` rejects an immediate Next PATCH and asserts that Summary remains absent while the existing API error alert is visible.

## Follow-up review remediation

The reviewer correctly noted that an immediately resolved mock could not prove navigation awaited the PATCH. The strengthened deferred-PATCH test was mutation-checked by temporarily replacing `await flush()` with `void flush()`: it failed because Summary rendered before the request resolved. The rejection test failed under the same temporary mutation because navigation unmounted the error alert. The production `await flush()` implementation was restored unchanged before green verification.

## Verification

| Command | Result |
| --- | --- |
| `bun run --filter web test --run src/features/quote-wizard/steps/coverage/useDebouncedCoverageSync.test.tsx src/features/quote-wizard/steps/coverage/CoverageStep.test.tsx` | 2 files / 3 tests passed |
| `bun run --filter web test --run` | 27 files / 90 tests passed |
| `bun run --filter web lint` | 0 errors; 3 pre-existing Fast Refresh warnings |
| `bun run --filter web build` | Passed; existing chunk-size advisory only |

## Commit

`0b1feee fix(web): flush coverage before summary navigation` (pushed to `origin/feat-frontend`)

## Changed files

- `apps/web/src/features/quote-wizard/steps/coverage/useDebouncedCoverageSync.ts`
- `apps/web/src/features/quote-wizard/steps/coverage/CoverageStep.tsx`
- `apps/web/src/features/quote-wizard/steps/coverage/useDebouncedCoverageSync.test.tsx`
- `apps/web/src/features/quote-wizard/steps/coverage/CoverageStep.test.tsx`
- `tasks/todo.md`
- `tasks/lessons.md`

## Self-review

The normal 400 ms debounce remains the default for selection changes. No API contract, quote route, authentication behavior, test ID, or pricing logic changed. The PATCH continues to be the backend authority for premium calculation.
