import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { stubInsurer } from '../support/insurer';
import { loginWithPassword, skipEnrollmentIfShown } from '../support/session';
import { test } from '../support/consoleClean';

test('failed submission surfaces error, quote stays resubmittable, retry succeeds', async ({
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: 'expected-console-error',
    description:
      'Failed to load resource: the server responded with a status of 502',
  });
  await stubInsurer(500);
  await loginWithPassword(page);
  await skipEnrollmentIfShown(page);
  await page.getByTestId(tid('quotesList.startQuote')).click();

  await page.getByTestId(tid('wizard.personal.name')).fill('Flaky Flow');
  await page
    .getByTestId(tid('wizard.personal.email'))
    .fill('flaky@example.com');
  await page.getByTestId(tid('wizard.personal.age')).fill('40');
  await page.getByTestId(tid('wizard.personal.zipCode')).fill('06600');
  await page.getByTestId(tid('common.next')).click();

  await page.getByTestId(tid('wizard.coverage.basic')).check();
  await expect(
    page.getByTestId(tid('wizard.coverage.premiumLabel'))
  ).toHaveText(/^\$50(?:\.00)?$/);
  await page.getByTestId(tid('common.next')).click();

  await page.getByTestId(tid('wizard.summary.submit')).click();
  await expect(page.getByTestId(tid('wizard.summary.failure'))).toBeVisible();

  await stubInsurer(200);
  await page.getByTestId(tid('common.retry')).click();
  await expect(page.getByTestId(tid('wizard.summary.success'))).toBeVisible();
});
