import { describe, expect, it, vi } from 'vitest';
import {
  detectLocale,
  getInitialLocale,
  LOCALE_PREFERENCE_STORAGE_KEY,
  normalizeLocale,
  persistLocale,
} from './locale';

describe('locale detection', () => {
  it.each([
    ['en', 'en-US'],
    ['en-US', 'en-US'],
    ['es', 'es-MX'],
    ['es-MX', 'es-MX'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeLocale(input)).toBe(expected);
  });

  it('uses the first supported browser preference', () => {
    expect(detectLocale(['fr-FR', 'es-MX', 'en-US'])).toBe('es-MX');
  });

  it('falls back to en-US when no browser preference is supported', () => {
    expect(detectLocale(['fr-FR', 'de-DE'])).toBe('en-US');
  });

  it('uses an explicitly persisted locale before browser preferences', () => {
    const storage = { getItem: vi.fn().mockReturnValue('es-MX') };

    expect(getInitialLocale(storage, ['en-US'])).toBe('es-MX');
    expect(storage.getItem).toHaveBeenCalledWith(LOCALE_PREFERENCE_STORAGE_KEY);
  });

  it('persists an explicit locale choice through an injected storage boundary', () => {
    const storage = { setItem: vi.fn() };

    persistLocale('es-MX', storage);

    expect(storage.setItem).toHaveBeenCalledWith(
      LOCALE_PREFERENCE_STORAGE_KEY,
      'es-MX'
    );
  });
});
