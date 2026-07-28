import { useColorMode, ColorModeProvider } from './colorMode';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

function ColorModeProbe() {
  const { mode, toggleMode } = useColorMode();

  return (
    <>
      <output data-testid="color-mode">{mode}</output>
      <button type="button" onClick={toggleMode}>
        Toggle theme
      </button>
    </>
  );
}

describe('ColorModeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
  });

  it('uses the system preference and persists an explicit choice', async () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);
    const user = userEvent.setup();

    render(
      <ColorModeProvider>
        <ColorModeProbe />
      </ColorModeProvider>
    );

    expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
    await user.click(screen.getByRole('button', { name: 'Toggle theme' }));
    expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
    expect(window.localStorage.getItem('clara.color-mode')).toBe('light');
  });
});
