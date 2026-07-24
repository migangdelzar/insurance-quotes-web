import { pickLocale, pickTestIds } from './build';
import { texts } from './texts';

export { texts } from './texts';
export type { TextEntry } from './texts';

type DeepString<T> = {
  [K in keyof T]: T[K] extends { en: string } ? string : DeepString<T[K]>;
};

// The recursive walkers produce this exact shape, but Object.fromEntries
// cannot preserve it through TypeScript's inference.
export const resources = {
  'en-US': { translation: pickLocale(texts, 'en') as DeepString<typeof texts> },
  'es-MX': { translation: pickLocale(texts, 'es') as DeepString<typeof texts> },
} as const;

export const testIds = pickTestIds(texts) as DeepString<typeof texts>;

export function errorMessageKey(code: string): string {
  return code in texts.errors ? `errors.${code}` : 'common.networkError';
}
