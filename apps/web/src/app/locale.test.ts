import { describe, expect, it } from 'vitest';
import { detectLocale, normalizeLocale } from './locale';

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
});
