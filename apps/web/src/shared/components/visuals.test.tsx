import type { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { alpha, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BrandMark } from './BrandMark';
import { PageIntro } from './PageIntro';
import { StatusBadge } from './StatusBadge';
import { Surface } from './Surface';
import { theme } from '../theme/theme';

function renderWithTheme(node: ReactNode) {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {node}
    </ThemeProvider>
  );
}

function getRgbChannels(color: string) {
  if (color.startsWith('#')) {
    const normalized =
      color.length === 4
        ? color
            .slice(1)
            .split('')
            .map((channel) => `${channel}${channel}`)
            .join('')
        : color.slice(1);

    const value = Number.parseInt(normalized, 16);

    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  }

  const match = color.match(/\d+(\.\d+)?/g);

  if (!match || match.length < 3) {
    throw new Error(`Unable to parse color: ${color}`);
  }

  return match.slice(0, 3).map((value) => Number(value));
}

function getContrastRatio(colorA: string, colorB: string) {
  const getLuminance = (color: string) => {
    const channels = getRgbChannels(color).map((channel) => {
      const normalized = channel / 255;

      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    const [red, green, blue] = channels;

    if (red == null || green == null || blue == null) {
      throw new Error(`Expected three color channels for ${color}`);
    }

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };

  const luminances = [getLuminance(colorA), getLuminance(colorB)].sort(
    (left, right) => right - left
  );
  const [light, dark] = luminances;

  if (light == null || dark == null) {
    throw new Error('Expected two luminance values to compare contrast.');
  }

  return (light + 0.05) / (dark + 0.05);
}

describe('shared visual primitives', () => {
  it('uses the Emme light palette for the quote workspace', () => {
    expect(theme.palette.background.default).toBe('#FBFBFD');
    expect(theme.palette.background.paper).toBe('#FFFFFF');
    expect(theme.palette.primary.main).toBe('#0071E3');
    expect(theme.palette.text.primary).toBe('#1D1D1F');
    expect(theme.palette.text.secondary).toBe('#5F6368');
  });

  it('renders keyboard focus with an observable accessible ring on light and dark surfaces', () => {
    renderWithTheme(
      <>
        <Surface>
          <button type="button">Primary action</button>
        </Surface>
        <Surface tone="dark">
          <button type="button">Secondary action</button>
        </Surface>
      </>
    );

    const lightButton = screen.getByRole('button', { name: 'Primary action' });
    const darkButton = screen.getByRole('button', { name: 'Secondary action' });
    const lightSurface = lightButton.closest('[data-tone="default"]');
    const darkSurface = darkButton.closest('[data-tone="dark"]');

    if (!lightSurface || !darkSurface) {
      throw new Error('Expected surfaces for both focus probes.');
    }

    lightButton.setAttribute('data-focus-visible-added', '');
    darkButton.setAttribute('data-focus-visible-added', '');
    lightButton.focus();
    darkButton.focus();

    const lightFocusStyle = window.getComputedStyle(lightButton);
    const darkFocusStyle = window.getComputedStyle(darkButton);
    const lightSurfaceStyle = window.getComputedStyle(lightSurface);
    const darkSurfaceStyle = window.getComputedStyle(darkSurface);
    const rootStyle = window.getComputedStyle(document.documentElement);
    const lightRingColor = rootStyle
      .getPropertyValue('--clara-focus-ring-inner')
      .trim();
    const darkRingColor = rootStyle
      .getPropertyValue('--clara-focus-ring-outer')
      .trim();

    expect(lightFocusStyle.boxShadow).not.toBe('none');
    expect(darkFocusStyle.boxShadow).not.toBe('none');
    expect(lightFocusStyle.boxShadow).toContain(
      'var(--clara-focus-ring-inner)'
    );
    expect(lightFocusStyle.boxShadow).toContain(
      'var(--clara-focus-ring-outer)'
    );
    expect(lightRingColor).not.toBe('');
    expect(darkRingColor).not.toBe('');

    expect(
      getContrastRatio(darkRingColor, lightSurfaceStyle.backgroundColor)
    ).toBeGreaterThanOrEqual(3);
    expect(
      getContrastRatio(lightRingColor, darkSurfaceStyle.backgroundColor)
    ).toBeGreaterThanOrEqual(3);
  });

  it('renders a page intro with an accessible level-one heading in a generic container', () => {
    const { container } = renderWithTheme(
      <PageIntro
        eyebrow="YOUR PORTFOLIO"
        title="My quotes"
        description="Track every quote in one place."
      />
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'My quotes' })
    ).toBeVisible();
    expect(screen.getByText('YOUR PORTFOLIO')).toBeVisible();
    expect(screen.getByText('Track every quote in one place.')).toBeVisible();
    expect(container.firstElementChild?.tagName).toBe('DIV');
  });

  it('derives the gold surface tone styles from shared theme tokens', () => {
    const accentGold = '#805ad5';
    const customTheme = createTheme(theme, {
      palette: {
        gold: {
          main: accentGold,
          contrastText: '#12051f',
        },
      },
    });

    render(
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Surface tone="gold">
          <button type="button">Review quote</button>
        </Surface>
      </ThemeProvider>
    );

    const surface = screen
      .getByRole('button', { name: 'Review quote' })
      .closest('[data-tone="gold"]');

    if (!surface) {
      throw new Error('Expected gold surface wrapper.');
    }

    const surfaceStyle = window.getComputedStyle(surface);

    expect(surfaceStyle.backgroundColor).toBe(alpha(accentGold, 0.16));
    expect(surfaceStyle.borderTopColor).toBe(alpha(accentGold, 0.42));
  });

  it('derives submitted status styling from shared theme tokens', () => {
    const accentSuccess = '#00875a';
    const customTheme = createTheme(theme, {
      palette: {
        success: {
          main: accentSuccess,
          contrastText: '#f5fffb',
        },
      },
    });

    render(
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <StatusBadge status="SUBMITTED" label="Submitted" />
      </ThemeProvider>
    );

    const label = screen.getByText('Submitted');
    const badge = label.parentElement;

    if (!badge || badge.getAttribute('data-status') !== 'SUBMITTED') {
      throw new Error('Expected submitted status badge wrapper.');
    }

    const badgeStyle = window.getComputedStyle(badge);

    expect(badgeStyle.backgroundColor).toBe(alpha(accentSuccess, 0.12));
    expect(getRgbChannels(badgeStyle.borderTopColor)).toEqual(
      getRgbChannels(accentSuccess)
    );
  });

  it('renders a surface without hiding its children', () => {
    renderWithTheme(
      <Surface tone="dark">
        <button type="button">Review quote</button>
      </Surface>
    );

    const button = screen.getByRole('button', { name: 'Review quote' });

    expect(button).toBeVisible();
    expect(button.closest('[data-tone="dark"]')).not.toBeNull();
  });

  it('keeps status meaning in text instead of color alone', () => {
    renderWithTheme(<StatusBadge status="SUBMITTED" label="Submitted" />);

    expect(screen.getByText('Submitted')).toHaveAttribute(
      'data-status',
      'SUBMITTED'
    );
  });

  it('renders the shared brand mark text treatment', () => {
    renderWithTheme(<BrandMark />);

    expect(screen.getByText('Clara')).toBeVisible();
  });
});
