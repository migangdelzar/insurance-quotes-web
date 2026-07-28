const DEFAULT_PWA_PREVIEW_PORT = 3101;

export function getPwaPreviewPort(value: string | undefined): number {
  if (value === undefined || value === '') {
    return DEFAULT_PWA_PREVIEW_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(
      `E2E_PWA_PREVIEW_PORT must be an integer between 1 and 65535; received ${value}`
    );
  }

  return port;
}

export function getPwaPreviewBaseUrl(port: number): string {
  return `http://127.0.0.1:${port}`;
}
