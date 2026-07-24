import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import type * as ReactRouter from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { useAuth } from '../context/AuthProvider';
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
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
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
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </I18nextProvider>
    );

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/quotes'));
    expect(
      screen.queryByTestId(tid('auth.enroll.title'))
    ).not.toBeInTheDocument();
  });
});
