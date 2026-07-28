# Full-stack setup and verification

This guide runs the real Clara application across the sibling repositories. The browser talks to the frontend origin; Nginx or Vite proxies `/api/*` to the Spring service, so Playwright does not bypass the BFF boundary or mock API responses.

## Repository layout and prerequisites

Use this layout:

```text
fullstack-code-challenge/
├── insurance-quotes-service/
└── insurance-quotes-web/
```

Install Docker Compose, Mise, Java 17, Bun 1.3+, and Chromium dependencies for Playwright. The backend's native image builder may require a substantially larger Docker memory allocation than the JVM image.

Install dependencies once:

```bash
cd insurance-quotes-web
bun install --frozen-lockfile
cd ../insurance-quotes-service
mise run setup
```

## Fast development loop with HMR

Run the infrastructure and backend with Spring DevTools, then run Vite on the host:

```bash
cd insurance-quotes-service
mise run dev-infra
mise run dev                    # API :18080, WireMock :8089, DevTools restart

cd ../insurance-quotes-web
VITE_DEV_API_PROXY_TARGET=http://localhost:18080 bun run dev:hmr # Vite :5173
```

Open `http://localhost:5173`. HMR applies frontend edits immediately and Vite forwards same-origin `/api` calls to Spring. The `dev` profile is development-only; it keeps the Java 17 runtime and does not change production image behavior.

## Full JVM stack

```bash
cd insurance-quotes-service
mise run up jvm full e2e
```

The integrated origin is `http://localhost:3100`; the API is `http://localhost:8080`. Compose starts PostgreSQL, Kafka, Redis, WireMock, the Java 17 API image, and the Nginx frontend image. The local WireMock insurer avoids depending on `httpstat.us`; `httpstat.us` remains the configurable default outside the deterministic E2E overlay.

The development users are:

| Username     | Password              |
| ------------ | --------------------- |
| `demo`       | `demo-password`       |
| `demo-two`   | `demo-password-two`   |
| `demo-three` | `demo-password-three` |

Password login is always available until a passkey is enrolled. The web flow explicitly offers passkey setup before passwordless login or passkey MFA. To clear a local demo passkey after a WebAuthn journey:

```bash
docker exec insurance-quotes-postgres-1 psql -U postgres -d quotes \
  -c "DELETE FROM passkey_credentials WHERE user_id = (SELECT id FROM users WHERE username = 'demo');"
```

For a completely clean state, stop the full stack with `down --volumes` and start it again. The passkey Playwright journey is stateful and should run last when sharing a database.

## Real browser verification

Playwright uses the actual frontend, proxy, Spring API, PostgreSQL, Redis, Kafka, and WireMock endpoints. It does not intercept or replace API routes:

```bash
cd insurance-quotes-web
E2E_BASE_URL=http://localhost:3100 bun run e2e -- --retries=0
```

The Home flow asserts that the browser requests `/api/quotes/summary` and renders the backend-driven KPI, distribution, and trend regions. The suite also covers quote creation, senior health pricing, submission retry, pagination/filter/order controls, passkey registration/MFA/passwordless login, accessibility, responsive layouts, and console-error guards.

For the fastest source-change check use HMR and the dev API:

```bash
E2E_BASE_URL=http://localhost:5173 bun run e2e -- --retries=0
```

## Metrics and observability

Start the observability overlay alongside the JVM API:

```bash
cd insurance-quotes-service
mise run up jvm observability
```

| Concern         | Role                                                           | Local endpoint                            |
| --------------- | -------------------------------------------------------------- | ----------------------------------------- |
| Spring Actuator | Exposes health, info, and instrumentation endpoints            | `http://localhost:8080/actuator/health`   |
| Micrometer      | Instruments Spring requests and business meters inside the API | API process                               |
| Prometheus      | Scrapes `/actuator/prometheus` and stores time series          | `http://localhost:9090`                   |
| Grafana         | Queries Prometheus, Loki, and Tempo for dashboards             | `http://localhost:3001` (`admin`/`admin`) |
| Loki            | Stores structured API/container logs                           | `http://localhost:3101`                   |
| Tempo           | Stores distributed traces exported through OTLP                | `http://localhost:3200`                   |

The persisted `GET /api/quotes/summary` endpoint is application analytics for the authenticated user; it is not a replacement for Prometheus. Kafka transports durable quote events and is not the metrics database or Grafana publisher. Micrometer/Actuator produce the measurements, Prometheus scrapes them, and Grafana visualizes them.

Useful checks:

```bash
curl -fsS http://localhost:3100/api/actuator/health
curl -fsS http://localhost:3100/api/actuator/prometheus | rg 'http_server|quote_|rate_limit_'
curl -fsS http://localhost:3100/api/quotes/summary # requires the browser's bearer session
```

## JVM versus native runtime statistics

The Java 17 JVM image is the default runtime. Native compilation is optional and uses the Spring/Paketo native build tooling; the application remains Java 17-compatible at runtime. Build the native image with enough Docker memory, then measure both images:

```bash
cd insurance-quotes-service
mise run native
RUNTIME_REPORT_PATH=/tmp/clara-runtime-comparison.md ./scripts/compare-runtimes.sh
cat /tmp/clara-runtime-comparison.md
```

The report records Spring's startup log, compose elapsed time, health-request latency, Docker RSS at the health check, and image size. It deliberately reports measured values only; a failed native build is not presented as a runtime benchmark. The comparison is also available as a manually dispatched GitHub Actions artifact.

## CI/CD deployment verification

The web repository's `full-stack-e2e.yml` runs on every push and pull request with `cancel-in-progress: true`. Its current challenge-branch default checks out `feat-backend-core` so this dashboard contract is tested against the matching backend; after that backend is merged, change the workflow default to `main`. The workflow builds an ephemeral JVM Compose deployment, verifies API health, seeded password logins, and `/quotes/summary`, runs the real Playwright suite against Nginx, uploads logs and Playwright artifacts on failure, and removes the stack and volumes in an `always` cleanup step. It does not publish production images.

The backend's `native-runtime-comparison.yml` is manual because GraalVM native compilation is resource-intensive. It builds the native image, runs the same API compose flow for JVM and native images, and uploads the Markdown statistics report.
