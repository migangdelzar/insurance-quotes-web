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

    registerPwa(true);

    expect(serviceWorkerRegister).toHaveBeenCalledWith('/sw.js');
  });

  it('does not register a generated worker in development', async () => {
    const { registerPwa } = await import('./register');

    registerPwa(false);

    expect(serviceWorkerRegister).not.toHaveBeenCalled();
  });

  it('handles registration failures without rejecting startup', async () => {
    serviceWorkerRegister.mockRejectedValueOnce(
      new Error('registration failed')
    );
    const { registerPwa } = await import('./register');

    expect(() => registerPwa(true)).not.toThrow();
    await Promise.resolve();
  });
});
