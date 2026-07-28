import type { Locale } from '@clara/app-i18n';

const supportedLocales = new Set<Locale>(['en-US', 'es-MX']);
export const LOCALE_PREFERENCE_STORAGE_KEY = 'clara.locale';

export interface LocaleStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function normalizeLocale(value: string | undefined): Locale {
  const normalized = value?.trim().replace('_', '-').toLowerCase();
  if (normalized === 'es' || normalized === 'es-mx') return 'es-MX';
  return 'en-US';
}

function isSupportedPreference(value: string | undefined): boolean {
  const normalized = value?.trim().replace('_', '-').toLowerCase();
  return (
    normalized === 'en' ||
    normalized === 'en-us' ||
    normalized === 'es' ||
    normalized === 'es-mx'
  );
}

export function detectLocale(
  languages: readonly string[] = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]
): Locale {
  for (const language of languages) {
    if (isSupportedPreference(language)) {
      const locale = normalizeLocale(language);
      if (supportedLocales.has(locale)) return locale;
    }
  }
  return 'en-US';
}

function getBrowserStorage(): LocaleStorage | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage;
}

export function getInitialLocale(
  storage: Pick<LocaleStorage, 'getItem'> | undefined = getBrowserStorage(),
  languages?: readonly string[]
): Locale {
  const savedLocale = storage?.getItem(LOCALE_PREFERENCE_STORAGE_KEY);
  if (savedLocale && isSupportedPreference(savedLocale)) {
    return normalizeLocale(savedLocale);
  }

  return languages ? detectLocale(languages) : detectLocale();
}

export function persistLocale(
  locale: Locale,
  storage: Pick<LocaleStorage, 'setItem'> | undefined = getBrowserStorage()
): void {
  storage?.setItem(LOCALE_PREFERENCE_STORAGE_KEY, locale);
}
