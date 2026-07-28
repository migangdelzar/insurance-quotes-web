import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { enableVirtualAuthenticator } from '../support/webauthn';
import {
  DEMO_TWO_USER,
  loginAndReachQuotes,
  loginWithPasswordAs,
} from '../support/session';
import type { loginWithPassword } from '../support/session';
import { stubInsurer } from '../support/insurer';
import { test } from '../support/consoleClean';

test.describe.configure({ mode: 'serial' });
test.use({ video: 'on' });

async function fillPersonalDetails(
  page: Parameters<typeof loginWithPassword>[0],
  details: { name: string; email: string; age: string }
): Promise<void> {
  await page.getByTestId(tid('wizard.personal.name')).fill(details.name);
  await page.getByTestId(tid('wizard.personal.email')).fill(details.email);
  await page.getByTestId(tid('wizard.personal.age')).fill(details.age);
  await page.getByTestId(tid('wizard.personal.zipCode')).fill('06600');
  await page.getByTestId(tid('common.next')).click();
}

async function startQuote(
  page: Parameters<typeof loginWithPassword>[0],
  details: { name: string; email: string; age: string }
): Promise<void> {
  await page.getByTestId(tid('quotesList.startQuote')).click();
  await fillPersonalDetails(page, details);
}

test('01-standard-quote', async ({ page }) => {
  await stubInsurer(200);
  await loginAndReachQuotes(page);
  await startQuote(page, {
    name: 'Demo Standard',
    email: 'demo-standard@example.com',
    age: '34',
  });

  await page.getByTestId(tid('wizard.coverage.standard')).check();
  await expect(
    page.getByTestId(tid('wizard.coverage.premiumLabel'))
  ).toHaveText(/^\$100(?:\.00)?$/);
  await page.getByTestId(tid('common.next')).click();
  await page.getByTestId(tid('wizard.summary.submit')).click();
  await expect(page.getByTestId(tid('wizard.summary.success'))).toBeVisible();
});

test('02-senior-health-quote', async ({ page }) => {
  await stubInsurer(200);
  await loginAndReachQuotes(page);
  await startQuote(page, {
    name: 'Demo Senior',
    email: 'demo-senior@example.com',
    age: '70',
  });

  await expect(
    page.getByTestId(tid('wizard.coverage.health.title'))
  ).toBeVisible();
  await page.getByTestId(tid('wizard.coverage.standard')).check();
  await page
    .getByTestId(tid('wizard.coverage.health.preexisting'))
    .getByLabel(/yes|sí/i)
    .check();
  await page.getByTestId(tid('wizard.coverage.health.diabetes')).check();
  await page.getByTestId(tid('wizard.coverage.health.hypertension')).check();
  await page
    .getByTestId(tid('wizard.coverage.health.tobacco'))
    .getByLabel(/yes|sí/i)
    .check();
  await page
    .getByTestId(tid('wizard.coverage.health.spouse'))
    .getByLabel(/yes|sí/i)
    .check();
  await page
    .getByTestId(tid('wizard.coverage.health.prescription'))
    .getByLabel(/no/i)
    .check();
  await expect(
    page.getByTestId(tid('wizard.coverage.premiumLabel'))
  ).toHaveText(/^\$327\.6(?:0)?$/);
  await page.getByTestId(tid('common.next')).click();
  await page.getByTestId(tid('wizard.summary.submit')).click();
  await expect(page.getByTestId(tid('wizard.summary.success'))).toBeVisible();
});

test('03-submission-retry', async ({ page }, testInfo) => {
  testInfo.annotations.push({
    type: 'expected-console-error',
    description:
      'Failed to load resource: the server responded with a status of 500',
  });
  await stubInsurer(500);
  await loginAndReachQuotes(page);
  await startQuote(page, {
    name: 'Demo Retry',
    email: 'demo-retry@example.com',
    age: '40',
  });
  await page.getByTestId(tid('wizard.coverage.basic')).check();
  await page.getByTestId(tid('common.next')).click();
  await page.getByTestId(tid('wizard.summary.submit')).click();
  await expect(page.getByTestId(tid('wizard.summary.failure'))).toBeVisible();

  await stubInsurer(200);
  await page.getByTestId(tid('common.retry')).click();
  await expect(page.getByTestId(tid('wizard.summary.success'))).toBeVisible();
});

test('04-passkey-lifecycle', async ({ context, page }, testInfo) => {
  testInfo.annotations.push({
    type: 'expected-console-error',
    description:
      'Failed to load resource: the server responded with a status of 409',
  });
  await enableVirtualAuthenticator(context, page);
  await page.goto('/login');
  await page
    .getByTestId(tid('auth.login.username'))
    .fill(DEMO_TWO_USER.username);
  await page.getByTestId(tid('auth.login.passwordless')).click();
  await expect(
    page.getByTestId(tid('auth.login.passkeySetupRequired'))
  ).toBeVisible();

  await loginWithPasswordAs(page, DEMO_TWO_USER);
  await page.getByTestId(tid('auth.enroll.action')).click();
  await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();

  await page.context().clearCookies();
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('/login');
  await loginWithPasswordAs(page, DEMO_TWO_USER);
  await expect(page.getByTestId(tid('auth.mfa.title'))).toBeVisible();
  await page.getByTestId(tid('auth.login.passwordless')).click();
  await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();
});

test('05-history-and-analytics', async ({ page }) => {
  await loginAndReachQuotes(page);
  await expect(page.getByTestId(tid('quotesList.analytics'))).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /portfolio intelligence/i })
  ).toBeVisible();

  const seed = Date.now();
  for (let index = 1; index <= 6; index += 1) {
    await startQuote(page, {
      name: 'Demo History ' + index + ' ' + seed,
      email: 'demo-history-' + seed + '-' + index + '@example.com',
      age: '34',
    });
    await page.getByTestId(tid('wizard.backToQuotes')).click();
    await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();
  }

  await page.getByTestId(tid('navigation.quotes')).click();
  await expect(page).toHaveURL(/\/quotes\/history$/);
  await page
    .getByTestId(tid('quotesList.search'))
    .fill('Demo History 1 ' + seed);
  await page.getByTestId(tid('quotesList.applyFilters')).click();
  await expect(page.getByTestId(tid('quotesList.search'))).toHaveValue(
    /Demo History 1/
  );
  await page.getByTestId(tid('quotesList.clearFilters')).click();
  await page.getByTestId(tid('quotesList.sortBy')).click();
  await page.getByRole('option', { name: 'Name', exact: true }).click();
  await page.getByTestId(tid('quotesList.direction')).click();
  await page.getByRole('option', { name: 'Ascending', exact: true }).click();
  const pagination = page.getByTestId(tid('quotesList.pagination'));
  await pagination.getByRole('combobox').click();
  await page.getByRole('option', { name: '5', exact: true }).click();
  await expect(pagination).toBeVisible();
});

test('06-observability-and-same-origin', async ({ page }) => {
  const summaryRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/api/quotes/summary')) {
      summaryRequests.push(request.url());
    }
  });

  await loginAndReachQuotes(page);
  await expect(page.getByTestId(tid('quotesList.analytics'))).toBeVisible();
  await expect.poll(() => summaryRequests.length).toBeGreaterThan(0);

  const health = await page.request.get('/api/actuator/health');
  expect(health.ok()).toBe(true);
  const prometheus = await page.request.get('/api/actuator/prometheus');
  expect(prometheus.ok()).toBe(true);
  expect(await prometheus.text()).toContain('http_server_requests');
  expect(
    summaryRequests.every(
      (url) => new URL(url).origin === new URL(page.url()).origin
    )
  ).toBe(true);
});
