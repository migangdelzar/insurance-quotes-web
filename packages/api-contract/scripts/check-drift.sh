#!/bin/sh
set -e

temporary_file="$(mktemp)"
trap 'rm -f "$temporary_file"' EXIT
cp src/generated/schema.d.ts "$temporary_file"
bun run generate

if ! diff -q "$temporary_file" src/generated/schema.d.ts > /dev/null; then
  echo "DRIFT: api-contract is out of date with the backend openapi.yaml. Commit the regenerated schema."
  exit 1
fi

echo "api-contract is in sync."
