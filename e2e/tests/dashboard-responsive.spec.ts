import { expect, test } from '@playwright/test';
import type { QuoteView } from '@clara/api-contract';
import { tid } from '@clara/app-i18n';
import {
  loginAndReachQuotes,
  stubAuthenticatedQuoteSession,
} from '../support/session';

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
    await page.setViewportSize({ width, height: 800 });
    await stubAuthenticatedQuoteSession(page, quotes);
    await loginAndReachQuotes(page);

    await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();
    await expect(page.getByText('Avery Morgan')).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: /primary navigation/i })
    ).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth
    );
  });
}
