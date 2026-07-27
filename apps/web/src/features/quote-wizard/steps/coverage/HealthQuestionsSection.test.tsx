import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { tid } from '@clara/app-i18n';
import i18n from '@app/i18n';
import { emptyCoverage } from '@features/quote-wizard/context/wizardReducer';
import { HealthQuestionsSection } from './HealthQuestionsSection';

const renderSection = (coverage = emptyCoverage, onChange = vi.fn()) =>
  render(
    <I18nextProvider i18n={i18n}>
      <HealthQuestionsSection coverage={coverage} onChange={onChange} />
    </I18nextProvider>,
  );

describe('HealthQuestionsSection', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('renders all four question groups', () => {
    renderSection();

    expect(screen.getByTestId(tid('wizard.coverage.health.preexisting'))).toBeInTheDocument();
    expect(screen.getByTestId(tid('wizard.coverage.health.prescription'))).toBeInTheDocument();
    expect(screen.getByTestId(tid('wizard.coverage.health.tobacco'))).toBeInTheDocument();
    expect(screen.getByTestId(tid('wizard.coverage.health.spouse'))).toBeInTheDocument();
  });

  it('shows conditions only when preexisting conditions are selected', async () => {
    const onChange = vi.fn();
    renderSection({ ...emptyCoverage, hasPreexistingConditions: true }, onChange);

    expect(screen.getByTestId(tid('wizard.coverage.health.conditions'))).toBeInTheDocument();
    await userEvent.click(screen.getByTestId(tid('wizard.coverage.health.diabetes')));
    expect(onChange).toHaveBeenCalled();
  });

  it('hides conditions when preexisting conditions are not selected', () => {
    renderSection({ ...emptyCoverage, hasPreexistingConditions: false });

    expect(screen.queryByTestId(tid('wizard.coverage.health.conditions'))).not.toBeInTheDocument();
  });

  it.each([
    {
      locale: 'en-US',
      names: [
        'Pre-existing conditions?',
        'Prescription medication?',
        'Tobacco use?',
        'Spouse coverage?',
      ],
    },
    {
      locale: 'es-MX',
      names: [
        '¿Condiciones preexistentes?',
        '¿Medicamento con receta?',
        '¿Consumo de tabaco?',
        '¿Cobertura para cónyuge?',
      ],
    },
  ])('gives every health question a localized group name ($locale)', async ({ locale, names }) => {
    await i18n.changeLanguage(locale);
    renderSection({ ...emptyCoverage, hasPreexistingConditions: true });

    for (const name of names) {
      expect(screen.getByRole('radiogroup', { name })).toBeInTheDocument();
    }
    expect(screen.getByRole('group', { name: locale === 'en-US' ? 'Which conditions?' : '¿Cuáles condiciones?' })).toBeInTheDocument();
  });
});
