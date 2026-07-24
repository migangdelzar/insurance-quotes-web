import { expect, test } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { enableVirtualAuthenticator } from '../support/webauthn';
import { loginWithPassword } from '../support/session';

// This mutates the shared demo user and is intentionally ordered last.
// The E2E stack starts with a fresh database with no passkeys.
test('passkey lifecycle: enroll → password+passkey MFA → passwordless @mobile', async ({
  context,
  page,
}) => {
  await enableVirtualAuthenticator(context, page);

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
