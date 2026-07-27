# App-first PWA UX — Hardening D report

## Scope

Resolved final-review findings F-01 and F-02 only:

- coupled both CI browser installations to the exact Playwright version owned by the E2E workspace;
- changed committed Vite API defaults to the same-origin `/api` boundary;
- added a production-artifact regression that rejects the previous absolute localhost API base.

Coverage and health source components were not changed.

## TDD evidence

### RED

Command:

```text
cd apps/web
bun run test --run src/pwa/check-build.test.ts
```

Result: 3 expected failures and 7 passes.

- E2E declared `@playwright/test` as `^1.49.0` instead of the lockfile resolution `1.61.1`.
- committed Vite environments still declared `http://localhost:8080`;
- the artifact checker accepted generated JavaScript containing that URL.

### GREEN and refactor

The focused checker suite passed 10/10 after:

- declaring exact `@playwright/test` version `1.61.1`;
- exposing the workspace Playwright binary as the `playwright` E2E script;
- verifying that binary's declared/installed versions and using it for both CI Chromium installations;
- setting development, production, and example Vite defaults to `/api`;
- recursively checking generated JavaScript for `http://localhost:8080`.

The localhost backend remains only in `vite.config.ts` as the `/api` development proxy target.

## Verification

| Check | Result |
|---|---|
| `bun install --frozen-lockfile` | Passed; 788 locked packages, no changes |
| Workspace Playwright declaration/binary assertion | Passed; both report `1.61.1` |
| Focused PWA checker tests | 10/10 passed |
| Full web tests | 28 files / 102 tests passed |
| Web lint | 0 errors; 3 existing Fast Refresh warnings |
| E2E typecheck | Passed |
| E2E lint | Passed |
| Plain `bun run build` in `apps/web` | Passed using committed `/api` default |
| Production PWA artifact checker | Passed |
| Generated-JavaScript localhost scan | No matches |
| PWA preview on port `43104` | 1/1 passed |

The full web run included pre-existing, uncommitted F-03 focused tests. Their React `act(...)` warnings are unrelated to Hardening D and their files were intentionally excluded from this change.

## Files changed

- `.github/workflows/ci.yml`
- `apps/web/.env.development`
- `apps/web/.env.production`
- `apps/web/.env.example`
- `apps/web/src/pwa/check-build.mjs`
- `apps/web/src/pwa/check-build.test.ts`
- `e2e/package.json`
- `bun.lock`
- `tasks/todo.md`
- `.superpowers/sdd/app-first-hardening-d-report.md`

## Self-review

- Browser projects and test coverage are unchanged.
- Both browser jobs use the E2E workspace binary after frozen dependency installation.
- The exact package declaration is represented in `bun.lock`.
- Docker/CI overrides remain compatible, while plain local builds are now portable.
- No coverage or health implementation file was modified.
