import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import {
  loginAndReachQuotes,
  stubAuthenticatedQuoteSession,
} from '../support/session';
import { test } from '../support/criticalFlow';

test('authenticated user can navigate the app destinations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await stubAuthenticatedQuoteSession(page);
  await loginAndReachQuotes(page);

  const navigation = page.getByRole('navigation', {
    name: /primary navigation/i,
  });

  await expect(page.getByRole('banner')).toHaveAttribute(
    'data-shell-tone',
    'charcoal'
  );
  await expect(navigation).toHaveAttribute('data-shell-tone', 'charcoal');
  await expect(page.getByRole('contentinfo')).toHaveAttribute(
    'data-shell-tone',
    'charcoal'
  );

  await expect(navigation.getByTestId(tid('navigation.home'))).toHaveAttribute(
    'aria-current',
    'page'
  );

  await navigation.getByTestId(tid('navigation.quotes')).click();
  await expect(page).toHaveURL(/\/quotes\/history$/);
  await expect(
    navigation.getByTestId(tid('navigation.quotes'))
  ).toHaveAttribute('aria-current', 'page');

  await navigation.getByTestId(tid('navigation.newQuote')).click();
  await expect(page).toHaveURL(/\/quote\/personal$/);
  await expect(
    navigation.getByTestId(tid('navigation.newQuote'))
  ).toHaveAttribute('aria-current', 'page');

  await navigation.getByRole('link', { name: 'Account' }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(
    navigation.getByRole('link', { name: 'Account' })
  ).toHaveAttribute('aria-current', 'page');
});

test('mobile navigation reaches every primary destination @mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await stubAuthenticatedQuoteSession(page);
  await loginAndReachQuotes(page);

  const navigation = page.getByRole('navigation', {
    name: /primary navigation/i,
  });

  await navigation.getByTestId(tid('navigation.home')).click();
  await expect(page).toHaveURL(/\/quotes$/);

  await navigation.getByTestId(tid('navigation.quotes')).click();
  await expect(page).toHaveURL(/\/quotes\/history$/);

  await navigation.getByTestId(tid('navigation.newQuote')).click();
  await expect(page).toHaveURL(/\/quote\/personal$/);

  await navigation.getByTestId(tid('navigation.account')).click();
  await expect(page).toHaveURL(/\/account$/);
});

for (const width of [320, 375]) {
  test(`authenticated footer clears the fixed navigation at ${width}px @mobile`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 812 });
    await stubAuthenticatedQuoteSession(page);
    await loginAndReachQuotes(page);

    const navigation = page.getByRole('navigation', {
      name: /primary navigation/i,
    });
    const footer = page.getByRole('contentinfo');

    await expect(page.getByRole('banner')).toHaveAttribute(
      'data-shell-tone',
      'charcoal'
    );
    await expect(navigation).toHaveAttribute('data-shell-tone', 'charcoal');
    await expect(footer).toHaveAttribute('data-shell-tone', 'charcoal');

    await footer.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const [footerBox, navigationBox] = await Promise.all([
      footer.boundingBox(),
      navigation.boundingBox(),
    ]);
    expect(footerBox).not.toBeNull();
    expect(navigationBox).not.toBeNull();
    expect(
      (footerBox?.y ?? Infinity) + (footerBox?.height ?? 0)
    ).toBeLessThanOrEqual((navigationBox?.y ?? -Infinity) + 2);
  });

  test(`mobile wizard actions clear the fixed navigation at ${width}px @mobile`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 812 });
    await stubAuthenticatedQuoteSession(page);
    await loginAndReachQuotes(page);

    const navigation = page.getByRole('navigation', {
      name: /primary navigation/i,
    });
    await navigation.getByTestId(tid('navigation.newQuote')).click();
    await expect(page).toHaveURL(/\/quote\/personal$/);

    await expect(navigation).toBeVisible();
    await expect(navigation).toHaveAttribute('data-shell-tone', 'charcoal');
    await expect(page.getByTestId(tid('wizard.actions'))).toBeVisible();

    expect(
      await page
        .locator('body')
        .evaluate((body) => body.scrollWidth <= window.innerWidth)
    ).toBe(true);

    const actionDock = page.getByTestId(tid('wizard.actions'));
    await expect
      .poll(() =>
        actionDock.evaluate((element) => getComputedStyle(element).position)
      )
      .toBe('fixed');

    const [actionDockZIndex, footerZIndex] = await Promise.all([
      actionDock.evaluate((element) => getComputedStyle(element).zIndex),
      page
        .getByRole('contentinfo')
        .evaluate((element) => getComputedStyle(element).zIndex),
    ]);
    expect(Number(actionDockZIndex)).toBeGreaterThan(Number(footerZIndex) || 0);

    const [dockBox, navigationBox] = await Promise.all([
      actionDock.boundingBox(),
      navigation.boundingBox(),
    ]);
    expect(dockBox).not.toBeNull();
    expect(navigationBox).not.toBeNull();
    expect(
      (dockBox?.y ?? Infinity) + (dockBox?.height ?? 0)
    ).toBeLessThanOrEqual((navigationBox?.y ?? -Infinity) + 2);
  });
}
