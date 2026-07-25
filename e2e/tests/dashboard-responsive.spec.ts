import { expect, test } from '@playwright/test';
import type { QuoteView } from '@clara/api-contract';
import { tid } from '@clara/app-i18n';
import { skipEnrollmentIfShown } from '../support/session';

const viewports = [320, 375, 768, 1024, 1280];

const quotes: QuoteView[] = [
  {
    id: '7c3f4e5a-1b2c-4d6e-8f90-1234567890ab',
    name: 'Avery Morgan',
    email: 'avery@example.com',
    age: 34,
    zipCode: '06600',
    coverageType: 'STANDARD',
    monthlyPremium: 82.5,
    status: 'SUBMITTED',
    createdAt: '2026-07-24T12:00:00Z',
    updatedAt: '2026-07-24T12:00:00Z',
  },
];

for (const width of viewports) {
  test(`dashboard remains usable at ${width}px`, async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'AUTHENTICATED',
          tokens: {
            accessToken: 'e2e-access-token',
            refreshToken: 'e2e-refresh-token',
            expiresInSeconds: 900,
          },
        }),
      });
    });
    await page.route('**/api/quotes', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(quotes),
      });
    });

    await page.setViewportSize({ width, height: 800 });
    await page.goto('/login');
    await page.getByTestId(tid('auth.login.username')).fill('e2e-user');
    await page.getByTestId(tid('auth.login.password')).fill('e2e-password');
    await page.getByTestId(tid('auth.login.submit')).click();
    await skipEnrollmentIfShown(page);

    await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();
    await expect(page.getByText('Avery Morgan')).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth
    );
  });
}
