import type { Page } from '@playwright/test';
import { tid } from '@clara/app-i18n';

export const DEMO_USER = { username: 'demo', password: 'demo-password' };
export const DEMO_TWO_USER = {
  username: 'demo-two',
  password: 'demo-password-two',
};
export const DEMO_THREE_USER = {
  username: 'demo-three',
  password: 'demo-password-three',
};

export async function loginWithPasswordAs(
  page: Page,
  user: { username: string; password: string }
): Promise<void> {
  await page.goto('/login');
  await page.getByTestId(tid('auth.login.username')).fill(user.username);
  await page.getByTestId(tid('auth.login.password')).fill(user.password);
  await page.getByTestId(tid('auth.login.submit')).click();
}

export async function loginWithPassword(page: Page): Promise<void> {
  await loginWithPasswordAs(page, DEMO_USER);
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

export async function loginAndReachQuotes(page: Page): Promise<void> {
  await loginWithPassword(page);
  await skipEnrollmentIfShown(page);
}
