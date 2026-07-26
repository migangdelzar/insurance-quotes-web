# App-first PWA UX design

| Field             | Detail                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Date              | 2026-07-26                                                                                     |
| Status            | Approved for planning                                                                          |
| Scope             | `insurance-quotes-web`                                                                         |
| Product direction | Minimal, app-like insurance quote workspace                                                    |
| Related baseline  | Existing React/Vite/MUI quote wizard, authentication, same-origin API, and Playwright journeys |

## 1. Objective

Turn the existing quote web application into a focused, installable web app with a clear information hierarchy and a low-friction quote journey. The experience should feel closer to a carefully designed mobile product than to a collection of website pages: navigation is persistent and predictable, the primary action is obvious, screens contain only the information needed for the current task, and loading/error states are calm and actionable.

The redesign must preserve the existing backend contracts, authentication behavior, pricing rules, routes, test IDs, and successful standard, senior, retry, passkey, responsive, and same-origin journeys.

## 2. Product principles

1. **One primary action per screen.** The user should immediately understand what to do next.
2. **Navigation is always discoverable.** The current destination is visible, and users can return to quotes without browser-history guessing.
3. **Progressive disclosure.** Health questions, account actions, and secondary support details appear only when relevant.
4. **Calm feedback.** Skeletons preserve layout while data loads; errors explain recovery; transitions do not flicker or move the user unexpectedly.
5. **Mobile-first, desktop-capable.** The mobile layout is the reference experience, with a sidebar and wider content regions added at larger widths.
6. **Accessible by default.** Semantic landmarks, keyboard navigation, visible focus, readable contrast, and screen-reader announcements are part of the definition of done.

## 3. Information architecture

The authenticated application has four primary destinations:

| Destination | Purpose                                           | Primary action                   |
| ----------- | ------------------------------------------------- | -------------------------------- |
| Home        | Orientation, quote snapshot, and recent activity  | Start a quote                    |
| Quotes      | Browse all quote records and statuses             | Start a quote or refresh history |
| New quote   | Complete the personal, coverage, and summary flow | Continue / submit quote          |
| Account     | Language, session, security, and support links    | Change preference or sign out    |

Existing URLs remain compatible:

- `/quotes` remains the quote workspace and can act as the Home destination until a separate dashboard route is justified.
- The Home and Quotes destinations may initially share `/quotes`; navigation can present Home as the default overview and Quotes as the history focus without introducing duplicate backend queries.
- `/quote/personal`, `/quote/coverage`, and `/quote/summary` remain the wizard routes.
- The New quote destination opens `/quote/personal` and resets the wizard only when starting a new quote intentionally.
- `/login` remains outside the authenticated shell.
- Existing redirects and step guards remain unchanged.

The initial implementation should avoid introducing a separate dashboard data source. Home can be a focused presentation of the existing quotes query, with a dedicated route deferred until the information architecture proves it is needed.

## 4. App shell and navigation

### Desktop

Use a compact persistent sidebar or navigation rail containing the brand, four primary destinations, and the active state. The main content region has a restrained top bar with the current page context and account affordance. The shell should not repeat the same language and sign-out controls in multiple places.

### Mobile

Use a fixed bottom navigation bar with four labeled destinations and icons. It must include safe-area padding, a visible active state that is not communicated by color alone, and enough touch target size for comfortable use. Wizard action controls remain above the navigation bar and must not overlap it.

### Account menu

Language switching, security/passkey affordances, support, privacy, and sign-out live in one account surface. The surface may be a menu on desktop and a full-width sheet/page on mobile, but it must use the same semantic content and keyboard behavior.

### Authenticated shell boundaries

The app shell is not rendered for the login page. The login experience receives its own focused auth layout with the same brand and visual tokens, without navigation that cannot be used before authentication.

## 5. Page experience

### Home / quotes workspace

- Show one prominent start-quote action.
- Keep summary metrics concise: total quotes, submitted quotes, and monthly premium value.
- Present recent quotes in a scannable list on mobile and a purposeful two-column layout on desktop.
- Use status badges with text and accessible labels, not color alone.
- Provide a clear empty state with one next action.
- Keep retry behavior adjacent to the failed request and preserve the rest of the page shell.

### Quote wizard

- Retain three meaningful stages: personal information, coverage, and review/submit.
- Use a compact progress indicator with the current stage announced to assistive technology.
- Each stage has one content surface, one clear heading, concise helper copy, and a single primary continuation action.
- Personal information uses explicit labels and inline validation tied to fields.
- Coverage presents plan selection first. Senior health questions appear only when the age rule requires them.
- Summary presents the chosen plan, monthly premium, covered health factors, and explicit submit/retry outcomes.
- Keep the fixed mobile action dock, but make its relationship to the bottom navigation explicit through spacing and safe-area handling.
- Include a consistent return-to-quotes action without making users lose their current wizard state unexpectedly.

### Loading, error, and success states

- Use skeletons that match the final layout dimensions and retain headings or context where possible.
- Avoid replacing an entire result area with a spinner when the surrounding content can remain stable.
- Use `role="status"` or `aria-live` only for meaningful state changes, not every render.
- Submit failures retain the review data and expose a retry action.
- Successful submission clearly communicates the submitted state and offers `View all quotes` and `Start a new quote`.

