import { expect, test } from '@playwright/test';
import type { Page, Route } from '@playwright/test';
import { tid } from '@clara/app-i18n';

const API = 'http://localhost:8080';

async function mockQuoteApi(page: Page) {
  await page.route(`${API}/auth/login`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'AUTHENTICATED',
        tokens: {
          accessToken: 'premium-shell-token',
          refreshToken: 'premium-shell-refresh',
          expiresInSeconds: 900,
        },
      }),
    });
  });

  await page.route(`${API}/quotes`, async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
      return;
    }

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'premium-shell-quote',
        name: 'Demo User',
        email: 'demo@example.com',
        age: 70,
        zipCode: '06600',
        status: 'DRAFT',
        monthlyPremium: 100,
      }),
    });
  });

  await page.route(
    `${API}/quotes/premium-shell-quote/coverage`,
    async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'premium-shell-quote',
          name: 'Demo User',
          email: 'demo@example.com',
          age: 70,
          zipCode: '06600',
          status: 'DRAFT',
          coverageType: 'PREMIUM',
          monthlyPremium: 130,
        }),
      });
    }
  );

  await page.route(
    `${API}/quotes/premium-shell-quote/submit`,
    async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'premium-shell-quote',
          status: 'SUBMITTED',
        }),
      });
    }
  );
}

async function login(page: Page) {
  await page.goto('/login');
  await page.getByTestId(tid('auth.login.username')).fill('demo');
  await page.getByTestId(tid('auth.login.password')).fill('demo-password');
  await page.getByTestId(tid('auth.login.submit')).click();
  await page.getByTestId(tid('auth.enroll.skip')).click();
  await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();
}

test('premium shell preserves the standard quote journey on mobile @mobile', async ({
  page,
}) => {
  await mockQuoteApi(page);
  await page.setViewportSize({ width: 375, height: 800 });
  await login(page);

  await page.getByTestId(tid('quotesList.startQuote')).click();
  await page.getByTestId(tid('wizard.personal.name')).fill('Demo User');
  await page.getByTestId(tid('wizard.personal.email')).fill('demo@example.com');
  await page.getByTestId(tid('wizard.personal.age')).fill('34');
  await page.getByTestId(tid('wizard.personal.zipCode')).fill('06600');
  await page.getByTestId(tid('common.next')).click();

  await expect(page.getByTestId(tid('wizard.coverage.title'))).toBeVisible();
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
  ).toHaveText(/^\$130(?:\.00)?$/);
  await page.getByTestId(tid('common.next')).click();
  await page.getByTestId(tid('wizard.summary.submit')).click();
  await expect(page.getByTestId(tid('wizard.summary.success'))).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('premium shell preserves the senior health path on desktop', async ({
  page,
}) => {
  await mockQuoteApi(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await login(page);

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
  ).toHaveText(/^\$130(?:\.00)?$/);
});
