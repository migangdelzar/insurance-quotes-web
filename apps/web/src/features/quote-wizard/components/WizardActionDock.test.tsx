import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tid } from '@clara/app-i18n';
import { theme } from '@shared/theme/theme';
import { WizardActionDock } from './WizardActionDock';

describe('WizardActionDock', () => {
  it('exposes the wizard actions as a navigation region for mobile users', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WizardActionDock>
          <button type="button">Continue</button>
        </WizardActionDock>
      </ThemeProvider>
    );

    expect(screen.getByTestId(tid('wizard.actions'))).toHaveRole('navigation');
    expect(screen.getByRole('button', { name: 'Continue' })).toBeVisible();
  });
});
