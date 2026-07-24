import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { PremiumDisplay } from './PremiumDisplay';

const renderDisplay = (premium: string | null, updating: boolean) =>
  render(
    <I18nextProvider i18n={i18n}>
      <PremiumDisplay premium={premium} updating={updating} />
    </I18nextProvider>
  );

describe('PremiumDisplay', () => {
  it('shows the server premium verbatim', () => {
    renderDisplay('327.60', false);
    expect(
      screen.getByTestId(tid('wizard.coverage.premiumLabel'))
    ).toHaveTextContent('$327.60');
  });

  it('shows a loading state while updating', () => {
    renderDisplay('100.00', true);
    expect(screen.getByTestId(tid('common.loading'))).toBeInTheDocument();
  });

  it('shows a placeholder when no premium exists', () => {
    renderDisplay(null, false);
    expect(
      screen.getByTestId(tid('wizard.coverage.premiumLabel'))
    ).toHaveTextContent('—');
  });
});
