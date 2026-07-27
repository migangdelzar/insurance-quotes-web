import { expect } from '@playwright/test';
import { tid } from '@clara/app-i18n';
import {
  loginAndReachQuotes,
  stubAuthenticatedQuoteSession,
} from '../support/session';
import { test } from '../support/criticalFlow';

type Rgb = readonly [number, number, number];

function parseCssRgb(value: string): Rgb {
  const channels = value
    .match(/\d+(?:\.\d+)?/g)
    ?.slice(0, 3)
    .map(Number);
  if (!channels || channels.length !== 3) {
    throw new Error(`Expected an RGB color, received: ${value}`);
  }

  const [red, green, blue] = channels;
  if (red === undefined || green === undefined || blue === undefined) {
    throw new Error(`Expected an RGB color, received: ${value}`);
  }

  return [red, green, blue] as const;
}

function relativeLuminance([red, green, blue]: Rgb): number {
  const linearize = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return (
    linearize(red) * 0.2126 +
    linearize(green) * 0.7152 +
    linearize(blue) * 0.0722
  );
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = relativeLuminance(parseCssRgb(foreground));
  const backgroundLuminance = relativeLuminance(parseCssRgb(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

test('authenticated app routes retain landmarks, headings, and keyboard focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await stubAuthenticatedQuoteSession(page);
  await loginAndReachQuotes(page);

  const navigation = page.getByRole('navigation', {
    name: /primary navigation/i,
  });
  const banner = page.getByRole('banner');
  const footer = page.getByRole('contentinfo');

  await expect(banner).toHaveAttribute('data-shell-tone', 'charcoal');
  await expect(navigation).toHaveAttribute('data-shell-tone', 'charcoal');
  await expect(footer).toHaveAttribute('data-shell-tone', 'charcoal');

  const shellStyles = await Promise.all(
    [banner, navigation, footer].map((landmark) =>
      landmark.evaluate((element) => {
        const styles = window.getComputedStyle(element);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
        };
      })
    )
  );

  for (const { backgroundColor, color } of shellStyles) {
    expect(contrastRatio(color, backgroundColor)).toBeGreaterThanOrEqual(4.5);
  }

  await expect(navigation).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

  const quotes = navigation.getByTestId(tid('navigation.quotes'));
  await quotes.focus();
  await expect(quotes).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/quotes\/history$/);
  await expect(quotes).toHaveAttribute('aria-current', 'page');
  const destinationHeading = page.getByRole('heading', { level: 1 });
  await expect(destinationHeading).toHaveCount(1);
  await expect(destinationHeading).toHaveAttribute('tabindex', '-1');
  await expect(destinationHeading).toBeFocused();
});

test('account menu closes with Escape and restores focus to its trigger', async ({
  page,
}) => {
  await stubAuthenticatedQuoteSession(page);
  await loginAndReachQuotes(page);

  const accountTrigger = page.getByRole('button', { name: 'Account' });
  await accountTrigger.click();
  await expect(page.getByRole('menu', { name: 'Account' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu', { name: 'Account' })).toBeHidden();
  await expect(accountTrigger).toBeFocused();
});

test('app shell exposes PWA manifest and theme metadata @pwa', async ({
  page,
}) => {
  await page.goto('/login');

  const manifest = page.locator('link[rel="manifest"]');
  await expect(manifest).toHaveAttribute('href', /manifest\.webmanifest$/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    'content',
    '#1D1D1F'
  );
});
