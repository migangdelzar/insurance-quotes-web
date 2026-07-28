import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { loginAndReachQuotes } from '../support/session';
import { test } from '../support/consoleClean';

test('quote history reaches the live API for filtering, ordering, and pagination', async ({
  page,
}) => {
  const quoteListRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/quotes?')) {
      quoteListRequests.push(request.url());
    }
  });

  await loginAndReachQuotes(page);

  const seed = Date.now();
  for (let index = 1; index <= 6; index += 1) {
    await page.getByTestId(tid('quotesList.startQuote')).click();
    await page
      .getByTestId(tid('wizard.personal.name'))
      .fill(`Pagination Quote ${index} ${seed}`);
    await page
      .getByTestId(tid('wizard.personal.email'))
      .fill(`pagination-${seed}-${index}@example.com`);
    await page.getByTestId(tid('wizard.personal.age')).fill('34');
    await page.getByTestId(tid('wizard.personal.zipCode')).fill('06600');
    await page.getByTestId(tid('common.next')).click();
    await expect(page.getByTestId(tid('wizard.coverage.title'))).toBeVisible();
    await page.getByTestId(tid('wizard.backToQuotes')).click();
    await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();
  }

  await page.getByTestId(tid('navigation.quotes')).click();
  await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();

  const search = page.getByTestId(tid('quotesList.search'));
  await search.fill(`Pagination Quote 1 ${seed}`);
  await Promise.all([
    page.waitForRequest(
      (request) =>
        request.url().includes('/api/quotes?') &&
        request.url().includes(`search=Pagination+Quote+1+${seed}`)
    ),
    page.getByTestId(tid('quotesList.applyFilters')).click(),
  ]);
  await expect
    .poll(() => quoteListRequests.at(-1) ?? '')
    .toContain(`search=Pagination+Quote+1+${seed}`);

  await page.getByTestId(tid('quotesList.clearFilters')).click();
  await page.getByTestId(tid('quotesList.sortBy')).click();
  await page.getByRole('option', { name: 'Name', exact: true }).click();
  await page.getByTestId(tid('quotesList.direction')).click();
  await page.getByRole('option', { name: 'Ascending', exact: true }).click();
  await expect
    .poll(() => quoteListRequests.at(-1) ?? '')
    .toMatch(/sortBy=name.*direction=asc/);

  const pagination = page.getByTestId(tid('quotesList.pagination'));
  await pagination.getByRole('combobox').click();
  await page.getByRole('option', { name: '5', exact: true }).click();
  await expect.poll(() => quoteListRequests.at(-1) ?? '').toMatch(/size=5/);

  await Promise.all([
    page.waitForRequest(
      (request) =>
        request.url().includes('/api/quotes?') &&
        request.url().includes('page=1') &&
        request.url().includes('size=5')
    ),
    pagination.getByRole('button', { name: /go to next page/i }).click(),
  ]);
  await expect
    .poll(() => quoteListRequests.at(-1) ?? '')
    .toMatch(/page=1.*size=5/);
});
