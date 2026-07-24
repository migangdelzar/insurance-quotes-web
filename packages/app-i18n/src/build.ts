import type { TextEntry } from './texts';

type Tree = { [key: string]: TextEntry | Tree };

function isEntry(node: TextEntry | Tree): node is TextEntry {
  return typeof (node as TextEntry).en === 'string';
}

export function pickLocale(
  tree: Tree,
  locale: 'en' | 'es'
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(tree).map(([key, node]) => [
      key,
      isEntry(node) ? node[locale] : pickLocale(node, locale),
    ])
  );
}

export function pickTestIds(tree: Tree): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(tree).map(([key, node]) => [
      key,
      isEntry(node) ? node.testId : pickTestIds(node),
    ])
  );
}
