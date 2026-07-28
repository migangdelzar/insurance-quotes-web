import { defineConfig, devices } from '@playwright/test';
import { getPwaPreviewBaseUrl, getPwaPreviewPort } from './support/pwaPreview';

const usePwaPreview = process.env.E2E_PWA_PREVIEW === '1';
const startPwaPreview = process.env.E2E_PWA_PREVIEW_SERVER === '1';
const recordDemo = process.env.RECORD_DEMO === 'true';
const pwaPreviewPort = getPwaPreviewPort(process.env.E2E_PWA_PREVIEW_PORT);
const pwaPreviewBaseUrl = getPwaPreviewBaseUrl(pwaPreviewPort);

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3100',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: recordDemo ? 'on' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
      grepInvert: /@mobile|@pwa/,
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
      grep: /@mobile/,
    },
    ...(usePwaPreview
      ? [
          {
            name: 'pwa-preview',
            grep: /@pwa/,
            use: {
              ...devices['Desktop Chrome'],
              baseURL: pwaPreviewBaseUrl,
            },
          },
        ]
      : []),
  ],
  webServer: startPwaPreview
    ? {
        command: `cd ../apps/web && bun run build && bunx vite preview --host 127.0.0.1 --port ${pwaPreviewPort}`,
        url: pwaPreviewBaseUrl,
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : undefined,
});
