import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import {
  loginAndReachQuotes,
  stubAuthenticatedQuoteSession,
} from '../support/session';
import { test } from '../support/criticalFlow';

test('authenticated app routes retain landmarks, headings, and keyboard focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await stubAuthenticatedQuoteSession(page);
  await loginAndReachQuotes(page);

  const navigation = page.getByRole('navigation', {
    name: /primary navigation/i,
  });
  await expect(navigation).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

  const quotes = navigation.getByTestId(tid('navigation.quotes'));
  await quotes.focus();
  await expect(quotes).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/quotes\/history$/);
  await expect(quotes).toBeFocused();
  await expect(quotes).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});

test('account menu closes with Escape and restores focus to its trigger', async ({
  page,
}) => {
  await stubAuthenticatedQuoteSession(page);
  await loginAndReachQuotes(page);

  const accountTrigger = page.getByRole('button', { name: 'Account' });
  await accountTrigger.click();
  await expect(page.getByRole('menu', { name: 'Account' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'Account' })).toBeHidden();
  await expect(accountTrigger).toBeFocused();
});

test('app shell exposes PWA manifest and theme metadata @pwa', async ({
  page,
}) => {
  await page.goto('/login');

  const manifest = page.locator('link[rel="manifest"]');
  await expect(manifest).toHaveAttribute('href', /manifest\.webmanifest$/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    'content',
    '#1D1D1F'
  );
});
