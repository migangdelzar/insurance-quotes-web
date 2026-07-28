import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { enableVirtualAuthenticator } from '../support/webauthn';
import { DEMO_USER, loginWithPassword } from '../support/session';
import { test } from '../support/consoleClean';

// This mutates the shared demo user and is intentionally ordered last.
// The E2E stack starts with a fresh database with no passkeys.
test('passkey lifecycle: setup → password+passkey MFA → passwordless @mobile', async ({
  context,
  page,
}, testInfo) => {
  testInfo.annotations.push({
    type: 'expected-console-error',
    description:
      'Failed to load resource: the server responded with a status of 409',
  });
  await enableVirtualAuthenticator(context, page);

  await page.goto('/login');
  await page.getByTestId(tid('auth.login.username')).fill(DEMO_USER.username);
  await page.getByTestId(tid('auth.login.passwordless')).click();
  await expect(
    page.getByTestId(tid('auth.login.passkeySetupRequired'))
  ).toBeVisible();

  await loginWithPassword(page);
  await page.getByTestId(tid('auth.enroll.action')).click();
  await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();

  await page.context().clearCookies();
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('/login');

  await loginWithPassword(page);
  await expect(page.getByTestId(tid('auth.mfa.title'))).toBeVisible();

  await page.getByTestId(tid('auth.login.passwordless')).click();
  await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();

  await page.evaluate(() => sessionStorage.clear());
  await page.goto('/login');
  await page.getByTestId(tid('auth.login.passwordless')).click();
  await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();
});
