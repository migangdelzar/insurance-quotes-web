import { render, screen, waitFor } from '@testing-library/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import type * as ReactRouter from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { useAuth } from '../context/AuthProvider';
import { theme } from '@shared/theme/theme';
import { LoginPage } from './LoginPage';

vi.mock('../context/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

const navigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof ReactRouter>('react-router');
  return { ...actual, useNavigate: () => navigate };
});

const mockedUseAuth = vi.mocked(useAuth);

function renderPage() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    navigate.mockReset();
    mockedUseAuth.mockReturnValue({
      sessionState: 'mfa-pending',
      authenticationMethod: null,
      isAuthenticated: false,
      login: vi.fn(),
      completeMfa: vi.fn(),
      loginWithPasskey: vi.fn(),
      enrollPasskey: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('navigates after MFA without showing enrollment again', async () => {
    const view = renderPage();

    mockedUseAuth.mockReturnValue({
      sessionState: 'authenticated',
      authenticationMethod: 'mfa',
      isAuthenticated: true,
      login: vi.fn(),
      completeMfa: vi.fn(),
      loginWithPasskey: vi.fn(),
      enrollPasskey: vi.fn(),
      logout: vi.fn(),
    });
    view.rerender(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    );

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/quotes'));
    expect(
      screen.queryByTestId(tid('auth.enroll.title'))
    ).not.toBeInTheDocument();
  });

  it('keeps password and passkey actions available in the premium auth layout', () => {
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

    renderPage();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: i18n.t('auth.login.brandHeadline'),
      })
    ).toBeVisible();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: i18n.t('auth.login.title'),
      })
    ).toBeVisible();
    expect(screen.getByRole('complementary')).toBeVisible();
    expect(screen.getByText(i18n.t('auth.login.trustTitle'))).toBeVisible();
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: i18n.t('auth.login.trustTitle'),
      })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId(tid('auth.login.username'))).toBeVisible();
    expect(screen.getByTestId(tid('auth.login.password'))).toBeVisible();
    expect(screen.getByTestId(tid('auth.login.submit'))).toBeVisible();
    expect(screen.getByTestId(tid('auth.login.passwordless'))).toBeVisible();
  });

  it('gives the sign-in form an accessible name and description', () => {
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

    renderPage();

    const form = screen.getByRole('form', {
      name: i18n.t('auth.login.title'),
    });
    expect(form).toHaveAttribute('aria-describedby', 'auth-login-description');
    expect(screen.getByText(i18n.t('auth.login.description'))).toBeVisible();
  });
});
