# Home Dashboard Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a backend-driven quote analytics summary to the Home page and document how to run and verify the complete stack.

**Architecture:** Add `GET /quotes/summary` to the existing versioned quote API. The application service maps an aggregate output-port result into an API view; the persistence adapter performs count/sum/average queries and a bounded seven-day trend query. The frontend loads the summary with TanStack Query and renders a focused accessible dashboard component without a new chart dependency.

**Tech Stack:** Java 17, Spring Boot, Spring Data JPA, PostgreSQL, OpenAPI, TypeScript, React, MUI, TanStack Query, Vitest, Playwright, Bun.

## Global Constraints

- Preserve DDD/hexagonal boundaries; the domain must not depend on HTTP, charting, Prometheus, Grafana, or persistence classes.
- Use TDD: each behavior gets a failing test before implementation.
- Keep the existing paginated `GET /quotes` contract unchanged.
- Use private localization catalogs through `t()` and `tid()` only.
- Do not add a charting dependency; use existing MUI/theme primitives plus CSS/SVG.
- Preserve the unrelated dirty `apps/web/index.html` and service architecture documentation edits.

---

### Task 1: Backend summary contract and aggregate port

**Files:**

- Create: `insurance-quotes-service/service/src/main/java/com/clara/insurancequotes/quote/application/port/out/QuoteSummaryData.java`
- Create: `insurance-quotes-service/service/src/main/java/com/clara/insurancequotes/quote/api/result/QuoteSummaryView.java`
- Create: `insurance-quotes-service/service/src/main/java/com/clara/insurancequotes/quote/api/result/QuoteDistributionView.java`
- Create: `insurance-quotes-service/service/src/main/java/com/clara/insurancequotes/quote/api/result/QuoteTrendPointView.java`
- Modify: `insurance-quotes-service/service/src/main/java/com/clara/insurancequotes/quote/application/port/out/QuoteRepository.java`
- Modify: `insurance-quotes-service/service/src/main/java/com/clara/insurancequotes/quote/api/usecase/QuoteApi.java`
- Test: `insurance-quotes-service/service/src/test/java/com/clara/insurancequotes/quote/application/service/QuoteServiceTest.java`

**Interfaces:**

- `QuoteRepository.findSummary(Instant trendStart): QuoteSummaryData`
- `QuoteApi.getSummary(): QuoteSummaryView`
- Summary contains all status/coverage counts, premium totals, submission rate, and seven trend points.

- [x] Write a service test that creates a draft, a priced submitted quote, and a failed quote, then asserts the aggregate KPI fields and zero-filled categories.
- [x] Run the focused test in RED; the missing `QuoteSummaryView` contract produced the expected compilation failure.
- [x] Add the records and output-port method, then implement the service mapping and rate calculation.
- [x] Run the focused test and confirm it passes.
- [x] Include the service implementation in the analytics commit.

### Task 2: Persistence aggregation and controller contract

**Files:**

- Modify: `insurance-quotes-service/service/src/main/java/com/clara/insurancequotes/quote/adapter/out/persistence/SpringDataQuoteRepository.java`
- Modify: `insurance-quotes-service/service/src/main/java/com/clara/insurancequotes/quote/adapter/out/persistence/JpaQuoteRepository.java`
- Modify: `insurance-quotes-service/service/src/testFixtures/java/com/clara/insurancequotes/testsupport/InMemoryQuoteRepository.java`
- Modify: `insurance-quotes-service/service/src/main/java/com/clara/insurancequotes/quote/adapter/in/web/controller/QuoteController.java`
- Test: `insurance-quotes-service/service/src/test/java/com/clara/insurancequotes/quote/adapter/in/web/controller/QuoteControllerTest.java`

**Interfaces:**

- `GET /quotes/summary` is protected by the existing quote scope and versioned through `@RequestMapping(value = "/quotes", version = "1.0")`.
- Persistence computes total/status/coverage counts, premium sum/average, and trend rows from the last seven UTC calendar days.

- [x] Add a controller test asserting `GET /quotes/summary` returns the complete summary envelope for API version `1.0`.
- [x] Run the focused controller test in RED before the route existed.
- [x] Add Spring Data aggregate methods and map deterministic zero-filled distributions and seven trend buckets in `JpaQuoteRepository`; mirror behavior in `InMemoryQuoteRepository`.
- [x] Add the controller route delegating to `quoteApi.getSummary()`.
- [x] Run focused controller/service tests and apply Spotless. Repository-backed integration verification remains dependent on the local Testcontainers/Colima socket mount.
- [x] Include the persistence/controller implementation in the analytics commit.

