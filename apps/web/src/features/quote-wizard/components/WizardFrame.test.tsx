import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { WizardFrame } from './WizardFrame';

function renderFrame() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WizardFrame
          activeStep={1}
          title="Coverage selection"
          titleProps={{ 'data-testid': tid('wizard.coverage.title') }}
          description="Choose the protection that fits your plan."
          aside={<span>Private and secure</span>}
        >
          <div>Form</div>
        </WizardFrame>
      </ThemeProvider>
    </I18nextProvider>
  );
}

describe('WizardFrame', () => {
  it('renders one heading, progress, content, and reassurance region', () => {
    renderFrame();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Coverage selection' })
    ).toBeVisible();
    expect(screen.getByTestId(tid('wizard.progress'))).toBeVisible();
    expect(screen.getByText('Form')).toBeVisible();
    expect(screen.getByRole('complementary')).toHaveTextContent(
      'Private and secure'
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('keeps the heading focusable for route-change announcements', () => {
    renderFrame();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Coverage selection' })
    ).toHaveAttribute('tabindex', '-1');
  });

  it('keeps the step selector on the focusable heading', () => {
    renderFrame();

    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute(
      'data-testid',
      tid('wizard.coverage.title')
    );
  });
});
