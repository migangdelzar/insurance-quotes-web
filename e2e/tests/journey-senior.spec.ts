import { expect, test } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { stubInsurer } from '../support/insurer';
import { loginWithPassword, skipEnrollmentIfShown } from '../support/session';

test('senior journey: health questions and worked-example premium 327.60', async ({
  page,
}) => {
  await stubInsurer(200);
  await loginWithPassword(page);
  await skipEnrollmentIfShown(page);
  await page.getByTestId(tid('quotesList.startQuote')).click();

  await page.getByTestId(tid('wizard.personal.name')).fill('John Elder');
  await page.getByTestId(tid('wizard.personal.email')).fill('john@example.com');
  await page.getByTestId(tid('wizard.personal.age')).fill('70');
  await page.getByTestId(tid('wizard.personal.zipCode')).fill('06600');
  await page.getByTestId(tid('common.next')).click();

  await expect(
    page.getByTestId(tid('wizard.coverage.health.title'))
  ).toBeVisible();

  await page.getByTestId(tid('wizard.coverage.standard')).check();
  await page
    .getByTestId(tid('wizard.coverage.health.preexisting'))
    .getByLabel(/yes|sí/i)
    .check();
  await page.getByTestId(tid('wizard.coverage.health.diabetes')).check();
  await page.getByTestId(tid('wizard.coverage.health.hypertension')).check();
  await page
    .getByTestId(tid('wizard.coverage.health.tobacco'))
    .getByLabel(/yes|sí/i)
    .check();
  await page
    .getByTestId(tid('wizard.coverage.health.spouse'))
    .getByLabel(/yes|sí/i)
    .check();
  await page
    .getByTestId(tid('wizard.coverage.health.prescription'))
    .getByLabel(/no/i)
    .check();

  await expect(
    page.getByTestId(tid('wizard.coverage.premiumLabel'))
  ).toHaveText(/^\$327\.6(?:0)?$/);

  await page.getByTestId(tid('common.next')).click();
  await page.getByTestId(tid('wizard.summary.submit')).click();
  await expect(page.getByTestId(tid('wizard.summary.success'))).toBeVisible();
});
