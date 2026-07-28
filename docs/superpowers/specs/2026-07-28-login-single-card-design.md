# Login Single-Card Design

## Goal

Remove the duplicated marketing aside from the login page and present a focused, centered authentication card while preserving all authentication, passkey, MFA, localization, accessibility, and responsive behavior.

## Current Context

`apps/web/src/features/auth/pages/LoginPage.tsx` currently renders two `Surface` components: a dark marketing `aside` and the login `section`. The unauthenticated `AppShell` already renders the Clara brand in the fixed header, so the aside repeats brand and trust content without helping the sign-in task.

## Approved Design

- Delete the login page's `Surface component="aside"` and its marketing/trust content.
- Keep one centered login `Surface component="section"` inside the existing `AppShell` container.
- Cap the card at approximately `560px` and use the existing responsive spacing scale; it remains full-width within the mobile content gutter.
- Promote the existing translated login title from `h2` to the page's single `h1`.
- Preserve the existing `tid('auth.login.title')` selector and use it for the section's `aria-labelledby` and heading `id`.
- Preserve the password form, passkey button, MFA prompt, passkey enrollment dialog, routes, auth context, translations, and all other stable test IDs.
- Do not delete the now-unused marketing translation keys yet; they remain catalog-compatible and can be removed separately after a locale audit.

## Accessibility Contract

- Anonymous login renders exactly one level-one heading.
- The form remains named by `aria-labelledby` and described by `auth-login-description`.
- Username/password autocomplete and labels remain unchanged.
- MFA and passkey enrollment behavior remain unchanged.
- Focus and error behavior remain unchanged.

## Verification

- Update `LoginPage.test.tsx` to assert the aside and marketing copy are absent, the login title is the single `h1`, and the form contract remains intact.
- Run the login component tests, full web tests, E2E build/lint, and the full Playwright suite.
- Run responsive browser checks at 320, 375, 768, 1024, and 1440px.
- Capture computed geometry, horizontal-overflow status, successful password login, and browser `pageerror`/`console.error` output.
- Restore the normal API Compose configuration and clear any stateful demo passkey after integrated verification.

## Non-Goals

- No API, backend, route, auth protocol, password, passkey, MFA, pricing, i18n schema, or PWA changes.
- No global shell redesign beyond the login page's content surface.
