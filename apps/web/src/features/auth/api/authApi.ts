import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import type {
  LoginResponse,
  TokenPairResponse,
  WebAuthnChallengeResponse,
} from '@clara/api-contract';
import { request } from '@shared/api/httpClient';

export function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  return request('/auth/login', {
    method: 'POST',
    body: { username, password },
  });
}

export function refresh(refreshToken: string): Promise<TokenPairResponse> {
  return request('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}

export function logout(refreshToken: string): Promise<void> {
  return request('/auth/logout', {
    method: 'POST',
    body: { refreshToken },
  });
}

export async function assertPasskey(
  mfaToken?: string,
  username?: string
): Promise<TokenPairResponse> {
  const challenge = await request<WebAuthnChallengeResponse>(
    '/auth/webauthn/assertion-options',
    { method: 'POST', body: username ? { username } : {} }
  );
  const options = JSON.parse(challenge.publicKeyOptionsJson ?? '{}');
  const credential = await startAuthentication({
    optionsJSON: options.publicKey ?? options,
  });
  return request('/auth/webauthn/assert', {
    method: 'POST',
    body: {
      challengeId: challenge.challengeId,
      credentialJson: JSON.stringify(credential),
      mfaToken,
    },
  });
}

export async function registerPasskey(): Promise<void> {
  const challenge = await request<WebAuthnChallengeResponse>(
    '/auth/webauthn/register-options',
    { method: 'POST', body: {} }
  );
  const options = JSON.parse(challenge.publicKeyOptionsJson ?? '{}');
  const credential = await startRegistration({
    optionsJSON: options.publicKey ?? options,
  });
  await request('/auth/webauthn/register', {
    method: 'POST',
    body: {
      challengeId: challenge.challengeId,
      credentialJson: JSON.stringify(credential),
    },
  });
}
