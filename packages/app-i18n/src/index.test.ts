import { describe, expect, it } from 'vitest';
import elements from './data/elements.json';
import enUS from './data/translations/en-US.json';
import esMX from './data/translations/es-MX.json';
import { resources, t, tid, testIds } from './index';

function collectLeafPaths(node: unknown, path = ''): string[] {
  if (typeof node === 'string') return [path];
  if (typeof node !== 'object' || node === null) return [];

  return Object.entries(node).flatMap(([key, value]) =>
    collectLeafPaths(value, path ? `${path}.${key}` : key)
  );
}

function collectStringLeaves(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (typeof node !== 'object' || node === null) return [];
  return Object.values(node).flatMap(collectStringLeaves);
}

describe('i18n catalog', () => {
  it('keeps locale files structurally aligned', () => {
    expect(collectLeafPaths(enUS)).toEqual(collectLeafPaths(esMX));
  });

  it('resolves text and test ids independently from the same key path', () => {
    expect(t('common.appName', 'en-US')).toBe(enUS.common.appName);
    expect(tid('common.appName')).toBe(elements.common.appName);
  });

  it('supports textless elements in the selector catalog', () => {
    expect(tid('layout.main')).toBe('main-content');
    expect(collectLeafPaths(elements)).toContain('layout.main');
  });

  it('returns the requested key when a translation is unavailable', () => {
    expect(t('common.missing', 'es-MX')).toBe('common.missing');
    expect(tid('common.missing')).toBeUndefined();
  });

  it('exposes unique selectors and locale resources', () => {
    const ids = collectStringLeaves(testIds);
    expect(new Set(ids).size).toBe(ids.length);
    expect(resources['en-US'].translation).toBe(enUS);
    expect(resources['es-MX'].translation).toBe(esMX);
  });
});
