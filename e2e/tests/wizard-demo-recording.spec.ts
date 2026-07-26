import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { tid } from '@clara/app-i18n';

test.use({ video: 'on' });

async function mockApi(page: Page) {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'AUTHENTICATED',
        tokens: {
          accessToken: 'recording-access-token',
          refreshToken: 'recording-refresh-token',
          expiresInSeconds: 900,
        },
      }),
    });
  });
  await page.route('**/api/quotes', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '[]',
      });
      return;
    }
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'recording-quote',
        name: 'Demo User',
        email: 'demo@example.com',
        age: 34,
        zipCode: '06600',
        status: 'DRAFT',
      }),
    });
  });
  await page.route('**/api/quotes/recording-quote/coverage', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'recording-quote',
        name: 'Demo User',
        email: 'demo@example.com',
        age: 34,
        zipCode: '06600',
        status: 'DRAFT',
        coverageType: 'STANDARD',
        monthlyPremium: 130,
      }),
    });
  });
  await page.route('**/api/quotes/recording-quote/submit', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'recording-quote', status: 'SUBMITTED' }),
    });
  });
}

for (const width of [320, 375]) {
  test(`records the happy path at ${width}px`, async ({ page }) => {
    await mockApi(page);
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/login');
    await page.getByTestId(tid('auth.login.username')).fill('demo');
    await page.getByTestId(tid('auth.login.password')).fill('demo-password');
    await page.getByTestId(tid('auth.login.submit')).click();
    await page.getByTestId(tid('auth.enroll.skip')).click();
    await page.getByTestId(tid('quotesList.startQuote')).click();

    await page.getByTestId(tid('wizard.personal.name')).fill('Demo User');
    await page
      .getByTestId(tid('wizard.personal.email'))
      .fill('demo@example.com');
    await page.getByTestId(tid('wizard.personal.age')).fill('34');
    await page.getByTestId(tid('wizard.personal.zipCode')).fill('06600');
    await page.getByTestId(tid('common.next')).click();
    await page.getByTestId(tid('wizard.coverage.standard')).check();
    await expect(page.getByTestId(tid('wizard.actions'))).toBeVisible();
    await page.getByTestId(tid('common.next')).click();
    await page.getByTestId(tid('wizard.summary.submit')).click();
    await expect(page.getByTestId(tid('wizard.summary.success'))).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth
    );
  });
}
