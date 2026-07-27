# Charcoal Premium Shell — Task 4 Review

| Field | Detail |
|---|---|
| Scope | `f4621da..b7185dc` — browser verification, documentation, and task tracking |
| Verdict | **NEEDS_FIX** |

## Findings

### Important

1. **The computed-style test does not prove the landmark surfaces are charcoal.**
   [`app-accessibility.spec.ts:64-82`](../../e2e/tests/app-accessibility.spec.ts) verifies an attribute and that the landmark element's own `color`/`backgroundColor` contrast at 4.5:1. A white surface with dark text (or any other sufficiently contrasting palette) still passes, even though it violates the approved `#1D1D1F` shell treatment. The test also reads the landmark container rather than a rendered shell label, so descendant overrides are outside this assertion.

   **Required fix:** retain the semantic role/attribute assertions, and assert each evaluated landmark has the expected computed charcoal background (`rgb(29, 29, 31)`). Keep the contrast calculation, ideally against a representative visible label/action within each landmark using stable role or `tid()` selectors.

2. **Task 4 is marked complete although its required complete browser-journey verification was skipped.**
   [`2026-07-27-charcoal-premium-shell-plan.md:280-301`](../../docs/superpowers/plans/2026-07-27-charcoal-premium-shell-plan.md) marks “Run complete verification” complete, but its required `bun run e2e -- --retries=0` command is absent from the report and the plan/report explicitly say the complete journey suite was not rerun. This leaves pricing, quote submission, error/retry, senior, and passkey flows without verification against the final visual shell commit.

   **Required fix:** run the documented full Playwright command against the local stack, perform its deterministic passkey cleanup if needed, record the result, and only then mark Step 4 complete. If the environment genuinely prevents it, leave the step unchecked and report the blocker instead of reporting Task 4 as complete.

### Minor

None.

## Positive observations

- The test changes use stable semantic roles and `tid()` selectors; no generated MUI classes or screenshot-only checks were introduced.
- Existing navigation, active-route, focus, no-overflow, mobile footer, and action-dock geometry assertions remain intact.
- The focused browser suite was independently rerun in this review: **13 passed** across desktop and mobile Chromium with retries disabled.
- The report accurately preserves and explains the unrelated, unstaged `apps/web/index.html` Apple PWA metadata limitation. That file was not reviewed as part of this task and must remain untouched.

## Verification reviewed

- `git diff --check f4621da b7185dc` — passed.
- Focused Playwright command from the Task 4 brief — **13 passed**.
- Static review of the implementation report, approved design, plan, and the changed E2E assertions.

## Recommendation

**NEEDS_FIX.** Address both Important findings, then request a follow-up review. The first ensures the new test detects a regression of the actual charcoal visual contract; the second provides the complete critical-journey evidence required by the approved plan.
