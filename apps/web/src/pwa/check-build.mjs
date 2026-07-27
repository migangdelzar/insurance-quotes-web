import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = process.env.PWA_DIST_DIR
  ? resolve(process.env.PWA_DIST_DIR)
  : fileURLToPath(new URL('../../dist/', import.meta.url));
const required = [
  'manifest.webmanifest',
  'sw.js',
  'icons/clara-192.svg',
  'icons/clara-512.svg',
  'icons/clara-192.png',
  'icons/clara-512.png',
  'icons/clara-512-maskable.png',
];
const missing = required.filter((file) => !existsSync(resolve(dist, file)));

if (missing.length > 0) {
  console.error(`Missing PWA artifacts: ${missing.join(', ')}`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(resolve(dist, 'manifest.webmanifest'), 'utf8'));
const requiredManifestIcons = [
  { src: '/icons/clara-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: '/icons/clara-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  {
    src: '/icons/clara-512-maskable.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
];

const hasManifestIcon = (expected) =>
  manifest.icons?.some(
    (icon) =>
      icon.src === expected.src &&
      icon.sizes === expected.sizes &&
      icon.type === expected.type &&
      icon.purpose?.split(' ').includes(expected.purpose),
  );

if (!requiredManifestIcons.every(hasManifestIcon)) {
  console.error('Manifest is missing required PNG icon metadata.');
  process.exit(1);
}

const workerSource = readFileSync(resolve(dist, 'sw.js'), 'utf8');
const registeredRoutes = workerSource.match(
  /\b(?:[\w$]+\.)?registerRoute\s*\(/gu
) ?? [];
const navigationRouteRegistrations = workerSource.match(
  /\b(?:[\w$]+\.)?registerRoute\s*\(\s*new\s+(?:[\w$]+\.)?NavigationRoute\s*\(/gu
) ?? [];

if (!/denylist\s*:\s*\[\s*\/\^\\\/api\//u.test(workerSource)) {
  console.error('Service worker is missing the /api navigation denylist.');
  process.exit(1);
}

if (
  registeredRoutes.length !== 1 ||
  navigationRouteRegistrations.length !== 1
) {
  console.error('Service worker must not define an API runtime-cache route.');
  process.exit(1);
}
