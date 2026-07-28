import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { stubInsurer } from '../support/insurer';
import {
  DEMO_TWO_USER,
  loginAndReachQuotes,
  loginWithPasswordAs,
  skipEnrollmentIfShown,
} from '../support/session';
import { test } from '../support/consoleClean';

test('premium shell preserves the standard quote journey on mobile @mobile', async ({
  page,
}) => {
  const sameOriginApiRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.startsWith('/api/')) {
      sameOriginApiRequests.push(request.url());
    }
  });
  await stubInsurer(200);
  await page.setViewportSize({ width: 375, height: 800 });
  await loginWithPasswordAs(page, DEMO_TWO_USER);
  await skipEnrollmentIfShown(page);

  await page.getByTestId(tid('quotesList.startQuote')).click();
  await page.getByTestId(tid('wizard.personal.name')).fill('Demo User');
  await page.getByTestId(tid('wizard.personal.email')).fill('demo@example.com');
  await page.getByTestId(tid('wizard.personal.age')).fill('34');
  await page.getByTestId(tid('wizard.personal.zipCode')).fill('06600');
  await page.getByTestId(tid('common.next')).click();

  await expect(page.getByTestId(tid('wizard.coverage.title'))).toBeVisible();
  const actionDock = page.getByTestId(tid('wizard.actions'));
  await expect(actionDock).toBeVisible();
  await expect
    .poll(() =>
      actionDock.evaluate((element) => getComputedStyle(element).position)
    )
    .toBe('fixed');
  await expect(page.getByTestId(tid('wizard.coverage.title'))).toHaveAttribute(
    'tabindex',
    '-1'
  );
  await expect(page.getByTestId(tid('wizard.backToQuotes'))).toHaveAttribute(
    'href',
    '/quotes'
  );
  await page.getByTestId(tid('wizard.coverage.standard')).check();
  await expect(
    page.getByTestId(tid('wizard.coverage.premiumLabel'))
  ).toHaveText(/^\$100(?:\.00)?$/);
  await page.getByTestId(tid('common.next')).click();
  await page.getByTestId(tid('wizard.summary.submit')).click();
  await expect(page.getByTestId(tid('wizard.summary.success'))).toBeVisible();
  await expect(page.getByTestId(tid('wizard.summary.allQuotes'))).toBeVisible();
  await expect(page.getByTestId(tid('wizard.summary.newQuote'))).toBeVisible();
  await page.getByTestId(tid('wizard.summary.newQuote')).click();
  await expect(page.getByTestId(tid('wizard.personal.title'))).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  expect(sameOriginApiRequests.length).toBeGreaterThan(0);
  expect(
    sameOriginApiRequests.every(
      (url) => new URL(url).origin === new URL(page.url()).origin
    )
  ).toBe(true);
});

test('premium shell preserves the senior health path on desktop', async ({
  page,
}) => {
  await stubInsurer(200);
  await page.setViewportSize({ width: 1280, height: 900 });
  await loginAndReachQuotes(page);

  await page.getByTestId(tid('quotesList.startQuote')).click();
  await page.getByTestId(tid('wizard.personal.name')).fill('Demo User');
  await page.getByTestId(tid('wizard.personal.email')).fill('demo@example.com');
  await page.getByTestId(tid('wizard.personal.age')).fill('70');
  await page.getByTestId(tid('wizard.personal.zipCode')).fill('06600');
  await page.getByTestId(tid('common.next')).click();

  await expect(
    page.getByTestId(tid('wizard.coverage.health.title'))
  ).toBeVisible();
  await page.getByTestId(tid('wizard.coverage.premium')).check();
  await expect(page.getByRole('complementary')).toBeVisible();
  await expect(
    page.getByTestId(tid('wizard.coverage.premiumLabel'))
  ).toHaveText(/^\$\d+(?:\.\d{2})?$/);
});
