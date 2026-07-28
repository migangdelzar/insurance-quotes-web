import { ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, beforeEach } from 'vitest';
import i18n from '@app/i18n';
import { ColorModeProvider } from '@shared/theme/colorMode';
import { theme } from '@shared/theme/theme';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows and toggles the current mode without navigation', async () => {
    const user = userEvent.setup();

    render(
      <I18nextProvider i18n={i18n}>
        <ColorModeProvider>
          <ThemeProvider theme={theme}>
            <ThemeToggle />
          </ThemeProvider>
        </ColorModeProvider>
      </I18nextProvider>
    );

    const toggle = screen.getByRole('button', { name: 'Toggle theme' });
    await user.click(toggle);

    expect(toggle).toHaveTextContent(/dark/i);
    expect(window.location.pathname).toBe('/');
  });
});