### Task 3: OpenAPI and frontend API client

**Files:**

- Modify: `insurance-quotes-service/docs/api/openapi.yaml`
- Modify/generated: `insurance-quotes-web/packages/api-contract/src/generated/schema.d.ts`
- Modify: `insurance-quotes-web/packages/api-contract/src/index.ts`
- Modify: `insurance-quotes-web/apps/web/src/features/quote-wizard/api/quoteApi.ts`
- Test: `insurance-quotes-web/apps/web/src/features/quote-wizard/api/quoteApi.test.ts`

- [x] Add the summary schemas and `GET /quotes/summary` response to OpenAPI.
- [x] Regenerate with `bun run --filter @clara/api-contract generate` and add a client `getQuoteSummary(): Promise<QuoteSummaryView>`.
- [x] Add a serializer/client test in RED before the client implementation, then GREEN after it.
- [x] Run `bun run --filter @clara/api-contract check-drift` and build the contract package.
- [x] Include the contract/client implementation in the analytics commit.

### Task 4: Home dashboard presentation

**Files:**

- Create: `insurance-quotes-web/apps/web/src/features/quote-dashboard/components/QuoteSummaryDashboard.tsx`
- Create: `insurance-quotes-web/apps/web/src/features/quote-dashboard/components/QuoteSummaryDashboard.test.tsx`
- Modify: `insurance-quotes-web/apps/web/src/pages/QuotesListPage.tsx`
- Modify: `insurance-quotes-web/packages/app-i18n/src/data/elements.json`
- Modify: `insurance-quotes-web/packages/app-i18n/src/data/translations/en-US.json`
- Modify: `insurance-quotes-web/packages/app-i18n/src/data/translations/es-MX.json`
- Modify: `insurance-quotes-web/apps/web/src/pages/QuotesListPage.test.tsx`

- [x] Write failing component tests for KPI values, distribution bars, trend chart labels, loading, and retryable errors.
- [x] Implement `QuoteSummaryDashboard` using `Surface`, MUI layout primitives, theme tokens, and an accessible SVG/CSS chart without new dependencies.
- [x] Fetch summary only for the Home view with query key `['quote-summary']`; keep history focused on paginated quote data.
- [x] Replace page-local first-page summary arithmetic with backend summary values.
- [x] Add private `tid()` selectors and localized copy for metrics/charts.
- [x] Run focused component tests, full web tests, lint, and build.
- [x] Include the dashboard implementation in the analytics commit.

### Task 5: Setup and real verification guide

**Files:**

- Create: `insurance-quotes-web/docs/setup-and-verification.md`
- Modify: `insurance-quotes-web/README.md`
- Modify: `insurance-quotes-web/tasks/todo.md`
- Modify: `insurance-quotes-web/docs/superpowers/plans/2026-07-28-home-analytics-plan.md`
- Create: `insurance-quotes-service/scripts/compare-runtimes.sh`
- Create: `insurance-quotes-service/.github/workflows/native-runtime-comparison.yml`

- [x] Document repository layout, Java/Bun/Mise prerequisites, environment profiles, Compose commands, demo credentials, passkey reset, WireMock, Vite HMR, production Nginx, observability ports, and real Playwright commands.
- [x] Document the distinction between Actuator/Micrometer/Prometheus/Grafana and the new persisted quote summary endpoint.
- [x] Add a real Playwright test that observes `/api/quotes/summary` and verifies the Home dashboard renders live KPI/chart regions.
- [x] Add `.github/workflows/full-stack-e2e.yml` to build and deploy the JVM Compose stack in CI, verify health/seeded logins/summary, run the real Playwright matrix, cancel superseded runs, and tear down the ephemeral deployment.
- [x] Add a manually dispatched native-runtime workflow; compare the Java 17 JVM and optional GraalVM native images with startup, health latency, RSS, and image-size statistics, and upload the Markdown report.
- [x] Run the complete web suite, contract drift, E2E build/lint, and full real HMR Playwright matrix. Full backend integration tests remain blocked by the local Colima Ryuk socket mount.
- [ ] Push both feature branches and run the GitHub-hosted CI workflows against the committed refs.
