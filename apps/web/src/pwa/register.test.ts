import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const serviceWorkerRegister = vi.fn();
const originalServiceWorker = navigator.serviceWorker;

describe('registerPwa', () => {
  beforeEach(() => {
    serviceWorkerRegister.mockReset();
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { register: serviceWorkerRegister },
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: originalServiceWorker,
    });
  });

  it('registers the generated worker for automatic updates', async () => {
    const { registerPwa } = await import('./register');

    registerPwa();

    expect(serviceWorkerRegister).toHaveBeenCalledWith('/sw.js');
  });
});
