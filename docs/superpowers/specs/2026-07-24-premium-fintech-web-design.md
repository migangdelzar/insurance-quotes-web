# Premium Fintech Web Experience Design

| Field          | Detail                                                                     |
| -------------- | -------------------------------------------------------------------------- |
| **Repository** | `insurance-quotes-web`                                                     |
| **Date**       | 2026-07-24                                                                 |
| **Status**     | Approved design; implementation pending                                    |
| **Scope**      | Auth, application shell, quotes dashboard, quote wizard, responsive polish |

## 1. Goal

Redesign the insurance quote web application as a cohesive luxury-fintech experience. The redesign must feel trustworthy and premium while preserving all existing quote, authentication, localization, accessibility, and Playwright journeys.

## 2. Design direction

The visual direction is **luxury fintech**:

- Warm cream canvas for primary page backgrounds.
- Deep charcoal/navy surfaces for brand moments and navigation.
- Restrained champagne-gold accent for selected states, key actions, and premium emphasis.
- Cool slate text and borders for readable data presentation.
- Editorial display hierarchy paired with a practical system sans-serif stack.
- Thin borders, controlled radius, and shallow elevation instead of large gradients or shadow-heavy cards.

The design must avoid generic dashboard styling, excessive rounded cards, decorative gradients, and copy that does not describe the insurance journey.

## 3. Experience architecture

### 3.1 Application shell

`App` becomes the shared shell for authenticated and unauthenticated pages:

- Skip link remains the first focusable element.
- Header contains Clara wordmark, product label, secure-session indicator, language selector, and authenticated sign-out action.
- Main content uses a responsive page frame with a consistent maximum width and section rhythm.
- Footer contains trust statement, privacy/security links, support contact, and a small build/version line.
- Header/footer use semantic `header`, `main`, and `footer` landmarks.

The shell must not require authentication-specific data on the login route. Authentication controls are rendered from `AuthProvider` state and remain keyboard accessible.

### 3.2 Authentication

`LoginPage` uses a two-column desktop composition:

- Brand panel: concise Clara positioning, a short explanation of the quote process, and three trust signals.
- Authentication panel: existing password form, passkey action, error state, and enrollment dialog.

At mobile widths the brand panel becomes a compact introductory block above the form. Existing form labels, test IDs, MFA flow, and passwordless flow remain unchanged.

### 3.3 Quotes dashboard

`QuotesListPage` becomes a product dashboard:

- Page intro with eyebrow, title, descriptive copy, and new quote CTA.
- Summary strip showing total quotes and the most relevant current status when data exists.
- Quote collection rendered as purposeful data cards rather than a bare list.
- Status uses text plus a semantic badge, never color alone.
- Premium values use localized currency formatting and remain readable at narrow widths.
- Empty, loading, and API error states receive distinct branded treatments.

The page remains usable with zero quotes and preserves `quotesList.title`, `quotesList.empty`, `quotesList.startQuote`, and `common.loading` test IDs.

### 3.4 Quote wizard

The personal, coverage, and summary steps share a wizard frame:

- A progress rail shows the active phase and concise supporting copy.
- Main content is contained in a focused surface with clear section heading hierarchy.
- A side reassurance panel appears at desktop widths with privacy/security and “about 2 minutes” guidance.
- The premium estimate is a prominent but restrained financial summary.
- Navigation controls use consistent primary/secondary treatments and remain full-width/stacked on mobile.
- Summary uses a review table/card with clear edit-back affordances and a strong submission result state.

The existing wizard reducer, route guards, API synchronization, validation, error handling, and all wizard test IDs remain behaviorally unchanged.

## 4. Design tokens and components

Add a shared token layer in `apps/web/src/shared/theme/theme.ts`:

- Palette: `ink`, `charcoal`, `cream`, `surface`, `slate`, `gold`, `success`, `warning`, `error`.
- Typography: display, heading, body, label, and mono/data styles.
- Radius scale: small control radius and medium surface radius; no universal maximum rounding.
- Spacing scale based on the existing MUI spacing system.
- Focus ring and motion tokens with a reduced-motion fallback.

Create focused shared components under `apps/web/src/shared/components/`:

- `AppShell` — layout landmarks and responsive chrome.
- `BrandMark` — text/SVG-safe Clara identity treatment.
- `TrustBadge` — icon plus text for security/process signals.
- `PageIntro` — eyebrow, heading, description, actions.
- `StatusBadge` — accessible status label with semantic color and text.
- `Surface` — composable bordered/elevated section surface.

Components should use composition and slots rather than page-specific boolean prop matrices.

## 5. Localization and privacy

- All user-facing copy is added to `packages/app-i18n/src/data/translations/en-US.json` and `es-MX.json`.
- Stable test selectors are added to `packages/app-i18n/src/data/elements.json` only when a new interactive or journey-critical element needs one.
- No access token, refresh token, personal quote data, or secret is rendered into the footer, analytics, or debug output.
- Language switching uses the existing locale mechanism and updates visible shell copy without breaking the active route.

## 6. Accessibility and responsive requirements

- Preserve one logical `h1` per page and avoid skipped heading levels.
- All icon-only controls have accessible names; all form fields retain explicit labels.
- Dynamic loading, errors, submission results, and MFA state changes use status/live semantics where appropriate.
- Focus moves to the page heading after wizard route changes and remains visible against dark surfaces.
- Keyboard navigation covers header controls, authentication, wizard navigation, and footer links.
- Verify widths 320, 375, 768, 1024, and 1280px with no horizontal overflow.
- Honor `prefers-reduced-motion` and maintain WCAG AA contrast for text, controls, and focus indicators.

## 7. Compatibility and testing

The following behavior is out of scope for change:

- Authentication API contracts and passkey WebAuthn behavior.
- Quote API payloads, wizard reducer transitions, validation rules, and route guards.
- Existing Playwright test IDs and journey ordering.

Required verification:

- Existing web unit tests remain green.
- New component tests cover shell sign-out/language controls, status semantics, empty/loading/error states, and responsive content decisions.
- Existing Playwright journeys pass on desktop and mobile projects.
- Responsive layout checks pass at all required widths.
- Browser review confirms no console errors, visible focus loss, horizontal overflow, or missing accessible names.

## 8. File map

Expected implementation files:

```text
apps/web/src/app/App.tsx                         # shell composition
apps/web/src/shared/theme/theme.ts               # tokens and MUI overrides
apps/web/src/shared/components/AppShell.tsx      # header/main/footer shell
apps/web/src/shared/components/BrandMark.tsx      # brand identity
apps/web/src/shared/components/PageIntro.tsx      # page intro composition
apps/web/src/shared/components/StatusBadge.tsx    # status presentation
apps/web/src/shared/components/Surface.tsx        # shared surface
apps/web/src/features/auth/pages/LoginPage.tsx   # premium auth composition
apps/web/src/pages/QuotesListPage.tsx            # dashboard composition
apps/web/src/features/quote-wizard/...           # shared wizard framing
packages/app-i18n/src/data/translations/*.json    # localized copy
packages/app-i18n/src/data/elements.json          # new stable selectors, if needed
```

The final plan may split large page changes into smaller component-focused tasks while keeping this file map authoritative.
