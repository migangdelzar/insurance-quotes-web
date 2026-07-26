# Mobile Wizard Polish Design

| Field      | Detail                                                                        |
| ---------- | ----------------------------------------------------------------------------- |
| Date       | 2026-07-26                                                                    |
| Scope      | Quote wizard small-device layout, actions, progress, motion, and verification |
| Repository | `insurance-quotes-web`                                                        |
| Status     | Approved for implementation                                                   |

## Goal

Make the quote wizard feel deliberate and premium on 320–430px screens while
preserving the existing routes, reducer, API contracts, i18n API, and desktop
layout.

## Decisions

- Wizard actions become full-width on small screens.
- The primary action is sticky at the bottom on small screens with safe-area
  padding and a content spacer so it never obscures form controls.
- Secondary navigation remains in normal document flow.
- Progress becomes a compact, readable step summary on narrow screens while
  retaining the full progress treatment at larger widths.
- Cards, health questions, premium display, and summary rows use a tighter
  mobile spacing scale without introducing arbitrary pixel values.
- Motion uses CSS/MUI transitions only, with `prefers-reduced-motion` disabling
  non-essential transitions. No new animation dependency is introduced.
- Existing typed `tid()` selectors and heading-focus behavior remain stable.

## Component boundaries

- `WizardFrame` owns the responsive shell, mobile action slot, and safe-area
  spacer.
- Each wizard step owns its primary/secondary action content and passes it to
  the frame only where state requires it.
- `WizardProgress` owns the compact mobile progress label and desktop progress
  navigation.
- Step-specific components own field grouping and health-question wrapping.

## Verification contract

- Component tests assert the mobile action structure and reduced-motion-safe
  classes/styles without testing implementation-only CSS internals.
- Playwright checks at 320px and 375px assert no horizontal overflow, visible
  primary actions, focusable headings, readable step state, and no clipped
  controls.
- Existing 768px and desktop journeys remain green.
- A headed Playwright recording can capture the standard quote happy path from
  login through submission for product review.
