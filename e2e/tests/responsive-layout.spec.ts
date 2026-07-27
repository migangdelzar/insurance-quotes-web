import { expect, test } from '@playwright/test';
import { tid } from '@clara/app-i18n';

const viewports = [320, 375, 768, 1024, 1440];

for (const width of viewports) {
  test(`login remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/login');

    await expect(page.getByTestId(tid('auth.login.title'))).toBeVisible();
    await expect(page.getByTestId(tid('auth.login.username'))).toBeVisible();
    await expect(page.getByTestId(tid('auth.login.submit'))).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(
      dimensions.viewportWidth
    );

    const skipLink = page.getByTestId(tid('common.skipToContent'));
    await expect(skipLink).toBeAttached();
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    const skipBox = await skipLink.boundingBox();
    expect(skipBox?.x ?? -1).toBeGreaterThanOrEqual(0);
  });
}
