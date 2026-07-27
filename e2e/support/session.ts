import type { Page, Route } from '@playwright/test';
import type { QuoteView } from '@clara/api-contract';
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

export async function loginAndReachQuotes(page: Page): Promise<void> {
  await loginWithPassword(page);
  await skipEnrollmentIfShown(page);
}

export async function stubAuthenticatedQuoteSession(
  page: Page,
  quotes: QuoteView[] = []
): Promise<void> {
  await page.route('**/auth/login', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'AUTHENTICATED',
        tokens: {
          accessToken: 'app-shell-access-token',
          refreshToken: 'app-shell-refresh-token',
          expiresInSeconds: 900,
        },
      }),
    });
  });
  await page.route('**/quotes', async (route: Route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(quotes),
    });
  });
}
