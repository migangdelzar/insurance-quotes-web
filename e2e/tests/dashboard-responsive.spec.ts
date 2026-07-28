import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { loginAndReachQuotes } from '../support/session';
import { test } from '../support/consoleClean';

const viewports = [320, 375, 768, 1024, 1440];

for (const width of viewports) {
  test(`dashboard remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.addInitScript(() => {
      window.localStorage.removeItem('clara.color-mode');
    });
    await loginAndReachQuotes(page);

    await expect(page.getByTestId(tid('quotesList.title'))).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: /primary navigation/i })
    ).toBeVisible();
    await expect(page.getByRole('banner')).toHaveAttribute(
      'data-shell-tone',
      'charcoal'
    );
    await expect(
      page.getByRole('navigation', { name: /primary navigation/i })
    ).toHaveAttribute('data-shell-tone', 'charcoal');
    await expect(page.getByRole('contentinfo')).toHaveAttribute(
      'data-shell-tone',
      'charcoal'
    );
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.getByRole('banner')).toHaveAttribute(
      'data-shell-mode',
      'light'
    );
    await expect(
      page.getByRole('navigation', { name: /primary navigation/i })
    ).toHaveAttribute('data-shell-mode', 'light');
    await expect(page.getByRole('contentinfo')).toHaveAttribute(
      'data-shell-mode',
      'light'
    );

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth
    );
  });
}
