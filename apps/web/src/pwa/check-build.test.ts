import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const checker = resolve(process.cwd(), 'src/pwa/check-build.mjs');
const temporaryDirectories: string[] = [];

function createBuildFixture(workerSource: string): string {
  const directory = mkdtempSync(join(tmpdir(), 'clara-pwa-check-'));
  temporaryDirectories.push(directory);

  for (const file of [
    'icons/clara-192.svg',
    'icons/clara-512.svg',
    'icons/clara-192.png',
    'icons/clara-512.png',
    'icons/clara-512-maskable.png',
  ]) {
    const target = join(directory, file);
    mkdirSync(join(target, '..'), { recursive: true });
    writeFileSync(target, 'asset');
  }

  writeFileSync(
    join(directory, 'manifest.webmanifest'),
    JSON.stringify({
      description: 'A secure, guided workspace for Clara insurance quotes.',
      icons: [
        {
          src: '/icons/clara-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/clara-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/clara-512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    })
  );
  writeFileSync(
    join(directory, 'index.html'),
    [
      '<meta name="apple-mobile-web-app-capable" content="yes" />',
      '<meta name="apple-mobile-web-app-status-bar-style" content="default" />',
      '<meta name="apple-mobile-web-app-title" content="Clara Quotes" />',
      '<link rel="apple-touch-icon" sizes="192x192" href="/icons/clara-192.png" />',
    ].join('\n')
  );
  writeFileSync(join(directory, 'sw.js'), workerSource);

  return directory;
}

function runChecker(directory: string): { status: number; output: string } {
  const result = spawnSync(process.execPath, [checker], {
    encoding: 'utf8',
    env: { ...process.env, PWA_DIST_DIR: directory },
  });

  return {
    status: result.status ?? 1,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`,
  };
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('PWA build checker', () => {
  it('keeps app-first browser and PWA guarantees enforced in CI', () => {
    const workflow = readFileSync(
      resolve(process.cwd(), '../../.github/workflows/ci.yml'),
      'utf8'
    );

    for (const requiredCheck of [
      'tests/app-navigation.spec.ts',
      'tests/app-accessibility.spec.ts',
      'tests/dashboard-responsive.spec.ts',
      'node src/pwa/check-build.mjs',
      'test:pwa-preview',
      'E2E_PWA_PREVIEW_PORT: 43102',
    ]) {
      expect(workflow).toContain(requiredCheck);
    }
  });

  it('declares raster any and maskable icon fallbacks in the PWA manifest', () => {
    const viteConfig = readFileSync(
      resolve(process.cwd(), 'vite.config.ts'),
      'utf8'
    );

    expect(viteConfig).toContain("src: '/icons/clara-192.png'");
    expect(viteConfig).toContain("src: '/icons/clara-512.png'");
    expect(viteConfig).toContain("src: '/icons/clara-512-maskable.png'");
    expect(viteConfig).toContain("purpose: 'maskable'");
  });

  it('fails when the maskable PNG fallback is missing from the supplied build', () => {
    const fixture = createBuildFixture(
      'new NavigationRoute(createHandlerBoundToURL("/index.html"), { denylist: [/^\\/api/] });'
    );
    rmSync(join(fixture, 'icons/clara-512-maskable.png'));

    const result = runChecker(fixture);

    expect(result.status).toBe(1);
    expect(result.output).toContain('icons/clara-512-maskable.png');
  });

  it('fails when the generated manifest has no description', () => {
    const fixture = createBuildFixture(
      'registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html"), { denylist: [/^\\/api/] }));'
    );
    const manifestPath = join(fixture, 'manifest.webmanifest');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      description?: string;
    };
    delete manifest.description;
    writeFileSync(manifestPath, JSON.stringify(manifest));

    const result = runChecker(fixture);

    expect(result.status).toBe(1);
    expect(result.output).toContain('Manifest is missing a description');
  });

  it('fails when the generated page lacks Apple install metadata', () => {
    const fixture = createBuildFixture(
      'registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html"), { denylist: [/^\\/api/] }));'
    );
    writeFileSync(join(fixture, 'index.html'), '<main>Clara Quotes</main>');

    const result = runChecker(fixture);

    expect(result.status).toBe(1);
    expect(result.output).toContain('Missing Apple PWA metadata');
  });

  it('fails when the generated worker lacks the API navigation denylist', () => {
    const fixture = createBuildFixture(
      'new NavigationRoute(createHandlerBoundToURL("/index.html"));'
    );

    const result = runChecker(fixture);

    expect(result.status).toBe(1);
    expect(result.output).toContain('missing the /api navigation denylist');
  });

  it('fails when the generated worker defines an API runtime-cache route', () => {
    const fixture = createBuildFixture(
      'new NavigationRoute(createHandlerBoundToURL("/index.html"), { denylist: [/^\\/api/] }); registerRoute(/^\\/api/, new CacheFirst());'
    );

    const result = runChecker(fixture);

    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'must not define an API runtime-cache route'
    );
  });

  it('fails when a runtime-cache matcher avoids the literal API path', () => {
    const fixture = createBuildFixture(
      'new NavigationRoute(createHandlerBoundToURL("/index.html"), { denylist: [/^\\/api/] }); registerRoute(({ url }) => url.pathname.startsWith("/" + "api"), new CacheFirst());'
    );

    const result = runChecker(fixture);

    expect(result.status).toBe(1);
    expect(result.output).toContain(
      'must not define an API runtime-cache route'
    );
  });
});
