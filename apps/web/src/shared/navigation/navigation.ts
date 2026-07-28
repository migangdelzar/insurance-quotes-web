export const primaryDestinations = [
  {
    id: 'home',
    path: '/quotes',
    labelKey: 'navigation.home',
    testIdKey: 'navigation.home',
  },
  {
    id: 'quotes',
    path: '/quotes/history',
    labelKey: 'navigation.quotes',
    testIdKey: 'navigation.quotes',
  },
  {
    id: 'newQuote',
    path: '/quote/personal',
    labelKey: 'navigation.newQuote',
    testIdKey: 'navigation.newQuote',
  },
  {
    id: 'account',
    path: '/account',
    labelKey: 'navigation.account',
    testIdKey: 'navigation.account',
  },
] as const;

export type PrimaryDestination = (typeof primaryDestinations)[number]['id'];

export function getActiveDestination(
  pathname: string,
  search = ''
): PrimaryDestination {
  void search;
  if (pathname.startsWith('/quote/')) return 'newQuote';
  if (pathname.startsWith('/quotes/history')) return 'quotes';
  if (pathname.startsWith('/account')) return 'account';
  return 'home';
}
