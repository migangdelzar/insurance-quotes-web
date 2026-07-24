import type { Locale } from '@clara/app-i18n';

const supportedLocales = new Set<Locale>(['en-US', 'es-MX']);

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
