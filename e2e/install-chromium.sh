#!/usr/bin/env bash
set -euo pipefail

declared_version="$(bun -p 'JSON.stringify(require("./package.json").devDependencies)' | jq -r '."@playwright/test"')"
installed_version="$(bun run --silent playwright --version)"
test "$installed_version" = "Version $declared_version"
bun run playwright install --with-deps chromium
