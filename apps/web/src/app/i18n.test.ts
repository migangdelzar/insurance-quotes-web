import { afterAll, describe, expect, it } from 'vitest';
import i18n, { setApplicationLocale } from './i18n';
import { LOCALE_PREFERENCE_STORAGE_KEY } from './locale';

describe.sequential('application locale', () => {
  afterAll(async () => {
    await setApplicationLocale('en-US');
    localStorage.removeItem(LOCALE_PREFERENCE_STORAGE_KEY);
  });

  it('synchronizes the document language during initialization', () => {
    const expectedLanguage = i18n.resolvedLanguage === 'es-MX' ? 'es-MX' : 'en';

    expect(document.documentElement.lang).toBe(expectedLanguage);
  });

  it('synchronizes the document language after changing locale', async () => {
    await setApplicationLocale('es-MX');

    expect(document.documentElement.lang).toBe('es-MX');
    expect(localStorage.getItem(LOCALE_PREFERENCE_STORAGE_KEY)).toBe('es-MX');
  });
});
