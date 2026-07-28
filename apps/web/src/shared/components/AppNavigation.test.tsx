import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { ColorModeProvider } from '@shared/theme/colorMode';
import { AppNavigation } from './AppNavigation';

function renderNavigation(route: string) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ColorModeProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MemoryRouter initialEntries={[route]}>
            <AppNavigation />
          </MemoryRouter>
        </ThemeProvider>
      </ColorModeProvider>
    </I18nextProvider>
  );
}

describe('AppNavigation', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('keeps every destination accessible and marks the active destination visually', () => {
    renderNavigation('/quotes/history');

    for (const [name, href] of [
      ['Home', '/quotes'],
      ['Quotes', '/quotes/history'],
      ['New quote', '/quote/personal'],
      ['Account', '/account'],
    ]) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
    }

    const activeDestination = screen.getByRole('link', { name: 'Quotes' });
    expect(activeDestination).toHaveAttribute('aria-current', 'page');
    expect(activeDestination).toHaveClass('navigation-action--active');
  });

  it('renders bottom navigation as a labeled navigation landmark', () => {
    renderNavigation('/quotes');

    expect(
      screen.getAllByRole('navigation', { name: /primary navigation/i })
    ).not.toHaveLength(0);
    expect(
      screen.getByRole('navigation', { name: /primary navigation/i })
    ).toHaveAttribute('data-shell-position', 'fixed');
  });

  it('shows an icon for every mobile destination and a non-color active treatment', () => {
    renderNavigation('/quotes');

    for (const label of ['Home', 'Quotes', 'New quote', 'Account']) {
      expect(
        screen
          .getByRole('link', { name: new RegExp(`^${label}$`, 'i') })
          .querySelector('svg')
      ).not.toBeNull();
    }

    expect(screen.getByRole('link', { name: /^home$/i })).toHaveClass(
      'navigation-action--active'
    );
  });
});
