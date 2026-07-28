import { ApiRequestError, type FieldError } from './ApiRequestError';
import { getInitialLocale, normalizeLocale } from '@app/locale';

type HttpClientConfig = {
  baseUrl: string;
  getAccessToken: () => string | null;
  refreshSession: () => Promise<void>;
  onSessionExpired: () => void;
  getLocale?: () => string;
};

type RequestInitLite = {
  method?: string;
  body?: unknown;
  timeoutMs?: number;
  retryOnUnauthorized?: boolean;
};

const DEFAULT_TIMEOUT_MS = 10_000;

let config: HttpClientConfig = {
  baseUrl: '',
  getAccessToken: () => null,
  refreshSession: () => Promise.resolve(),
  onSessionExpired: () => undefined,
  getLocale: getInitialLocale,
};

export function configureHttpClient(next: HttpClientConfig): void {
  config = next;
}

export async function request<T>(
  path: string,
  init: RequestInitLite = {}
): Promise<T> {
  const response = await performFetch(path, init);
  if (response.status !== 401 || init.retryOnUnauthorized === false) {
    return parseOrThrow<T>(response);
  }

  await config.refreshSession();
  const retried = await performFetch(path, init);
  if (retried.status === 401) {
    config.onSessionExpired();
  }
  return parseOrThrow<T>(retried);
}

async function performFetch(
  path: string,
  init: RequestInitLite
): Promise<Response> {
  if (
    config.baseUrl.startsWith('http') &&
    !new URL(config.baseUrl).pathname.replace(/\/$/, '').endsWith('/api')
  ) {
    throw new ApiRequestError(
      0,
      'INVALID_API_PATH',
      'API requests must use the /api boundary'
    );
  }
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    init.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );
  const headers = new Headers({
    'Content-Type': 'application/json',
    'API-Version': '1.0',
    'Accept-Language': normalizeLocale(config.getLocale?.()),
  });
  const token = config.getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    return await fetch(`${config.baseUrl}${path}`, {
      method: init.method ?? 'GET',
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      signal: controller.signal,
    });
  } catch (cause) {
    const isAbort =
      cause instanceof DOMException && cause.name === 'AbortError';
    throw new ApiRequestError(
      0,
      isAbort ? 'TIMEOUT' : 'NETWORK',
      String(cause)
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function parseOrThrow<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }
    return (await response.json()) as T;
  }

  const body = await response.json().catch(() => ({}));
  const fieldErrors: FieldError[] = Array.isArray(body.fieldErrors)
    ? body.fieldErrors
    : [];
  throw new ApiRequestError(
    response.status,
    typeof body.code === 'string' ? body.code : 'UNKNOWN',
    typeof body.message === 'string' ? body.message : response.statusText,
    fieldErrors,
    typeof body.traceId === 'string' ? body.traceId : undefined
  );
}
