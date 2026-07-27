import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { WizardActionDock } from './WizardActionDock';

describe('WizardActionDock', () => {
  it('exposes the wizard actions as a navigation region for mobile users', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <WizardActionDock>
            <button type="button">Continue</button>
          </WizardActionDock>
        </ThemeProvider>
      </I18nextProvider>
    );

    expect(
      screen.getByRole('navigation', { name: /quote actions/i })
    ).toHaveAttribute('data-testid', tid('wizard.actions'));
    expect(screen.getByRole('button', { name: 'Continue' })).toBeVisible();
  });
});
