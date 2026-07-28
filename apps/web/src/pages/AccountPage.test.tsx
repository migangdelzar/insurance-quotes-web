import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, useLocation } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@app/i18n';
import { useAuth } from '@features/auth/context/AuthProvider';
import { theme } from '@shared/theme/theme';
import { AccountPage } from './AccountPage';

vi.mock('@features/auth/context/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function RouteProbe() {
  return <output data-testid="route">{useLocation().pathname}</output>;
}

function renderAccountPage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter initialEntries={['/account']}>
          <AccountPage />
          <RouteProbe />
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('AccountPage', () => {
  const logout = vi.fn();

  beforeEach(async () => {
    logout.mockReset();
    mockedUseAuth.mockReturnValue({
      sessionState: 'authenticated',
      authenticationMethod: 'passkey',
      isAuthenticated: true,
      login: vi.fn(),
      completeMfa: vi.fn(),
      loginWithPasskey: vi.fn(),
      enrollPasskey: vi.fn(),
      logout,
    });
    await i18n.changeLanguage('en-US');
  });

  it('changes visible copy to Spanish without changing the account route', async () => {
    const user = userEvent.setup();
    renderAccountPage();

    await user.click(screen.getByRole('button', { name: /español/i }));

    expect(screen.getByRole('heading', { name: 'Cuenta' })).toBeVisible();
    expect(screen.getByTestId('route')).toHaveTextContent('/account');
  });

  it('signs out through the authenticated session callback', async () => {
    const user = userEvent.setup();
    renderAccountPage();

    await user.click(screen.getByRole('button', { name: /sign out/i }));

    expect(logout).toHaveBeenCalledOnce();
  });

  it('keeps the named security status in a dedicated secure widget surface', () => {
    renderAccountPage();

    const securityHeading = screen.getByRole('heading', {
      level: 2,
      name: /session and security/i,
    });

    expect(securityHeading).toBeVisible();
    expect(securityHeading.closest('[data-widget-tone]')).toHaveAttribute(
      'data-widget-tone',
      'secure'
    );
    expect(screen.getByText(/protected.*passkey/i)).toBeVisible();
  });
});
