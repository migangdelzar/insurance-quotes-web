import { describe, expect, it } from 'vitest';
import { getActiveDestination, primaryDestinations } from './navigation';

describe('primary app navigation', () => {
  it('exposes the four app destinations in stable order', () => {
    expect(primaryDestinations.map((item) => item.id)).toEqual([
      'home',
      'quotes',
      'newQuote',
      'account',
    ]);
  });

  it('marks the history route as Quotes and the workspace route as Home', () => {
    expect(getActiveDestination('/quotes', '')).toBe('home');
    expect(getActiveDestination('/quotes/history', '')).toBe('quotes');
    expect(getActiveDestination('/quote/personal', '')).toBe('newQuote');
  });

  it('marks nested quote and account routes as their primary destinations', () => {
    expect(getActiveDestination('/quote/summary', '?from=review')).toBe(
      'newQuote'
    );
    expect(getActiveDestination('/account/security')).toBe('account');
  });

  it('references the shared navigation copy and test-id catalogs', () => {
    expect(primaryDestinations.map((item) => item.labelKey)).toEqual([
      'navigation.home',
      'navigation.quotes',
      'navigation.newQuote',
      'navigation.account',
    ]);
    expect(primaryDestinations.map((item) => item.testIdKey)).toEqual([
      'navigation.home',
      'navigation.quotes',
      'navigation.newQuote',
      'navigation.account',
    ]);
  });
});
