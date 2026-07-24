# insurance-quotes-web

The web app uses the browser's preferred languages to select `en-US` or `es-MX` at startup. The selected locale is also sent to the service as `Accept-Language`, keeping localized API errors consistent with the visible UI. Unsupported browser preferences fall back to `en-US`.

## Responsive verification

Run unit/build checks with `bun run test`, `bun run build`, and `bun run lint`. With the service stack running, run the browser layout audit at 320, 375, 768, and 1280 pixels:

```bash
E2E_BASE_URL=http://localhost:3100 bunx playwright test tests/responsive-layout.spec.ts --project=desktop-chromium
```

The audit checks document overflow, critical login controls, and keyboard visibility of the skip link. Screenshots can be captured with Playwright for visual review; pixel snapshots are intentionally not required.

React/Vite frontend for the insurance quote flow. It is organized by capability (`auth`, `quote-wizard`, and shared application concerns) and consumes the backend through the versioned API contract.

Sibling backend: [insurance-quotes-service](../insurance-quotes-service)

## Setup and run

```bash
mise run setup
bun run dev                         # http://localhost:5173
bun run build                       # production workspace build
```

For the integrated reviewer flow, start the backend’s full-stack Compose overlay from the sibling repository:

```bash
cd ../insurance-quotes-service
mise run up jvm full                # API :8080 and nginx frontend :3100
mise run up jvm full e2e            # also WireMock :8089
```

The production image is built from this repository’s `Dockerfile` and served by nginx. `VITE_API_BASE_URL` defaults to `http://localhost:8080` and can be supplied as a build argument or environment value.

## GitHub Actions

Frontend CI runs on every push and pull request. Runs are grouped by source branch and cancel older in-progress runs when a newer commit arrives. It installs the locked Bun dependencies, runs web tests, lint, formatting checks, the production build, and the four-viewport responsive browser audit.

## Tests and quality checks

```bash
bun run test
bun run lint
bun run build
bun run format:check
E2E_BASE_URL=http://localhost:3100 bun run e2e
```

The Playwright suite requires the backend full-stack E2E overlay. It covers standard adult submission, the senior health-question path and worked-example premium, insurer failure/retry, and WebAuthn enrollment/MFA/passwordless flows. The mobile-tagged journeys run with the Pixel 7 project.

## How I approached it

1. I froze the API contract and user journeys before building UI details, then mapped each journey to a small feature boundary.
2. I built the shared shell, authentication, quote wizard, API client, and localization package incrementally with component and reducer tests before integration journeys.
3. I treated accessibility and automation selectors as part of the UI contract: headings receive focus after navigation, controls have stable semantic labels, and browser tests use catalog-backed selectors.

## Design decisions

### Capability-first structure

Feature code lives under `apps/web/src/features`, while routing, providers, shared API behavior, and reusable UI live under `app` and `shared`. Tests sit beside the behavior they protect; E2E support and journeys are isolated in the `e2e` workspace.

### Private localization catalogs

The package `@clara/app-i18n` keeps `elements.json`, `translations/en-US.json`, and `translations/es-MX.json` private. Consumers use behavior functions only:

```ts
t('wizard.coverage.title'); // visible localized text
tid('wizard.coverage.premiumLabel'); // stable test selector, with autocomplete
```

`ElementKey` is generated from the element catalog, so `tid()` offers editor completion without exposing the nested selector object. `getResources()` is the narrow integration method used to configure i18next; raw catalogs and resources are not exported. Textless elements remain valid because `tid()` resolves the selector independently of whether a translation exists.

### State and server communication

React context owns the local wizard and authentication state. TanStack Query handles server mutations and cache invalidation; the shared HTTP client owns access-token attachment, refresh retry, API-version headers, timeout behavior, and normalized errors.

## AI usage

This repository was built with AI pair-programming across written specifications, implementation plans, TDD slices, code review, and integration debugging. Every generated change was reviewed, verified locally, and committed by the developer. The capability boundaries, i18n API shape, accessibility behavior, and test isolation decisions were explicitly human-reviewed.

## Challenges / unfinished

- WebAuthn browser journeys require Chromium’s virtual authenticator and a clean E2E database; the Playwright configuration serializes the shared demo-user suite and runs the mutating passkey journey last.
- The frontend bundle currently emits a Vite chunk-size warning; code splitting is a follow-up optimization, not a correctness issue for this challenge.
- Native runtime comparison belongs to the backend repository because it measures the API image; the frontend verification is the production nginx image and full-stack browser journey.

## Running both repositories

Use this sibling layout:

```text
workspace/
├── insurance-quotes-service/
└── insurance-quotes-web/
```

From the backend repository, one command starts both applications:

```bash
cd ../insurance-quotes-service
mise run up jvm full
```

Then run browser tests from this repository after adding the E2E overlay:

```bash
E2E_BASE_URL=http://localhost:3100 bun run e2e
```
