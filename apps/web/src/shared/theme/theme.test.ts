import { describe, expect, it } from 'vitest';
import { createAppTheme } from './theme';

describe('createAppTheme', () => {
  it('creates distinct accessible light and dark semantic surfaces', () => {
    const light = createAppTheme('light');
    const dark = createAppTheme('dark');

    expect(light.palette.mode).toBe('light');
    expect(dark.palette.mode).toBe('dark');
    expect(light.palette.background.default).not.toBe(
      dark.palette.background.default
    );
    expect(light.palette.divider).not.toBe(dark.palette.divider);
    expect(light.palette.shell.main).not.toBe(dark.palette.shell.main);
  });
});
