import elements from './data/elements.json' with { type: 'json' };
import enUS from './data/translations/en-US.json' with { type: 'json' };
import esMX from './data/translations/es-MX.json' with { type: 'json' };

export type Locale = 'en-US' | 'es-MX';
const translations: Record<Locale, typeof enUS> = {
  'en-US': enUS,
  'es-MX': esMX,
};
const resources = {
  'en-US': { translation: enUS },
  'es-MX': { translation: esMX },
} as const;

type Elements = typeof elements;
type ElementReference = { testId: string; i18nKey?: string };
type JoinPath<Prefix extends string, Key extends string> = Prefix extends ''
  ? Key
  : `${Prefix}.${Key}`;
type ElementPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string | ElementReference
    ? JoinPath<Prefix, K>
    : T[K] extends object
      ? ElementPaths<T[K], JoinPath<Prefix, K>>
      : never;
}[keyof T & string];

export type ElementKey = ElementPaths<Elements>;
export function t(key: string, locale: Locale = 'es-MX'): string {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (typeof current !== 'object' || current === null) return undefined;
    return (current as Record<string, unknown>)[part];
  }, translations[locale]);
  return typeof value === 'string' ? value : key;
}

export function tid(key: ElementKey): string {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (typeof current !== 'object' || current === null) return undefined;
    return (current as Record<string, unknown>)[part];
  }, elements);
  if (typeof value === 'string') return value;
  return typeof value === 'object' && value !== null && 'testId' in value
    ? String(value.testId)
    : key;
}

export function getResources() {
  return resources;
}

export function errorMessageKey(code: string): string {
  return code in enUS.errors ? `errors.${code}` : 'common.networkError';
}
