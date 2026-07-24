#!/bin/sh
set -e

cp src/generated/schema.d.ts /tmp/schema.before.d.ts
bun run generate

if ! diff -q /tmp/schema.before.d.ts src/generated/schema.d.ts > /dev/null; then
  echo "DRIFT: api-contract is out of date with the backend openapi.yaml. Commit the regenerated schema."
  exit 1
fi

echo "api-contract is in sync."
