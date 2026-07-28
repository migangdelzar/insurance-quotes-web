import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { stubInsurer } from '../support/insurer';
import { loginWithPassword, skipEnrollmentIfShown } from '../support/session';
import { test } from '../support/consoleClean';

test('standard adult journey: login → wizard → submit @mobile', async ({
  page,
}) => {
  await stubInsurer(200);
  await loginWithPassword(page);
  await skipEnrollmentIfShown(page);

  await page.getByTestId(tid('quotesList.startQuote')).click();

  await page.getByTestId(tid('wizard.personal.name')).fill('Jane Roe');
  await page.getByTestId(tid('wizard.personal.email')).fill('jane@example.com');
  await page.getByTestId(tid('wizard.personal.age')).fill('34');
  await page.getByTestId(tid('wizard.personal.zipCode')).fill('06600');
  await page.getByTestId(tid('common.next')).click();

  await expect(page.getByTestId(tid('wizard.coverage.title'))).toBeVisible();
  await expect(
    page.getByTestId(tid('wizard.coverage.health.title'))
  ).toBeHidden();

  await page.getByTestId(tid('wizard.coverage.standard')).check();
  await expect(
    page.getByTestId(tid('wizard.coverage.premiumLabel'))
  ).toHaveText(/^\$100(?:\.00)?$/);
  await page.getByTestId(tid('common.next')).click();

  await page.getByTestId(tid('wizard.summary.submit')).click();
  await expect(page.getByTestId(tid('wizard.summary.success'))).toBeVisible();
});
