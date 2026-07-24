import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('renders product chrome and preserves the main landmark', () => {
    renderWithProviders();

    expect(screen.getByTestId(tid('common.skipToContent'))).toHaveAttribute(
      'href',
      `#${tid('layout.main')}`
    );
    expect(screen.getByRole('banner')).toBeVisible();
    expect(screen.getByRole('main')).toHaveAttribute('id', tid('layout.main'));
    expect(screen.getByTestId(tid('layout.main'))).toBeVisible();
    expect(screen.getByRole('contentinfo')).toBeVisible();
    expect(screen.getByRole('link', { name: /support/i })).toBeVisible();
    expect(
      screen.getByText(/contact your benefits administrator or employer/i)
    ).toBeVisible();
    expect(screen.queryByText(/support@clara\.com/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /privacy & security/i })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: /sign out/i })
    ).not.toBeInTheDocument();
  });

  it('renders sign out only for an authenticated session and calls logout', async () => {
    const logout = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    mockedUseAuth.mockReturnValue({
      sessionState: 'authenticated',
      authenticationMethod: 'password',
      isAuthenticated: true,
      login: vi.fn(),
      completeMfa: vi.fn(),
      loginWithPasskey: vi.fn(),
      enrollPasskey: vi.fn(),
      logout,
    });

    renderWithProviders('/quotes');

    const signOutButton = screen.getByRole('button', { name: /sign out/i });

    expect(signOutButton).toBeVisible();

    await user.click(signOutButton);

    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('switches the shell copy without changing the active route', async () => {
    const user = userEvent.setup();

    renderWithProviders('/login');

    expect(screen.getByText('/login')).toBeVisible();
    expect(screen.getByText(/secure sign-in/i)).toBeVisible();

    await user.click(screen.getByRole('button', { name: /español/i }));

    await waitFor(() => {
      expect(screen.getByText(/acceso seguro/i)).toBeVisible();
    });

    expect(screen.getByText('/login')).toBeVisible();
    expect(screen.getByRole('button', { name: /english/i })).toBeVisible();
  });
});
