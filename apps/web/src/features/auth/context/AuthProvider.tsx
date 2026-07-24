import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { configureHttpClient } from '@shared/api/httpClient';
import * as authApi from '../api/authApi';

const REFRESH_KEY = 'iq.refreshToken';

type SessionState = 'anonymous' | 'mfa-pending' | 'authenticated';
type AuthenticationMethod = 'password' | 'mfa' | 'passkey' | 'refresh' | null;

type AuthContextValue = {
  sessionState: SessionState;
  authenticationMethod: AuthenticationMethod;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  completeMfa: () => Promise<void>;
  loginWithPasskey: () => Promise<void>;
  enrollPasskey: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionState, setSessionState] = useState<SessionState>('anonymous');
  const [authenticationMethod, setAuthenticationMethod] =
    useState<AuthenticationMethod>(null);
  const accessTokenRef = useRef<string | null>(null);
  const mfaTokenRef = useRef<string | null>(null);

  const storeTokens = useCallback(
    (
      accessToken: string,
      refreshToken: string,
      method: AuthenticationMethod
    ) => {
      accessTokenRef.current = accessToken;
      sessionStorage.setItem(REFRESH_KEY, refreshToken);
      setAuthenticationMethod(method);
      setSessionState('authenticated');
    },
    []
  );

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    mfaTokenRef.current = null;
    sessionStorage.removeItem(REFRESH_KEY);
    setSessionState('anonymous');
  }, []);

  const refreshSession = useCallback(async () => {
    const stored = sessionStorage.getItem(REFRESH_KEY);
    if (!stored) {
      return;
    }
    try {
      const pair = await authApi.refresh(stored);
      storeTokens(pair.accessToken ?? '', pair.refreshToken ?? '', 'refresh');
    } catch {
      clearSession();
    }
  }, [clearSession, storeTokens]);

  useEffect(() => {
    configureHttpClient({
      baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
      getAccessToken: () => accessTokenRef.current,
      refreshSession,
      onSessionExpired: clearSession,
    });
  }, [clearSession, refreshSession]);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await authApi.login(username, password);
      if (response.status === 'MFA_REQUIRED') {
        mfaTokenRef.current = response.mfaToken ?? null;
        setSessionState('mfa-pending');
        return;
      }
      storeTokens(
        response.tokens?.accessToken ?? '',
        response.tokens?.refreshToken ?? '',
        'password'
      );
    },
    [storeTokens]
  );

  const completeMfa = useCallback(async () => {
    const pair = await authApi.assertPasskey(mfaTokenRef.current ?? undefined);
    mfaTokenRef.current = null;
    storeTokens(pair.accessToken ?? '', pair.refreshToken ?? '', 'mfa');
  }, [storeTokens]);

  const loginWithPasskey = useCallback(async () => {
    const pair = await authApi.assertPasskey();
    storeTokens(pair.accessToken ?? '', pair.refreshToken ?? '', 'passkey');
  }, [storeTokens]);

  const enrollPasskey = useCallback(() => authApi.registerPasskey(), []);

  const logout = useCallback(async () => {
    const stored = sessionStorage.getItem(REFRESH_KEY);
    if (stored) {
      await Promise.resolve(authApi.logout(stored)).catch(() => undefined);
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      sessionState,
      authenticationMethod,
      isAuthenticated: sessionState === 'authenticated',
      login,
      completeMfa,
      loginWithPasskey,
      enrollPasskey,
      logout,
    }),
    [
      sessionState,
      authenticationMethod,
      login,
      completeMfa,
      loginWithPasskey,
      enrollPasskey,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
