import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, screen, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { theme } from '@shared/theme/theme';
import { WizardFrame } from './WizardFrame';

function renderFrame() {
  return render(
    <MemoryRouter initialEntries={['/quote/coverage']}>
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
    </MemoryRouter>
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
    expect(
      screen
        .getByRole('heading', { level: 1, name: 'Coverage selection' })
        .closest('[data-widget-tone]')
    ).toHaveAttribute('data-widget-tone', 'workspace');
    expect(
      screen
        .getByRole('heading', { level: 1, name: 'Coverage selection' })
        .closest('[data-widget-boundary]')
    ).toHaveAttribute('data-widget-boundary', 'outlined');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('keeps the heading focusable for route-change announcements', () => {
    renderFrame();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Coverage selection' })
    ).toHaveAttribute('tabindex', '-1');
  });

  it('announces the active wizard stage and leaves the heading focusable', () => {
    renderFrame();

    const progress = screen.getByTestId(tid('wizard.progress'));

    expect(
      within(progress)
        .getByText('Coverage selection', { selector: '.MuiStepLabel-label' })
        .closest('[aria-current="step"]')
    ).not.toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute(
      'tabindex',
      '-1'
    );
  });

  it('keeps the step selector on the focusable heading', () => {
    renderFrame();

    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute(
      'data-testid',
      tid('wizard.coverage.title')
    );
  });

  it('provides a route-safe way back to the quotes page', () => {
    renderFrame();

    expect(
      screen.getByRole('link', { name: 'Back to quotes' })
    ).toHaveAttribute('href', '/quotes');
  });
});
