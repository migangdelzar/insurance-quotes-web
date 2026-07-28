import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from './ApiRequestError';
import { configureHttpClient, request } from './httpClient';

describe('httpClient', () => {
  const fetchMock = vi.fn();
  const refreshSession = vi.fn();
  const onSessionExpired = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    configureHttpClient({
      baseUrl: 'http://api.test/api',
      getAccessToken: () => 'token-1',
      refreshSession,
      onSessionExpired,
      getLocale: () => 'es-MX',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  const jsonResponse = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  it('sends bearer token and parses json', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { id: 'q1' }));

    const result = await request<{ id: string }>('/quotes/q1');
    const [url, init] = fetchMock.mock.calls.at(0) ?? [];

    expect(result.id).toBe('q1');
    expect(url).toBe('http://api.test/api/quotes/q1');
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer token-1'
    );
    expect(new Headers(init.headers).get('API-Version')).toBe('1.0');
    expect(new Headers(init.headers).get('Accept-Language')).toBe('es-MX');
  });

  it('refreshes once after a 401 and retries', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { code: 'AUTH_REQUIRED' }))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    const result = await request<{ ok: boolean }>('/quotes');

    expect(result.ok).toBe(true);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it('expires the session after a second 401', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { code: 'AUTH_REQUIRED' }))
      .mockResolvedValueOnce(jsonResponse(401, { code: 'AUTH_REQUIRED' }));

    await expect(request('/quotes')).rejects.toBeInstanceOf(ApiRequestError);
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it('does not refresh the session when unauthorized retries are disabled', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(401, { code: 'WEBAUTHN_ASSERTION_FAILED' })
    );

    await expect(
      request('/auth/webauthn/assert', {
        method: 'POST',
        retryOnUnauthorized: false,
      })
    ).rejects.toBeInstanceOf(ApiRequestError);

    expect(refreshSession).not.toHaveBeenCalled();
    expect(onSessionExpired).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('normalizes ApiError bodies', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(422, {
        code: 'QUOTE_HEALTH_DATA_NOT_ALLOWED',
        message: 'nope',
        fieldErrors: [{ field: 'usesTobacco', message: 'not allowed' }],
      })
    );

    const error = await getError(
      request('/quotes/x/coverage', { method: 'PATCH', body: {} })
    );

    expect(error.code).toBe('QUOTE_HEALTH_DATA_NOT_ALLOWED');
    expect(error.fieldErrors).toHaveLength(1);
  });

  it('maps network failure to NETWORK code', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

    const error = await getError(request('/quotes'));

    expect(error.code).toBe('NETWORK');
  });
});

async function getError(promise: Promise<unknown>): Promise<ApiRequestError> {
  try {
    await promise;
  } catch (cause) {
    if (cause instanceof ApiRequestError) {
      return cause;
    }
    throw cause;
  }
  throw new Error('Expected request to fail');
}
