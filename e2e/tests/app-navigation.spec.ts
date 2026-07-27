import { expect, test } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import {
  loginAndReachQuotes,
  stubAuthenticatedQuoteSession,
} from '../support/session';

test('authenticated user can navigate the app destinations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await stubAuthenticatedQuoteSession(page);
  await loginAndReachQuotes(page);

  const navigation = page.getByRole('navigation', {
    name: /primary navigation/i,
  });

  await expect(navigation.getByTestId(tid('navigation.home'))).toHaveAttribute(
    'aria-current',
    'page'
  );

  await navigation.getByTestId(tid('navigation.quotes')).click();
  await expect(page).toHaveURL(/\/quotes\/history$/);
  await expect(
    navigation.getByTestId(tid('navigation.quotes'))
  ).toHaveAttribute('aria-current', 'page');

  await navigation.getByTestId(tid('navigation.newQuote')).click();
  await expect(page).toHaveURL(/\/quote\/personal$/);
  await expect(
    navigation.getByTestId(tid('navigation.newQuote'))
  ).toHaveAttribute('aria-current', 'page');

  await navigation.getByRole('link', { name: 'Account' }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(
    navigation.getByRole('link', { name: 'Account' })
  ).toHaveAttribute('aria-current', 'page');
});

test('mobile navigation remains visible without covering wizard actions @mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await stubAuthenticatedQuoteSession(page);
  await loginAndReachQuotes(page);

  const navigation = page.getByRole('navigation', {
    name: /primary navigation/i,
  });
  await navigation.getByTestId(tid('navigation.newQuote')).click();
  await expect(page).toHaveURL(/\/quote\/personal$/);

  await expect(navigation).toBeVisible();
  await expect(page.getByTestId(tid('wizard.actions'))).toBeVisible();

  expect(
    await page
      .locator('body')
      .evaluate((body) => body.scrollWidth <= window.innerWidth)
  ).toBe(true);

  const actionDock = page.getByTestId(tid('wizard.actions'));
  await expect
    .poll(() =>
      actionDock.evaluate((element) => getComputedStyle(element).position)
    )
    .toBe('fixed');
});