## 6. Component architecture

The redesign reduces visible composition without requiring a destructive source rewrite. Prefer a small set of composed primitives:

```text
shared/components/
├── AppShell
│   ├── AppNavigation
│   ├── AppHeader
│   ├── AccountMenu
│   └── MobileBottomNavigation
├── AppPage
├── AppCard
├── LoadingState
├── EmptyState
└── ErrorState

features/quote-wizard/components/
├── WizardFrame
├── WizardProgress
├── WizardActionDock
└── PremiumDisplay
```

The exact files may be consolidated where two components have no independent behavior, but each component must have one responsibility. Data fetching remains in page/container hooks, while visual components receive data and callbacks. Do not create one-off wrappers for styling alone.

Stable test IDs remain owned by the app-i18n `tid()` contract and continue to be applied at behavior boundaries rather than decorative wrappers.

## 7. Visual direction

Use the existing Emme-derived light palette already introduced in the frontend:

- Background: `#FBFBFD`
- Surface: `#FFFFFF`
- Primary action: `#0071E3`
- Primary text: `#1D1D1F`
- Secondary text: accessible darker slate derived from the Emme neutral system
- Borders: restrained neutral dividers
- Status colors: semantic success, warning, and error tokens with sufficient contrast

Use a small spacing scale, consistent corner radii, minimal shadows, and typography that prioritizes task headings over decorative marketing copy. The interface should feel premium through restraint, alignment, and responsiveness rather than gradients or oversized cards.

## 8. PWA behavior

Add installable web-app metadata:

- Web app manifest with app name, short name, description, `start_url`, `display: standalone`, light theme/background colors, and icons.
- Apple mobile web-app metadata where supported.
- A service worker that caches the static application shell and versioned assets.
- Network-first behavior for API requests; quote creation, coverage updates, login, and submission must never be falsely reported as successful while offline.
- A small offline state that explains connectivity is required for account and quote mutations.
- Build verification that confirms the manifest and service worker assets are present in the production output.

PWA support must not cache authentication tokens, private API responses, or mutable quote data in a way that could expose one user’s data to another user on a shared device.

## 9. Accessibility and interaction quality

- Use `header`, `nav`, `main`, `footer`, and heading levels consistently.
- Every icon-only control has an accessible name; every form control has a programmatic label.
- Maintain logical keyboard order across desktop navigation, mobile menus/sheets, wizard steps, and submit/retry states.
- Move focus to the new page heading after route changes and to the first meaningful error after validation failure.
- Meet WCAG AA contrast for text, focus indicators, controls, and status messages.
- Support `prefers-reduced-motion`; no essential information depends on animation.
- Ensure fixed controls never cover focused content or form errors at 320px, 375px, 768px, 1024px, and 1440px widths.

## 10. Compatibility and data constraints

- Do not change backend pricing or health-condition semantics.
- Diabetes and hypertension continue to be represented as health conditions and contribute through the approved single pre-existing-condition factor.
- Preserve same-origin `/api` behavior and the existing Nginx proxy.
- Preserve authentication, passkey fallback, locale selection, and `Accept-Language` propagation.
- Do not add client-side quote persistence that could conflict with the server source of truth.

## 11. Verification strategy

### Unit and component tests

- Navigation renders the correct active destination and accessible names.
- Mobile navigation and account surface can be operated with keyboard and have visible active state.
- Skeleton, empty, error, and success states preserve meaningful semantics.
- Wizard action dock respects safe-area/layout constraints and retains stable selectors.
- PWA metadata and generated assets are present after a production build.

### Browser tests

- Login and password/passkey fallback.
- Navigate between Home, Quotes, New quote, and Account on desktop and mobile.
- Complete standard and senior journeys, including diabetes and hypertension.
- Submit successfully, retry an insurer failure, start a new quote, and return to all quotes.
- Verify no horizontal overflow at supported viewports.
- Verify console has no application errors and critical network calls remain same-origin.

### Accessibility checks

- Heading hierarchy and landmark inspection.
- Keyboard-only navigation through shell, menus, form fields, and wizard actions.
- Focus visibility and focus restoration after route/state changes.
- Contrast checks for Emme palette tokens and status states.

## 12. Acceptance criteria

- [ ] Authenticated users can identify and reach Home, Quotes, New quote, and Account from every supported viewport.
- [ ] The mobile experience uses bottom navigation without overlapping wizard actions or content.
- [ ] The desktop experience uses a compact persistent navigation region without duplicating controls.
- [ ] The quote flow remains complete, understandable, and recoverable when requests are loading or fail.
- [ ] Skeletons, empty states, and errors are visually stable and accessible.
- [ ] The app can be installed as a PWA and presents a safe offline shell without caching private mutable data.
- [ ] Existing API contracts, routes, test IDs, pricing behavior, and Playwright journeys remain compatible.
- [ ] Frontend tests, lint, production build, PWA asset checks, and full browser journeys pass.

## 13. Out of scope

- Replacing the backend or changing quote pricing rules.
- Offline quote creation, offline submission, or local-first synchronization.
- A new analytics product or business metrics dashboard.
- Replacing React Router, TanStack Query, MUI, or the existing i18n contract.
- Adding decorative animation that does not improve task comprehension.
