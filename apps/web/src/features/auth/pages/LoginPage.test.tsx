import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('shows passkey setup as an explicit step after password sign-in', async () => {
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

    renderPage();

    expect(
      await screen.findByTestId(tid('auth.enroll.title'))
    ).toHaveTextContent(i18n.t('auth.enroll.title'));
    expect(screen.getByText(i18n.t('auth.enroll.description'))).toBeVisible();
    expect(screen.getByTestId(tid('auth.enroll.action'))).toBeVisible();
  });

  it('renders the passkey MFA prompt as the next accessible heading level', () => {
    renderPage();

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: i18n.t('auth.mfa.title'),
      })
    ).toBeVisible();
  });

  it('renders a focused single-card login surface without the marketing aside', () => {
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

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: i18n.t('auth.login.title'),
      })
    ).toBeVisible();
    expect(
      screen.queryByText(i18n.t('auth.login.brandHeadline'))
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('form', { name: i18n.t('auth.login.title') })
    ).toHaveAttribute('aria-describedby', 'auth-login-description');
    expect(
      screen.queryByRole('heading', {
        level: 3,
        name: i18n.t('auth.login.trustTitle'),
      })
    ).not.toBeInTheDocument();
    expect(screen.getByTestId(tid('auth.login.username'))).toBeVisible();
    expect(screen.getByTestId(tid('auth.login.password'))).toBeVisible();
    expect(screen.getByTestId(tid('auth.login.username'))).toHaveAttribute(
      'name',
      'username'
    );
    expect(screen.getByTestId(tid('auth.login.username'))).toHaveAttribute(
      'autocomplete',
      'username'
    );
    expect(screen.getByTestId(tid('auth.login.password'))).toHaveAttribute(
      'name',
      'password'
    );
    expect(screen.getByTestId(tid('auth.login.password'))).toHaveAttribute(
      'autocomplete',
      'current-password'
    );
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

  it('shows a recoverable error when passwordless sign-in fails', async () => {
    const loginWithPasskey = vi
      .fn()
      .mockRejectedValue(new Error('unknown or expired challenge'));
    mockedUseAuth.mockReturnValue({
      sessionState: 'anonymous',
      authenticationMethod: null,
      isAuthenticated: false,
      login: vi.fn(),
      completeMfa: vi.fn(),
      loginWithPasskey,
      enrollPasskey: vi.fn(),
      logout: vi.fn(),
    });

    renderPage();
    const user = userEvent.setup();

    await user.type(screen.getByTestId(tid('auth.login.username')), 'demo');
    await user.click(screen.getByTestId(tid('auth.login.passwordless')));

    expect(
      await screen.findByTestId(tid('auth.login.passkeyError'))
    ).toHaveTextContent(i18n.t('auth.login.passkeyError'));
    await waitFor(() =>
      expect(
        screen.getByTestId(tid('auth.login.passwordless'))
      ).not.toBeDisabled()
    );
    expect(loginWithPasskey).toHaveBeenCalledWith('demo');
  });

  it('explains that password sign-in is required when no passkey is registered', async () => {
    const loginWithPasskey = vi.fn().mockRejectedValue({
      status: 409,
      code: 'AUTH_PASSKEY_NOT_REGISTERED',
      message: 'No passkey is registered',
    });
    mockedUseAuth.mockReturnValue({
      sessionState: 'anonymous',
      authenticationMethod: null,
      isAuthenticated: false,
      login: vi.fn(),
      completeMfa: vi.fn(),
      loginWithPasskey,
      enrollPasskey: vi.fn(),
      logout: vi.fn(),
    });

    renderPage();
    const user = userEvent.setup();
    await user.type(screen.getByTestId(tid('auth.login.username')), 'demo');
    await user.click(screen.getByTestId(tid('auth.login.passwordless')));

    expect(
      await screen.findByTestId(tid('auth.login.passkeySetupRequired'))
    ).toHaveTextContent(i18n.t('auth.login.passkeySetupRequired'));
    expect(
      screen.queryByTestId(tid('auth.login.passkeyError'))
    ).not.toBeInTheDocument();
  });

  it('shows a recoverable error when MFA passkey verification fails', async () => {
    const completeMfa = vi
      .fn()
      .mockRejectedValue(new Error('unknown or expired challenge'));
    mockedUseAuth.mockReturnValue({
      sessionState: 'mfa-pending',
      authenticationMethod: null,
      isAuthenticated: false,
      login: vi.fn(),
      completeMfa,
      loginWithPasskey: vi.fn(),
      enrollPasskey: vi.fn(),
      logout: vi.fn(),
    });

    renderPage();
    const user = userEvent.setup();

    await user.click(screen.getByTestId(tid('auth.login.passwordless')));

    expect(
      await screen.findByTestId(tid('auth.mfa.passkeyError'))
    ).toHaveTextContent(i18n.t('auth.mfa.passkeyError'));
    await waitFor(() =>
      expect(
        screen.getByTestId(tid('auth.login.passwordless'))
      ).not.toBeDisabled()
    );
    expect(completeMfa).toHaveBeenCalledOnce();
  });
});
