import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import { testIds } from '@clara/app-i18n';
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
  it('renders all four question groups', () => {
    renderSection();

    expect(screen.getByTestId(testIds.wizard.coverage.health.preexisting)).toBeInTheDocument();
    expect(screen.getByTestId(testIds.wizard.coverage.health.prescription)).toBeInTheDocument();
    expect(screen.getByTestId(testIds.wizard.coverage.health.tobacco)).toBeInTheDocument();
    expect(screen.getByTestId(testIds.wizard.coverage.health.spouse)).toBeInTheDocument();
  });

  it('shows conditions only when preexisting conditions are selected', async () => {
    const onChange = vi.fn();
    renderSection({ ...emptyCoverage, hasPreexistingConditions: true }, onChange);

    expect(screen.getByTestId(testIds.wizard.coverage.health.conditions)).toBeInTheDocument();
    await userEvent.click(screen.getByTestId(testIds.wizard.coverage.health.diabetes));
    expect(onChange).toHaveBeenCalled();
  });

  it('hides conditions when preexisting conditions are not selected', () => {
    renderSection({ ...emptyCoverage, hasPreexistingConditions: false });

    expect(screen.queryByTestId(testIds.wizard.coverage.health.conditions)).not.toBeInTheDocument();
  });
});
