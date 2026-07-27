import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { AppNavigation } from './AppNavigation';

function renderNavigation(route: string) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter initialEntries={[route]}>
          <AppNavigation />
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('AppNavigation', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('renders primary destinations with accessible names and active state', () => {
    renderNavigation('/quotes/history');

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
      'href',
      '/quotes'
    );
    expect(screen.getByRole('link', { name: /quotes/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: /new quote/i })).toHaveAttribute(
      'href',
      '/quote/personal'
    );
  });

  it('renders bottom navigation as a labeled navigation landmark', () => {
    renderNavigation('/quotes');

    expect(
      screen.getAllByRole('navigation', { name: /primary navigation/i })
    ).not.toHaveLength(0);
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
