import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { useAuth } from '../context/AuthProvider';
import { PasskeyEnrollDialog } from './PasskeyEnrollDialog';

vi.mock('../context/AuthProvider', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

function renderDialog(enrollPasskey: () => Promise<void>, onClose = vi.fn()) {
  mockedUseAuth.mockReturnValue({
    sessionState: 'authenticated',
    authenticationMethod: 'password',
    isAuthenticated: true,
    login: vi.fn(),
    completeMfa: vi.fn(),
    loginWithPasskey: vi.fn(),
    enrollPasskey,
    logout: vi.fn(),
  });

  return {
    onClose,
    ...render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <PasskeyEnrollDialog open onClose={onClose} />
        </ThemeProvider>
      </I18nextProvider>
    ),
  };
}

describe('PasskeyEnrollDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers the passkey from the explicit setup step before closing', async () => {
    const enrollPasskey = vi.fn().mockResolvedValue(undefined);
    const { onClose } = renderDialog(enrollPasskey);
    const user = userEvent.setup();

    expect(screen.getByText(i18n.t('auth.enroll.description'))).toBeVisible();
    await user.click(screen.getByTestId(tid('auth.enroll.action')));

    expect(enrollPasskey).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('keeps setup open and explains when registration fails', async () => {
    const enrollPasskey = vi
      .fn()
      .mockRejectedValue(new Error('registration failed'));
    const { onClose } = renderDialog(enrollPasskey);
    const user = userEvent.setup();

    await user.click(screen.getByTestId(tid('auth.enroll.action')));

    expect(
      await screen.findByTestId(tid('auth.enroll.error'))
    ).toHaveTextContent(i18n.t('auth.enroll.error'));
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByTestId(tid('auth.enroll.action'))).not.toBeDisabled();
  });
});
