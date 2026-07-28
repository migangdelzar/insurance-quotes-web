import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as authApi from '../api/authApi';
import { AuthProvider, useAuth } from './AuthProvider';

vi.mock('../api/authApi');

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('stores tokens and authenticates after tokens are issued', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      status: 'TOKENS_ISSUED',
      tokens: {
        accessToken: 'acc',
        refreshToken: 'ref',
        expiresInSeconds: 1800,
      },
    });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(() => result.current.login('demo', 'demo-password'));

    await waitFor(() =>
      expect(result.current.sessionState).toBe('authenticated')
    );
    expect(sessionStorage.getItem('iq.refreshToken')).toBe('ref');
  });

  it('moves to mfa-pending when the server requires MFA', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      status: 'MFA_REQUIRED',
      mfaToken: 'mfa-1',
    });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(() => result.current.login('demo', 'demo-password'));

    expect(result.current.sessionState).toBe('mfa-pending');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('completes MFA with the pending token', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      status: 'MFA_REQUIRED',
      mfaToken: 'mfa-1',
    });
    vi.mocked(authApi.assertPasskey).mockResolvedValue({
      accessToken: 'acc2',
      refreshToken: 'ref2',
      expiresInSeconds: 1800,
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(() => result.current.login('demo', 'demo-password'));

    await act(() => result.current.completeMfa());

    expect(authApi.assertPasskey).toHaveBeenCalledWith('mfa-1');
    expect(result.current.sessionState).toBe('authenticated');
  });

  it('passes the entered username when starting passwordless sign-in', async () => {
    vi.mocked(authApi.assertPasskey).mockResolvedValue({
      accessToken: 'acc3',
      refreshToken: 'ref3',
      expiresInSeconds: 1800,
    });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(() => result.current.loginWithPasskey('demo'));

    expect(authApi.assertPasskey).toHaveBeenCalledWith(undefined, 'demo');
  });

  it('keeps MFA pending when passkey verification fails', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      status: 'MFA_REQUIRED',
      mfaToken: 'mfa-1',
    });
    vi.mocked(authApi.assertPasskey).mockRejectedValue(
      new Error('unknown or expired challenge')
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(() => result.current.login('demo', 'demo-password'));

    await expect(act(() => result.current.completeMfa())).rejects.toThrow(
      'unknown or expired challenge'
    );

    expect(result.current.sessionState).toBe('mfa-pending');
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logout clears the session', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      status: 'TOKENS_ISSUED',
      tokens: {
        accessToken: 'acc',
        refreshToken: 'ref',
        expiresInSeconds: 1800,
      },
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(() => result.current.login('demo', 'demo-password'));

    await act(() => result.current.logout());

    expect(result.current.sessionState).toBe('anonymous');
    expect(sessionStorage.getItem('iq.refreshToken')).toBeNull();
  });
});
