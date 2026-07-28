# Light/Dark Fixed Shell Design

| Field      | Detail                                                                          |
| ---------- | ------------------------------------------------------------------------------- |
| Date       | 2026-07-27                                                                      |
| Status     | Draft for user review                                                           |
| Scope      | Frontend theme, authenticated shell, navigation, and visual-boundary refinement |
| Supersedes | The charcoal-only treatment in `2026-07-27-charcoal-premium-shell-design.md`    |

## Goal

Make the Clara quote workspace easier to read by separating the page canvas,
widgets, and chrome with deliberate surface and border tokens. Add a fixed
desktop header and left navigation rail with icons, while retaining the mobile
bottom navigation. Add a persistent, accessible light/dark theme preference
that starts from the operating-system preference.

## Visual system

Use semantic MUI theme tokens rather than raw component colors.

Light mode:

- canvas: cool gray `#F4F6F8`;
- primary surface: white;
- secondary surface: `#E9EDF2`;
- border: cool slate `#CBD3DD`;
- text: near-black `#171A1F` and muted slate;
- shell: deep graphite with light labels;
- existing Clara blue remains the primary interactive accent.

Dark mode:

- canvas: `#101419`;
- primary surface: `#1A2028`;
- secondary surface: `#232C36`;
- border: `#3A4653`;
- text: `#F3F6F8` and muted cool gray;
- shell: `#0B0F13` with light labels;
- existing blue remains the primary interactive accent with theme-safe contrast.

Widgets use a visible border and a small elevation difference. Shadows remain
subtle and never carry the only meaning. Success, warning, error, and premium
states retain semantic text/icon cues in addition to color.

## Shell and navigation

- Authenticated header is fixed at the top of the viewport.
- Desktop navigation is fixed below the header, uses an icon for each primary
  destination, and keeps the translated label visible.
- Main content receives responsive top/left offsets so fixed chrome never
  covers headings, forms, footer content, or wizard actions.
- Mobile retains the fixed bottom navigation and safe-area offsets; the header
  remains fixed and compact.
- Existing landmarks, route semantics, active `aria-current`, skip link,
  account menu behavior, stable `tid()` selectors, and keyboard focus remain.

## Theme behavior

- Initial mode follows `prefers-color-scheme` when no user preference exists.
- An explicit toggle stores `light` or `dark` in local storage and applies it
  without changing routes or server state.
- The toggle is a labeled button with an icon and text/tooltip, keyboard
  reachable, and not color-only.
- Theme changes update document-level color variables and MUI tokens without
  requiring a reload.

## Implementation boundaries

Expected areas:

- `apps/web/src/shared/theme/theme.ts` and a small theme-preference hook/context;
- `apps/web/src/main.tsx` for theme composition;
- `apps/web/src/shared/components/AppShell.tsx` and `AppNavigation.tsx`;
- shared icon/theme-toggle component tests;
- existing widget styles only where needed to consume semantic surface/border
  tokens.

No API, auth, pricing, i18n catalog, route, dependency, or backend changes.
The pre-existing `apps/web/index.html` working-tree edit remains untouched.

## Verification

- Unit tests for theme preference initialization, persistence, and toggle labels.
- Component tests for fixed shell landmarks, icon navigation, and theme toggle.
- Browser checks for both modes, computed contrast, fixed geometry, no overflow,
  keyboard navigation, and mobile safe-area/action-dock clearance.
- Full web tests, lint, production build, PWA preview, and complete Playwright
  journeys.
