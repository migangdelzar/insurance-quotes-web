import { Button, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { COVERAGE_TYPES } from '@clara/api-contract';
import type { CoverageType } from '@clara/api-contract';
import { tid } from '@clara/app-i18n';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { InputHTMLAttributes } from 'react';
import { ApiErrorAlert } from '@shared/components/ApiErrorAlert';
import { PremiumDisplay } from '@features/quote-wizard/components/PremiumDisplay';
import { WizardFrame } from '@features/quote-wizard/components/WizardFrame';
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
  const { updating, error } = useDebouncedCoverageSync(state, dispatch);
  const isSenior = (state.personal?.age ?? 0) > 65;

  const selectCoverage = (value: string) => {
    const coverageType = COVERAGE_TYPES.find((type) => type === value);
    if (coverageType) dispatch({ type: 'COVERAGE_CHANGED', coverage: { ...state.coverage, coverageType } });
  };

  return (
    <WizardFrame
      activeStep={1}
      title={t('wizard.coverage.title')}
      titleProps={{ 'data-testid': tid('wizard.coverage.title') }}
      description={t('wizard.coverage.description')}
    >
      {error ? <ApiErrorAlert error={error} /> : null}
      <Stack spacing={3}>
        <div>
          <FormLabel>{t('wizard.coverage.title')}</FormLabel>
          <RadioGroup value={state.coverage.coverageType ?? ''} onChange={(event) => selectCoverage(event.target.value)}>
            {COVERAGE_TYPES.map((type) => (
              <FormControlLabel key={type} value={type} control={<Radio inputProps={{ 'data-testid': coverageTestIds[type] } as InputHTMLAttributes<HTMLInputElement>} />} label={t(`wizard.coverage.${type.toLowerCase()}`)} />
            ))}
          </RadioGroup>
        </div>
        {isSenior ? <HealthQuestionsSection coverage={state.coverage} onChange={(coverage) => dispatch({ type: 'COVERAGE_CHANGED', coverage })} /> : null}
        <PremiumDisplay premium={state.premium} updating={updating} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ '& > *': { width: { xs: '100%', sm: 'auto' } } }}>
          <Button onClick={() => void navigate('/quote/personal')} data-testid={tid('common.back')}>{t('common.back')}</Button>
          <Button variant="contained" disabled={!state.coverage.coverageType || updating} onClick={() => void navigate('/quote/summary')} data-testid={tid('common.next')}>{t('common.next')}</Button>
        </Stack>
      </Stack>
    </WizardFrame>
  );
}
