import { describe, expect, it } from 'vitest';
import { resources, testIds } from './index';
import { texts, type TextEntry } from './texts';

function walkEntries(node: object): TextEntry[] {
  return Object.values(node).flatMap((value) =>
    'en' in value ? [value as TextEntry] : walkEntries(value)
  );
}

describe('app-i18n single source of truth', () => {
  it('every entry has en, es and a unique testId', () => {
    const entries = walkEntries(texts);
    const ids = entries.map((entry) => entry.testId);

    expect(entries.length).toBeGreaterThan(20);
    for (const entry of entries) {
      expect(entry.en).toBeTruthy();
      expect(entry.es).toBeTruthy();
      expect(entry.testId).toMatch(/^[a-z0-9-]+$/);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('emits i18next resources for both locales', () => {
    expect(resources['en-US'].translation.wizard.personal.title).toBe(
      texts.wizard.personal.title.en
    );
    expect(resources['es-MX'].translation.wizard.personal.title).toBe(
      texts.wizard.personal.title.es
    );
  });

  it('testIds mirrors the tree with plain strings', () => {
    expect(testIds.wizard.personal.name).toBe(
      texts.wizard.personal.name.testId
    );
    expect(testIds.auth.login.submit).toBe(texts.auth.login.submit.testId);
  });
});
