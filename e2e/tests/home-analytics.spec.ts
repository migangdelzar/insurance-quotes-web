import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { loginAndReachQuotes } from '../support/session';
import { test } from '../support/consoleClean';

test('home dashboard renders analytics from the live summary API', async ({
  page,
}) => {
  const summaryRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/quotes/summary')) {
      summaryRequests.push(request.url());
    }
  });

  await loginAndReachQuotes(page);

  await expect(page.getByTestId(tid('quotesList.analytics'))).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /portfolio intelligence/i })
  ).toBeVisible();
  await expect(
    page.getByRole('img', { name: /status distribution/i })
  ).toBeVisible();
  await expect.poll(() => summaryRequests.length).toBeGreaterThan(0);
});
