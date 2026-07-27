import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, useLocation } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { useAuth } from '@features/auth/context/AuthProvider';
import { AppShell } from './AppShell';

vi.mock('@features/auth/context/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function RouteProbe() {
  const location = useLocation();

  return <div>{location.pathname}</div>;
}

function renderWithProviders(route = '/login') {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter initialEntries={[route]}>
          <AppShell>
            <RouteProbe />
          </AppShell>
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('AppShell', () => {
  beforeEach(async () => {
    mockedUseAuth.mockReset();
    mockedUseAuth.mockReturnValue({
      sessionState: 'anonymous',
      authenticationMethod: null,
      isAuthenticated: false,
      login: vi.fn(),
      completeMfa: vi.fn(),
      loginWithPasskey: vi.fn(),
      enrollPasskey: vi.fn(),
      logout: vi.fn(),
    });

    await i18n.changeLanguage('en-US');
  });

  it('keeps login outside authenticated navigation and preserves the main landmark', () => {
    renderWithProviders();

    expect(screen.getByTestId(tid('common.skipToContent'))).toHaveAttribute(
      'href',
      `#${tid('layout.main')}`
    );
    expect(screen.getByRole('banner')).toBeVisible();
    expect(screen.getByRole('main')).toHaveAttribute('id', tid('layout.main'));
    expect(screen.getByTestId(tid('layout.main'))).toBeVisible();
    expect(
      screen.queryByRole('navigation', { name: /primary navigation/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /sign out/i })
    ).not.toBeInTheDocument();
  });

  it('renders authenticated navigation without duplicating account controls', () => {
    mockedUseAuth.mockReturnValue({
      sessionState: 'authenticated',
      authenticationMethod: 'password',
      isAuthenticated: true,
      login: vi.fn(),
      completeMfa: vi.fn(),
      loginWithPasskey: vi.fn(),
      enrollPasskey: vi.fn(),
      logout: vi.fn(),
    });

    renderWithProviders('/quotes');

    expect(
      screen.getAllByRole('navigation', { name: /primary navigation/i })
    ).not.toHaveLength(0);
    expect(
      screen.queryByRole('button', { name: /sign out/i })
    ).not.toBeInTheDocument();
  });
});
