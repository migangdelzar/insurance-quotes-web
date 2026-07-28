import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import { test } from '../support/consoleClean';

const viewports = [320, 375, 768, 1024, 1440];

for (const width of viewports) {
  test(`login remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/login');

    await expect(page.getByTestId(tid('auth.login.title'))).toBeVisible();
    await expect(page.getByTestId(tid('auth.login.username'))).toBeVisible();
    await expect(page.getByTestId(tid('auth.login.submit'))).toBeVisible();
    await expect(page.getByRole('complementary')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

    const loginSurface = page.locator(
      `section[aria-labelledby="${tid('auth.login.title')}"]`
    );
    const surfaceBox = await loginSurface.boundingBox();
    expect(surfaceBox).not.toBeNull();
    expect(surfaceBox?.width ?? 0).toBeLessThanOrEqual(Math.min(560, width));
    expect(
      Math.abs((surfaceBox?.x ?? 0) + (surfaceBox?.width ?? 0) / 2 - width / 2)
    ).toBeLessThanOrEqual(1);

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
