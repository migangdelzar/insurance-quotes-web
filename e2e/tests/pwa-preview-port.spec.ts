import { expect, test } from '@playwright/test';

import { getPwaPreviewBaseUrl, getPwaPreviewPort } from '../support/pwaPreview';

test('uses the configured preview port for both server and browser base URL', () => {
  const port = getPwaPreviewPort('43101');

  expect(port).toBe(43101);
  expect(getPwaPreviewBaseUrl(port)).toBe('http://127.0.0.1:43101');
});

test('uses the dedicated default port when no override is supplied', () => {
  expect(getPwaPreviewPort(undefined)).toBe(3101);
});
