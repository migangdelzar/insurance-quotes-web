import { Checkbox, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { HEALTH_CONDITIONS } from '@clara/api-contract';
import type { HealthCondition } from '@clara/api-contract';
import { testIds } from '@clara/app-i18n';
import { useTranslation } from 'react-i18next';
import type { InputHTMLAttributes } from 'react';
import type { CoverageData } from '@features/quote-wizard/context/wizardReducer';

type Props = { coverage: CoverageData; onChange: (next: CoverageData) => void };

const conditionTestIds: Record<HealthCondition, string> = {
  DIABETES: testIds.wizard.coverage.health.diabetes,
  HEART_DISEASE: testIds.wizard.coverage.health.heartDisease,
  HYPERTENSION: testIds.wizard.coverage.health.hypertension,
  CANCER_HISTORY: testIds.wizard.coverage.health.cancerHistory,
  OTHER: testIds.wizard.coverage.health.other,
};

const conditionLabelKeys: Record<HealthCondition, string> = {
  DIABETES: 'wizard.coverage.health.diabetes',
  HEART_DISEASE: 'wizard.coverage.health.heartDisease',
  HYPERTENSION: 'wizard.coverage.health.hypertension',
  CANCER_HISTORY: 'wizard.coverage.health.cancerHistory',
  OTHER: 'wizard.coverage.health.other',
};

function YesNoQuestion({
  labelKey,
  testId,
  value,
  onAnswer,
}: {
  labelKey: string;
  testId: string;
  value: boolean | null;
  onAnswer: (answer: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <div data-testid={testId}>
      <FormLabel>{t(labelKey)}</FormLabel>
      <RadioGroup row value={value === null ? '' : String(value)} onChange={(event) => onAnswer(event.target.value === 'true')}>
        <FormControlLabel value="true" control={<Radio />} label={t('wizard.coverage.health.yes')} />
        <FormControlLabel value="false" control={<Radio />} label={t('wizard.coverage.health.no')} />
      </RadioGroup>
    </div>
  );
}

export function HealthQuestionsSection({ coverage, onChange }: Props) {
  const { t } = useTranslation();

  const toggleCondition = (condition: HealthCondition) => {
    const conditions = coverage.conditions.includes(condition)
      ? coverage.conditions.filter((item) => item !== condition)
      : [...coverage.conditions, condition];
    onChange({ ...coverage, conditions });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" data-testid={testIds.wizard.coverage.health.title}>
        {t('wizard.coverage.health.title')}
      </Typography>
      <YesNoQuestion labelKey="wizard.coverage.health.preexisting" testId={testIds.wizard.coverage.health.preexisting} value={coverage.hasPreexistingConditions} onAnswer={(answer) => onChange({ ...coverage, hasPreexistingConditions: answer, conditions: answer ? coverage.conditions : [] })} />
      {coverage.hasPreexistingConditions === true ? (
        <FormGroup data-testid={testIds.wizard.coverage.health.conditions}>
          <FormLabel>{t('wizard.coverage.health.conditions')}</FormLabel>
          {HEALTH_CONDITIONS.map((condition) => (
            <FormControlLabel
              key={condition}
              control={<Checkbox checked={coverage.conditions.includes(condition)} onChange={() => toggleCondition(condition)} inputProps={{ 'data-testid': conditionTestIds[condition] } as InputHTMLAttributes<HTMLInputElement>} />}
              label={t(conditionLabelKeys[condition])}
            />
          ))}
        </FormGroup>
      ) : null}
      <YesNoQuestion labelKey="wizard.coverage.health.prescription" testId={testIds.wizard.coverage.health.prescription} value={coverage.takesPrescriptionMedication} onAnswer={(answer) => onChange({ ...coverage, takesPrescriptionMedication: answer })} />
      <YesNoQuestion labelKey="wizard.coverage.health.tobacco" testId={testIds.wizard.coverage.health.tobacco} value={coverage.usesTobacco} onAnswer={(answer) => onChange({ ...coverage, usesTobacco: answer })} />
      <YesNoQuestion labelKey="wizard.coverage.health.spouse" testId={testIds.wizard.coverage.health.spouse} value={coverage.needsSpouseCoverage} onAnswer={(answer) => onChange({ ...coverage, needsSpouseCoverage: answer })} />
    </Stack>
  );
}
