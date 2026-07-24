import type { Page } from '@playwright/test';
import { tid } from '@clara/app-i18n';

export const DEMO_USER = { username: 'demo', password: 'demo-password' };

export async function loginWithPassword(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByTestId(tid('auth.login.username')).fill(DEMO_USER.username);
  await page.getByTestId(tid('auth.login.password')).fill(DEMO_USER.password);
  await page.getByTestId(tid('auth.login.submit')).click();
}

export async function skipEnrollmentIfShown(page: Page): Promise<void> {
  const skip = page.getByTestId(tid('auth.enroll.skip'));
  if (
    await skip
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false)
  ) {
    await skip.click();
  }
  await page.getByTestId(tid('quotesList.title')).waitFor({ state: 'visible' });
}
