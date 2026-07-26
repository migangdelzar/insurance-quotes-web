# Mobile Wizard Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the quote wizard for small devices with sticky primary actions, compact progress, stable spacing, accessible motion, and a recorded happy path.

**Architecture:** `WizardFrame` owns responsive shell and action placement; `WizardProgress` owns the narrow progress summary; individual steps continue to own form behavior and typed selectors. CSS/MUI transitions are preferred over a new animation dependency.

**Tech Stack:** React, TypeScript, MUI, Vite, Vitest, Playwright.

## Global Constraints

- Preserve routes, reducer actions, API payloads, `t()` and typed `tid()` selectors.
- Support 320px, 375px, 768px, and desktop layouts.
- Do not introduce horizontal scrolling or cover fields with sticky actions.
- Honor `prefers-reduced-motion`.
- Keep all interactive controls keyboard accessible.

### Task 1: Responsive wizard frame and action dock

**Files:**

- Modify: `apps/web/src/features/quote-wizard/components/WizardFrame.tsx`
- Modify: `apps/web/src/features/quote-wizard/steps/personal/PersonalInfoStep.tsx`
- Modify: `apps/web/src/features/quote-wizard/steps/coverage/CoverageStep.tsx`
- Modify: `apps/web/src/features/quote-wizard/steps/summary/SummaryStep.tsx`
- Test: `apps/web/src/features/quote-wizard/components/WizardFrame.test.tsx`

- [ ] Write failing tests for a mobile action dock slot and content spacer semantics.
- [ ] Run the focused test; expect failure because `WizardFrame` has no action dock contract.
- [ ] Implement a responsive `actions` slot with full-width small-screen buttons, safe-area padding, and a spacer that prevents overlap.
- [ ] Keep secondary actions in-flow and route existing `data-testid` values through unchanged buttons.
- [ ] Run focused tests and full web tests; expect green.
- [ ] Commit `feat(web): add mobile wizard action dock`.

### Task 2: Compact progress and mobile spacing

**Files:**

- Modify: `apps/web/src/features/quote-wizard/components/WizardProgress.tsx`
- Modify: `apps/web/src/features/quote-wizard/components/WizardFrame.tsx`
- Modify: `apps/web/src/features/quote-wizard/steps/coverage/HealthQuestionsSection.tsx`
- Modify: `apps/web/src/shared/theme/theme.ts`
- Test: `apps/web/src/features/quote-wizard/components/WizardFrame.test.tsx`
- Test: `e2e/tests/responsive-layout.spec.ts`

- [ ] Add failing assertions for visible compact step state and narrow-screen control width.
- [ ] Run the focused tests; expect failure against the current desktop-first progress layout.
- [ ] Implement compact mobile progress, stable grid/flex wrapping, and reduced-motion-safe transition styles.
- [ ] Run component and responsive tests; expect green.
- [ ] Commit `refactor(web): polish wizard progress for small screens`.

### Task 3: Headed happy-path recording and browser verification

**Files:**

- Modify: `e2e/playwright.config.ts`
- Create: `e2e/tests/wizard-demo-recording.spec.ts`
- Modify: `tasks/todo.md`

- [ ] Write a failing browser contract for the mobile happy path ending in the successful submission state.
- [ ] Run it against mocked API routes; expect failure until the new selectors and action layout are verified.
- [ ] Add a focused recordable journey with video enabled only for this spec, using typed selectors and no credential capture.
- [ ] Run at 320px and 375px with screenshots/video on success and failure; verify no overflow, visible primary actions, and clean console/network behavior.
- [ ] Commit `test(web): record mobile quote journey`.

### Task 4: Final visual/accessibility gate

**Files:**

- Modify: `tasks/lessons.md`
- Modify: `tasks/todo.md`

- [ ] Run web tests, lint, build, E2E responsive and demo recording tests.
- [ ] Inspect screenshots at 320px, 375px, and 768px for clipping, action overlap, focus visibility, and excessive motion.
- [ ] Record verification evidence and remaining limitations.
- [ ] Commit `docs(web): record mobile wizard verification`.
