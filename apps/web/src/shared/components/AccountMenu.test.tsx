import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@app/i18n';
import { useAuth } from '@features/auth/context/AuthProvider';
import { theme } from '@shared/theme/theme';
import { AccountMenu } from './AccountMenu';

vi.mock('@features/auth/context/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function renderAccountMenu() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MemoryRouter>
          <AccountMenu />
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('AccountMenu', () => {
  beforeEach(async () => {
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
    await i18n.changeLanguage('en-US');
  });

  it('opens the account surface and exposes language and sign-out actions', async () => {
    const user = userEvent.setup();
    renderAccountMenu();

    await user.click(screen.getByRole('button', { name: /account/i }));

    expect(screen.getByRole('menuitem', { name: /español/i })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: /sign out/i })).toBeVisible();
  });
});
