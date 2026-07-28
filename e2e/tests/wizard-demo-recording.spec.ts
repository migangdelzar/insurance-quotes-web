import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { stubInsurer } from '../support/insurer';
import { loginAndReachQuotes } from '../support/session';
import { test } from '../support/consoleClean';

test.use({ video: 'on' });

for (const width of [320, 375]) {
  test(`records the real API happy path at ${width}px`, async ({ page }) => {
    await stubInsurer(200);
    await page.setViewportSize({ width, height: 800 });
    await loginAndReachQuotes(page);
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
