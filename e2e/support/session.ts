import type { Page } from '@playwright/test';
import { testIds } from '@clara/app-i18n';

export const DEMO_USER = { username: 'demo', password: 'demo-password' };

export async function loginWithPassword(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByTestId(testIds.auth.login.username).fill(DEMO_USER.username);
  await page.getByTestId(testIds.auth.login.password).fill(DEMO_USER.password);
  await page.getByTestId(testIds.auth.login.submit).click();
}

export async function skipEnrollmentIfShown(page: Page): Promise<void> {
  const skip = page.getByTestId(testIds.auth.enroll.skip);
  if (await skip.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await skip.click();
  }
}
