# Playwright demo recordings

The named demo journeys run against the real JVM API through the same-origin
Nginx entry point. Playwright writes videos and its HTML report under
`e2e/test-results` and `e2e/playwright-report`; those generated files are not
committed.

## Local recording

Start the JVM stack, then run:

```bash
E2E_BASE_URL=http://localhost:3100 RECORD_DEMO=true \
  bun run --filter e2e test:recordings
```

## GitHub Actions artifact

Use **Actions → Playwright demo recordings → Run workflow**. Keep the default
frontend/backend refs or provide branches/tags/full commit SHAs. The workflow
starts the real stack, records the six named flows, and uploads
`clara-demo-recordings-<run-id>` for seven days. Normal PR E2E runs do not record
videos by default; they upload diagnostics only when a flow fails.
