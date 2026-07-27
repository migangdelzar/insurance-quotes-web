import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { COVERAGE_TYPES } from '@clara/api-contract';
import type { CoverageType } from '@clara/api-contract';
import { tid } from '@clara/app-i18n';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { InputHTMLAttributes } from 'react';
import { ApiErrorAlert } from '@shared/components/ApiErrorAlert';
import { PremiumDisplay } from '@features/quote-wizard/components/PremiumDisplay';
import { WizardFrame } from '@features/quote-wizard/components/WizardFrame';
import { WizardActionDock } from '@features/quote-wizard/components/WizardActionDock';
import { useQuoteWizard } from '@features/quote-wizard/context/QuoteWizardProvider';
import { HealthQuestionsSection } from './HealthQuestionsSection';
import { useDebouncedCoverageSync } from './useDebouncedCoverageSync';

const coverageTestIds: Record<CoverageType, string> = {
  BASIC: tid('wizard.coverage.basic'),
  STANDARD: tid('wizard.coverage.standard'),
  PREMIUM: tid('wizard.coverage.premium'),
};

export function CoverageStep() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, dispatch } = useQuoteWizard();
  const { updating, error, flush } = useDebouncedCoverageSync(state, dispatch);
  const isSenior = (state.personal?.age ?? 0) > 65;

  const selectCoverage = (value: string) => {
    const coverageType = COVERAGE_TYPES.find((type) => type === value);
    if (coverageType) dispatch({ type: 'COVERAGE_CHANGED', coverage: { ...state.coverage, coverageType } });
  };

  const continueToSummary = async () => {
    try {
      await flush();
      await navigate('/quote/summary');
    } catch {
      // The mutation error remains available through the hook's existing error state.
    }
  };

  return (
    <WizardFrame
      activeStep={1}
      title={t('wizard.coverage.title')}
      titleProps={{ 'data-testid': tid('wizard.coverage.title') }}
      description={t('wizard.coverage.description')}
      stickyActions
    >
      {error ? <ApiErrorAlert error={error} /> : null}
      <Stack spacing={3}>
        <FormControl component="fieldset">
          <FormLabel component="legend" id={`${tid('wizard.coverage.title')}-group-label`}>
            {t('wizard.coverage.title')}
          </FormLabel>
          <RadioGroup
            aria-labelledby={`${tid('wizard.coverage.title')}-group-label`}
            value={state.coverage.coverageType ?? ''}
            onChange={(event) => selectCoverage(event.target.value)}
          >
            {COVERAGE_TYPES.map((type) => (
              <FormControlLabel key={type} value={type} control={<Radio inputProps={{ 'data-testid': coverageTestIds[type] } as InputHTMLAttributes<HTMLInputElement>} />} label={t(`wizard.coverage.${type.toLowerCase()}`)} />
            ))}
          </RadioGroup>
        </FormControl>
        {isSenior ? <HealthQuestionsSection coverage={state.coverage} onChange={(coverage) => dispatch({ type: 'COVERAGE_CHANGED', coverage })} /> : null}
        <PremiumDisplay premium={state.premium} updating={updating} />
        <WizardActionDock>
          <Button onClick={() => void navigate('/quote/personal')} data-testid={tid('common.back')}>{t('common.back')}</Button>
          <Button variant="contained" disabled={!state.coverage.coverageType || updating} onClick={() => void continueToSummary()} data-testid={tid('common.next')}>{t('common.next')}</Button>
        </WizardActionDock>
      </Stack>
    </WizardFrame>
  );
}
