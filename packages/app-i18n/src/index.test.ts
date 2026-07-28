import { describe, expect, it } from 'vitest';
import enUS from './data/translations/en-US.json';
import esMX from './data/translations/es-MX.json';
import { getResources, t, tid } from './index';

function collectLeafPaths(node: unknown, path = ''): string[] {
  if (typeof node === 'string') return [path];
  if (typeof node !== 'object' || node === null) return [];

  return Object.entries(node).flatMap(([key, value]) =>
    collectLeafPaths(value, path ? `${path}.${key}` : key)
  );
}

describe('i18n catalog', () => {
  it('keeps locale files structurally aligned', () => {
    expect(collectLeafPaths(enUS)).toEqual(collectLeafPaths(esMX));
  });

  it('resolves text and test ids independently from the same key path', () => {
    expect(t('common.appName', 'en-US')).toBe(enUS.common.appName);
    expect(tid('common.appName')).toBe('app-title');
  });

  it('supports textless elements in the selector catalog', () => {
    expect(tid('layout.main')).toBe('main-content');
  });

  it('returns the requested key when a translation is unavailable', () => {
    expect(t('common.missing', 'es-MX')).toBe('common.missing');
  });

  it('exposes locale resources through a method', () => {
    expect(getResources()['en-US'].translation).toBe(enUS);
    expect(getResources()['es-MX'].translation).toBe(esMX);
  });
});
