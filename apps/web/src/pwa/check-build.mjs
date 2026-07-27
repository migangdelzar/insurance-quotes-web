import { existsSync } from 'node:fs';

const dist = new URL('../../dist/', import.meta.url);
const required = [
  'manifest.webmanifest',
  'sw.js',
  'icons/clara-192.svg',
  'icons/clara-512.svg',
];
const missing = required.filter((file) => !existsSync(new URL(file, dist)));

if (missing.length > 0) {
  console.error(`Missing PWA artifacts: ${missing.join(', ')}`);
  process.exit(1);
}
