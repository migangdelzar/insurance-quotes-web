import { defineConfig, devices } from '@playwright/test';

const usePwaPreview = process.env.E2E_PWA_PREVIEW === '1';
const startPwaPreview = process.env.E2E_PWA_PREVIEW_SERVER === '1';

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
              baseURL: 'http://127.0.0.1:3101',
            },
          },
        ]
      : []),
  ],
  webServer: startPwaPreview
    ? {
        command:
          'cd ../apps/web && bun run build && bunx vite preview --host 127.0.0.1 --port 3101',
        url: 'http://127.0.0.1:3101',
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : undefined,
});
