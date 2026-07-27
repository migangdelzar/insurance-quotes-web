# Charcoal Premium Shell Design

| Field            | Detail                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| **Date**         | 2026-07-27                                                              |
| **Status**       | Approved design; implementation pending written-spec review             |
| **Scope**        | Frontend visual polish for the authenticated app shell and core widgets |
| **Related plan** | `docs/superpowers/plans/2026-07-26-app-first-pwa-ux-plan.md`            |

## 1. Goal

Refine the insurance quotes web app into a more confident, premium product experience by introducing a charcoal application shell, stronger contrast, clearer typography hierarchy, and more consistent widget/icon treatments. The redesign must preserve the existing routes, API contracts, localization, authentication, pricing behavior, PWA boundaries, and Playwright selectors.

## 2. Visual direction

Use the existing Clara/Emme light content palette with a charcoal chrome:

- Header, desktop navigation rail, mobile bottom navigation, and footer use `#1D1D1F`.
- Shell text uses white for primary labels and a muted gray for secondary labels.
- The existing blue primary action remains the interactive accent.
- Gold remains a restrained supporting accent for premium or highlighted information, not a general background.
- The page canvas remains a light cream/white surface so long-form forms and quote data stay easy to scan.

Avoid gradients, decorative texture, excessive shadows, and oversized rounded cards. Use the existing spacing scale and a small radius hierarchy: compact controls, standard cards, and only larger framing surfaces where the content warrants it.

## 3. Component changes

### Theme

Update the MUI theme tokens and component defaults to provide:

- explicit shell colors and accessible text contrast;
- stronger but restrained dividers/borders for cards and form sections;
- typography with clearer heading weight, tighter display tracking, and readable body/secondary text;
- consistent button, Paper/Card, input, chip, and focus-ring treatments;
- icon sizing and alignment defaults that work across desktop and mobile.

### App shell and navigation

Update `AppShell` and `AppNavigation` so the header, navigation surfaces, and authenticated footer use the charcoal shell. Preserve the existing landmark structure, skip link, account menu, active route semantics, fixed mobile navigation, safe-area spacing, and route-heading focus behavior. Active navigation must remain identifiable through label weight, icon treatment, and a visible indicator rather than color alone.

### Widgets and icons

Polish the reusable visual surfaces used by the dashboard, account page, wizard frame, premium display, action dock, loading/error states, and status indicators. Prefer semantic existing icons or the project's inline SVG approach; do not add an icon dependency. Icons must remain decorative when adjacent visible text provides the accessible name, and icon-only controls must retain explicit accessible labels.

### Typography and content hierarchy

Keep Inter as the primary typeface. Improve hierarchy through size, weight, line height, and contrast rather than adding a second font. Ensure every page retains one clear `h1`, section headings remain ordered, and helper text is visually subordinate without falling below accessible contrast.

## 4. Responsive behavior

- At 320px and 375px, the charcoal bottom navigation remains readable, tappable, and clear of wizard actions and footer content.
- At 768px, the shell transitions without horizontal overflow or cramped controls.
- At 1024px and 1440px, the charcoal desktop rail and header have stable alignment and the content frame remains focused.
- Safe-area padding and existing fixed-navigation geometry must remain intact.

## 5. Accessibility constraints

- Preserve or improve WCAG AA contrast for normal text, controls, focus rings, and status states.
- Keep keyboard navigation, skip-to-content, Escape behavior, route focus, and visible focus indicators working.
- Do not use color as the only active/error/success signal; retain labels, icons, borders, or status text.
- Keep semantic landmarks and accessible names unchanged unless the change improves them.
- Verify the shell and representative widget states in browser accessibility/navigation coverage.

## 6. Verification

The implementation will add or update focused visual/token tests where practical and run:

- full web unit tests;
- web lint and production build;
- PWA artifact checker;
- existing app navigation, accessibility, responsive, and quote journey Playwright suites;
- responsive visual/geometry checks at 320, 375, 768, 1024, and 1440px;
- a live runtime smoke check against the current Nginx/API stack with no browser console errors.

## 7. Out of scope

- API, authentication, authorization, pricing, Redis, Kafka, observability, and database behavior;
- route or test-ID changes;
- new icon, font, animation, or styling dependencies;
- broad page information-architecture changes;
- changing the existing localization catalog structure.
