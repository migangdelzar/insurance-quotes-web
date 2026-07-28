# Home Dashboard Analytics Design

## Goal

Give the authenticated Home destination a trustworthy operational snapshot of quote activity while keeping all aggregates correct when quote history is paginated.

## Decision

Add an authenticated, versioned `GET /quotes/summary` endpoint. The service computes aggregates from the full quote data set and returns a small chart-ready response. The frontend requests that response independently from the paginated quote-history query and renders a responsive dashboard component.

The dashboard will show:

- total, draft, submitted, failed, and expired quote counts;
- quotes with a calculated premium, total monthly premium, and average monthly premium;
- submission rate, defined as submitted quotes divided by submitted plus failed quotes;
- status and coverage distributions;
- a seven-day daily trend for created, submitted, and failed quotes.

The trend uses `createdAt` for created quotes and `updatedAt` for the current submitted/failed status. This is explicit because the current domain model does not keep a separate status-history table.

## Architecture

The quote API remains hexagonal:

```text
Home page
  -> quoteApi.getQuoteSummary()
  -> GET /quotes/summary (API v1)
  -> QuoteController
  -> QuoteApi.getSummary()
  -> QuoteService
  -> QuoteRepository.findSummary(trendStart)
  -> JpaQuoteRepository + Spring Data aggregate queries
```

The domain model remains transport-independent. `QuoteSummaryView` is an API result; persistence-specific aggregate rows stay behind the application output port. No HTTP, Prometheus, Grafana, or chart library types enter the domain.

## Response contract

`QuoteSummaryView` contains scalar KPI fields plus stable arrays:

```text
totalQuotes: long
draftQuotes: long
submittedQuotes: long
submissionFailedQuotes: long
expiredQuotes: long
pricedQuotes: long
totalMonthlyPremium: decimal
averageMonthlyPremium: decimal
submissionRate: decimal percentage
statusDistribution: [{ key: QuoteStatus, count: long }]
coverageDistribution: [{ key: CoverageType, count: long }]
trend: [{ date: ISO date, created: long, submitted: long, failed: long }]
```

The service always returns all known status and coverage keys, including zero counts, and always returns seven trend points. This makes charts deterministic and avoids frontend conditionals for missing categories.

## Frontend presentation

`QuoteSummaryDashboard` is a focused presentation component. It uses the existing `Surface`, theme tokens, typography, and private `tid()` catalog. It contains:

- KPI cards with semantic labels and values;
- accessible horizontal distribution bars for status and coverage;
- a compact SVG trend chart with visible legend and screen-reader summary;
- loading and retryable error states.

No chart dependency is added. CSS bars and a small SVG keep the bundle stable and work at the existing 320/375/768/1024/1440px breakpoints.

## Testing

- Backend unit tests cover aggregate counts, premium totals, submission rate, zero-filled categories, and seven-day trend buckets.
- Backend controller tests cover the versioned authenticated summary response.
- Frontend component tests cover KPI values, charts, empty zero-state, loading, and error/retry rendering.
- A real Playwright journey verifies the Home page requests `/api/quotes/summary` through the Vite same-origin proxy and displays live metrics after creating a quote.
- Existing quote-history pagination and passkey journeys remain unchanged.

## CI/CD deployment verification

Add a GitHub Actions full-stack workflow that creates an ephemeral JVM deployment on the runner from the current web ref and a configurable backend ref. It will build the API and Nginx web images, start PostgreSQL, Kafka, Redis, WireMock, API, and web through the Compose overlays, wait for health, verify all three seeded logins and the summary endpoint, run the real Playwright suite against port `3100`, collect Compose logs on failure, and tear down volumes in an always-run step. Push and pull-request concurrency uses `cancel-in-progress: true` so superseded deployments stop before a newer validation starts.

The workflow does not publish images or mutate a shared environment. It is an integration deployment gate; production publishing remains a separate credentialed release concern.

## Alternatives rejected

### Derive metrics from the current paginated page

Rejected because page totals, premium totals, and conversion rates would change when the user changes page size or filters.

### Query Prometheus from the browser

Rejected because Prometheus counters describe process events, not the current persisted quote state, and exposing the metrics backend to the browser would add an unnecessary security and coupling boundary.

### Add a charting dependency

Rejected for this dashboard because the required visualizations are simple distributions and a seven-point trend; CSS/SVG keeps the frontend smaller and consistent with the existing design system.
