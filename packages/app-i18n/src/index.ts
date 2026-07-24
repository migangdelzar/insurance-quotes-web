import elements from './data/elements.json';
import enUS from './data/translations/en-US.json';
import esMX from './data/translations/es-MX.json';

export type Locale = 'en-US' | 'es-MX';
export const translations: Record<Locale, typeof enUS> = {
  'en-US': enUS,
  'es-MX': esMX,
};
export const resources = {
  'en-US': { translation: enUS },
  'es-MX': { translation: esMX },
} as const;
export const els = elements;

type Elements = typeof elements;
type ElementReference = { testId: string; i18nKey?: string };
type TestIdTree<T> = {
  [K in keyof T]: T[K] extends string | ElementReference
    ? string
    : TestIdTree<T[K]>;
};

function pickTestIds<T extends Record<string, unknown>>(
  tree: T
): TestIdTree<T> {
  return Object.fromEntries(
    Object.entries(tree).map(([key, value]) => [
      key,
      typeof value === 'string'
        ? value
        : typeof value === 'object' && value !== null && 'testId' in value
          ? String(value.testId)
          : pickTestIds(value as Record<string, unknown>),
    ])
  ) as TestIdTree<T>;
}

export const testIds = pickTestIds(elements) as TestIdTree<Elements>;

export function t(key: string, locale: Locale = 'es-MX'): string {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (typeof current !== 'object' || current === null) return undefined;
    return (current as Record<string, unknown>)[part];
  }, translations[locale]);
  return typeof value === 'string' ? value : key;
}

export function tid(key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (typeof current !== 'object' || current === null) return undefined;
    return (current as Record<string, unknown>)[part];
  }, elements);
  if (typeof value === 'string') return value;
  return typeof value === 'object' && value !== null && 'testId' in value
    ? String(value.testId)
    : undefined;
}

export function findTestId(i18nKey: string): string | undefined {
  const search = (node: unknown): string | undefined => {
    if (typeof node !== 'object' || node === null) return undefined;
    const candidate = node as { i18nKey?: unknown; testId?: unknown };
    if (candidate.i18nKey === i18nKey && typeof candidate.testId === 'string') {
      return candidate.testId;
    }
    for (const value of Object.values(node)) {
      const result = search(value);
      if (result) return result;
    }
    return undefined;
  };

  return search(elements);
}

export function errorMessageKey(code: string): string {
  return code in enUS.errors ? `errors.${code}` : 'common.networkError';
}
